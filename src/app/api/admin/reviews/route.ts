import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/server/firebase-admin';
import { SAMPLE_REVIEWS } from '@/app/api/reviews/sample-data';

export async function GET() {
  try {
    const db = getFirebaseAdmin();
    
    // Return empty data during build or if Firebase Admin is not available
    if (!db) {
      return NextResponse.json({
        reviews: SAMPLE_REVIEWS.map(r => ({
          id: r.id,
          authorName: r.name,
          authorEmail: r.name?.toLowerCase?.().replace(/\s.+$/, '') + '@example.com',
          rating: r.rating,
          title: r.comment.slice(0, 24) + '…',
          content: r.comment,
          status: r.status || 'approved',
          createdAt: r.createdAt,
          updatedAt: r.createdAt,
        })),
        total: SAMPLE_REVIEWS.length
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
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching reviews:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
} 