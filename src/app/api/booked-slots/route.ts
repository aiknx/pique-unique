import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
let db: Firestore | null = null;

if (!getApps().length && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    db = getFirestore();
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
} else if (getApps().length > 0) {
  db = getFirestore();
}

export async function GET(request: NextRequest) {
  try {
    // Return empty data during build or if Firebase Admin is not available
    if (!db || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      return NextResponse.json({
        bookedSlots: [],
        location: 'klaipeda',
        date: ''
      });
    }

    const location = request.nextUrl.searchParams.get('location') || 'klaipeda';
    const date = request.nextUrl.searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Missing date parameter' },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Query Firestore for booked slots
    const bookingsRef = db.collection('bookings');
    const snapshot = await bookingsRef
      .where('location', '==', location)
      .where('date', '>=', startOfDay)
      .where('date', '<=', endOfDay)
      .where('status', 'in', ['pending', 'confirmed'])
      .get();

    const bookedSlots: string[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.timeSlot && data.timeSlot.start) {
        bookedSlots.push(data.timeSlot.start);
      }
    });

    return NextResponse.json({
      bookedSlots,
      location,
      date
    });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booked slots' },
      { status: 500 }
    );
  }
} 