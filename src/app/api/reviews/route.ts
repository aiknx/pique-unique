import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating, comment, bookingId, images } = body;

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

    // Get Firebase Admin
    const db = getFirebaseAdmin();
    const adminAuth = getAdminAuth();
    
    if (!db || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not available' },
        { status: 500 }
      );
    }

    // Get user from session cookie - REQUIRE AUTHENTICATION
    const sessionCookie = request.cookies.get('session')?.value;
    let userId = null;
    let userEmail = null;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Reikia prisijungti prieš atsiliepimo kūrimą' },
        { status: 401 }
      );
    }

    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
      userId = decodedClaims.uid;
      userEmail = decodedClaims.email;
    } catch {
      console.log('Invalid session cookie');
      return NextResponse.json(
        { error: 'Neteisingas prisijungimas' },
        { status: 401 }
      );
    }

    // Verify that the booking exists and belongs to the user
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) {
      return NextResponse.json(
        { error: 'Rezervacija nerasta' },
        { status: 404 }
      );
    }

    const bookingData = bookingDoc.data();
    if (bookingData?.userId !== userId) {
      return NextResponse.json(
        { error: 'Neturite teisės palikti atsiliepimo už šią rezervaciją' },
        { status: 403 }
      );
    }

    // Create review document
    const reviewData = {
      userId,
      userEmail,
      bookingId,
      rating,
      comment,
      images: images || [],
      isPublic: false, // Admin must approve
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to Firestore
    const reviewRef = await db.collection('reviews').add(reviewData);
    const reviewId = reviewRef.id;

    return NextResponse.json({
      success: true,
      reviewId,
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
    const db = getFirebaseAdmin();
    
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase Admin not available' },
        { status: 500 }
      );
    }

    // Get public reviews only
    const reviewsRef = db.collection('reviews');
    const snapshot = await reviewsRef
      .where('isPublic', '==', true)
      .where('status', '==', 'approved')
      .orderBy('createdAt', 'desc')
      .limit(20)
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