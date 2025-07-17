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
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing startDate or endDate parameters' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Query Firestore for booked dates
    const bookingsRef = db.collection('bookings');
    const snapshot = await bookingsRef
      .where('location', '==', location)
      .where('date', '>=', start)
      .where('date', '<=', end)
      .where('status', 'in', ['pending', 'confirmed'])
      .get();

    const bookedDates = new Set<string>();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const date = data.date.toDate();
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      bookedDates.add(dateString);
    });

    return NextResponse.json({
      bookedDates: Array.from(bookedDates),
      location,
      startDate,
      endDate
    });
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booked dates' },
      { status: 500 }
    );
  }
} 