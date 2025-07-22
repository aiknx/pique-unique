import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const db = getFirebaseAdmin();
    
    // Return empty data during build or if Firebase Admin is not available
    if (!db) {
      return NextResponse.json({
        reviews: [],
        total: 0
      });
    }

    const reviewsRef = db.collection('reviews');
    const snapshot = await reviewsRef
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));

    return NextResponse.json({
      reviews,
      total: reviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
} 