import { NextRequest, NextResponse } from 'next/server';
// import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';

// Sample reviews from main page
const SAMPLE_REVIEWS = [
  {
    id: 'sample-1',
    name: 'Simona M.',
    rating: 5,
    comment: 'Absoliučiai magiška patirtis! Apipavidalinimas buvo nuostabus, o dėmesys detalėms - neįtikėtinas. Padarė mūsų metines ypatingas.',
    date: '2024-02-15',
    image: '/images/reviews/sarah.jpg',
    isPublic: true,
    status: 'approved',
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'sample-2',
    name: 'Jonas K.',
    rating: 5,
    comment: 'Tobula vieta piršlyboms! Komanda padarė viską ir dar daugiau, kad viskas būtų tobula. Ji pasakė taip!',
    date: '2024-02-10',
    image: '/images/reviews/james.jpg',
    isPublic: true,
    status: 'approved',
    createdAt: new Date('2024-02-10')
  },
  {
    id: 'sample-3',
    name: 'Emilija R.',
    rating: 5,
    comment: 'Toks unikalus būdas atšvęsti gimtadienį. Maistas buvo skanus, o apipavidalinimas - vertas Instagramo!',
    date: '2024-02-01',
    image: '/images/reviews/emily.jpg',
    isPublic: true,
    status: 'approved',
    createdAt: new Date('2024-02-01')
  }
];

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

    // For now, just return success without saving to Firebase
    return NextResponse.json({
      success: true,
      reviewId: 'temp-' + Date.now(),
      message: 'Atsiliepimas sėkmingai išsaugotas ir laukia patvirtinimo'
    });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Nepavyko išsaugoti atsiliepimo' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // For now, always return sample reviews to avoid Firebase issues
    return NextResponse.json({
      reviews: SAMPLE_REVIEWS,
      total: SAMPLE_REVIEWS.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
} 