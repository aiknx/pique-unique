import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/server/firebase-admin';
import { getAdminAuth } from '@/lib/server/firebase-admin';

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
        console.log('Invalid session cookie');
      }
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const idToken = authHeader.substring(7);
        const decodedClaims = await adminAuth.verifyIdToken(idToken);
        userId = decodedClaims.uid;
        userEmail = decodedClaims.email;
      } catch {
        console.log('Invalid ID token');
      }
    }

    // Require authentication for booking
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Turite prisijungti, kad galėtumėte atlikti rezervaciją' },
        { status: 401 }
      );
    }

    // Create booking document
    const bookingData = {
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
    const bookingRef = await db.collection('bookings').add(bookingData);
    const bookingId = bookingRef.id;

    // Send confirmation emails
    try {
      await sendConfirmationEmails(bookingId, bookingData);
    } catch (emailError) {
      console.error('Failed to send confirmation emails:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Rezervacija sėkmingai išsaugota'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Nepavyko išsaugoti rezervacijos' },
      { status: 500 }
    );
  }
}

async function sendConfirmationEmails(bookingId: string, bookingData: Record<string, unknown> & { contactInfo?: { email?: string }, date: Date }) {
  try {
    // Send email to customer
    if (bookingData.contactInfo?.email) {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-booking-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: bookingData.contactInfo.email,
          bookingDetails: {
            id: bookingId,
            ...bookingData,
            date: bookingData.date.toISOString()
          }
        }),
      });
    }

    // Send notification to admin
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-admin-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingDetails: {
          id: bookingId,
          ...bookingData,
          date: bookingData.date.toISOString()
        }
      }),
    });

  } catch (error) {
    console.error('Error sending confirmation emails:', error);
    throw error;
  }
} 