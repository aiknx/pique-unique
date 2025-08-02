import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/server/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactInfo } = body;

    // Validate contact info
    if (!contactInfo?.email) {
      return NextResponse.json(
        { error: 'Trūksta el. pašto adreso' },
        { status: 400 }
      );
    }

    // Get Firebase Admin
    const db = getFirebaseAdmin();
    
    if (!db) {
      console.error('Firebase Admin not available');
      return NextResponse.json(
        { error: 'Serverio klaida - Firebase Admin nepasiekiamas' },
        { status: 500 }
      );
    }

    // Create simple test booking
    const testBookingData = {
      location: 'test',
      date: new Date(),
      theme: 'test',
      time: '10:00',
      guestCount: 2,
      basePrice: 100,
      additionalServices: [],
      additionalPrice: 0,
      totalPrice: 100,
      contactInfo: contactInfo,
      status: 'pending',
      paymentStatus: 'pending',
      userId: `test_${Date.now()}`,
      userEmail: contactInfo.email,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to Firestore
    const bookingRef = await db.collection('bookings').add(testBookingData);
    const bookingId = bookingRef.id;

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Test rezervacija sėkmingai išsaugota',
      data: testBookingData
    });

  } catch (error) {
    console.error('Error creating test booking:', error);
    return NextResponse.json(
      { error: 'Nepavyko išsaugoti test rezervacijos' },
      { status: 500 }
    );
  }
} 