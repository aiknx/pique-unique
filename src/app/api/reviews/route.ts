import { NextRequest, NextResponse } from 'next/server';
// import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';
import { SAMPLE_REVIEWS, type PublicReview } from './sample-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, comment, bookingId } = body;

    // Validate required fields
    if (!rating || !comment || !bookingId) {
      return NextResponse.json(
        { error: 'Trūksta būtinų duomenų' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Įvertinimas turi būti nuo 1 iki 5' },
        { status: 400 }
      );
    }

    // For now: simulate persistence by appending to in-memory list
    const newReview: PublicReview = {
      id: 'temp-' + Date.now(),
      name: body.name || 'Svečių atsiliepimas',
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10),
      image: body.image || undefined,
      isPublic: false,
      status: 'pending',
      createdAt: new Date(),
    };

    // Mutate local array so that GET returns it (ephemeral per instance)
    SAMPLE_REVIEWS.unshift(newReview);

    return NextResponse.json({
      success: true,
      reviewId: newReview.id,
      message: 'Atsiliepimas sėkmingai priimtas ir laukia patvirtinimo'
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating review:', error);
    }
    return NextResponse.json(
      { error: 'Nepavyko išsaugoti atsiliepimo' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const res = NextResponse.json({
      reviews: SAMPLE_REVIEWS,
      total: SAMPLE_REVIEWS.length
    });
    res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    return res;
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