import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export async function GET(request: NextRequest) {
  try {
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