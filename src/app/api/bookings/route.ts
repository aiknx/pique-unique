import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';
import { BookingData } from '@/lib/email/ics-generator'; // Import BookingData interface

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      location,
      date,
      theme,
      time,
      guestCount,
      basePrice,
      additionalServices,
      additionalPrice,
      totalPrice,
      contactInfo
    } = body;

    // Validate required fields
    if (!location || !date || !theme || !time || !guestCount || !totalPrice) {
      return NextResponse.json(
        { error: 'Trūksta būtinų duomenų' },
        { status: 400 }
      );
    }

    // Get Firebase Admin
    const db = getFirebaseAdmin();
    const adminAuth = getAdminAuth();
    
    if (!db || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not available' },
        { status: 500 }
      );
    }

    // Get user from session cookie or ID token - AUTHENTICATION OPTIONAL
    const sessionCookie = request.cookies.get('session')?.value;
    const authHeader = request.headers.get('authorization');
    let userId = null;
    let userEmail = null;

    if (sessionCookie) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
        userId = decodedClaims.uid;
        userEmail = decodedClaims.email;
      } catch {
        // Invalid session cookie - continue without auth
      }
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const idToken = authHeader.substring(7);
        const decodedClaims = await adminAuth.verifyIdToken(idToken);
        userId = decodedClaims.uid;
        userEmail = decodedClaims.email;
      } catch {
        // Invalid ID token - continue without auth
      }
    }

    // Require authentication for booking
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Turite prisijungti, kad galėtumėte atlikti rezervaciją' },
        { status: 401 }
      );
    }

    if (body.finalize) {
      // Create final booking document
      const finalBookingData = {
        location,
        date: new Date(date),
        theme,
        time,
        guestCount,
        basePrice,
        additionalServices: additionalServices || [],
        additionalPrice: additionalPrice || 0,
        totalPrice,
        contactInfo: contactInfo || {},
        status: 'pending',
        paymentStatus: 'pending',
        userId: userId,
        userEmail: userEmail,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to Firestore
      const bookingRef = await db.collection('bookings').add(finalBookingData);
      const bookingId = bookingRef.id;

      // Delete draft if exists
      try {
        const existingDraft = await db.collection('bookings/drafts')
          .where('userId', '==', userId)
          .limit(1)
          .get();
        
        if (!existingDraft.empty) {
          await existingDraft.docs[0].ref.delete();
        }
      } catch (draftError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to delete draft:', draftError);
        }
        // Don't fail the booking if draft deletion fails
      }

      // Send confirmation emails
      try {
        await sendConfirmationEmails(bookingId, finalBookingData);
      } catch (emailError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to send confirmation emails:', emailError);
        }
        // Don't fail the booking if email fails
      }

      return NextResponse.json({
        success: true,
        bookingId,
        message: 'Rezervacija sėkmingai išsaugota'
      });
    } else {
      // Save as draft
      const draftData = {
        location,
        date: new Date(date),
        theme,
        time,
        guestCount,
        basePrice,
        additionalServices: additionalServices || [],
        additionalPrice: additionalPrice || 0,
        totalPrice,
        contactInfo: contactInfo || {},
        userId: userId,
        userEmail: userEmail,
        isDraft: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Check if draft already exists
      const existingDraft = await db.collection('bookings/drafts')
        .where('userId', '==', userId)
        .limit(1)
        .get();

      let draftRef;
      if (!existingDraft.empty) {
        // Update existing draft
        draftRef = existingDraft.docs[0].ref;
        await draftRef.update(draftData);
      } else {
        // Create new draft
        draftRef = await db.collection('bookings/drafts').add(draftData);
      }

      return NextResponse.json({
        success: true,
        draftId: draftRef.id,
        message: 'Juodraštis išsaugotas'
      });
    }

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating booking:', error);
    }
    return NextResponse.json(
      { error: 'Nepavyko išsaugoti rezervacijos' },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmails(bookingId: string, bookingData: Record<string, unknown>) {
  try {
    const { emailService } = await import('@/lib/email/email-service');
    
    const emailBookingData: BookingData = {
      id: bookingId,
      location: bookingData.location as string,
      date: bookingData.date instanceof Date ? bookingData.date : new Date(bookingData.date as string),
      time: (bookingData.timeSlot as { start: string; end: string; }).start, // Map timeSlot to time
      theme: bookingData.theme as string, // Use theme string
      guestCount: bookingData.guestCount as number,
      contactInfo: bookingData.contactInfo as { name: string; email: string; phone: string; },
    };

    // Send confirmation email to customer
    await emailService.sendBookingConfirmation(emailBookingData);
    
    // Send notification to admin
    await emailService.sendAdminNotification(emailBookingData);

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error sending confirmation emails:', error);
    }
    throw error;
  }
} 