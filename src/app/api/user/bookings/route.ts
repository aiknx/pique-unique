import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Get Firebase Admin
    const db = getFirebaseAdmin();
    const adminAuth = getAdminAuth();
    
    if (!db || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not available' },
        { status: 500 }
      );
    }

    // Get user from session cookie or ID token - REQUIRE AUTHENTICATION
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

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's bookings (avoid composite index by sorting in memory)
    const bookingsSnapshot = await db
      .collection('bookings')
      .where('userId', '==', userId)
      .get();

    const bookings = bookingsSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || doc.data().date,
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      }))
      .sort((a, b) => {
        const aTime = (a.createdAt instanceof Date) ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const bTime = (b.createdAt instanceof Date) ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return bTime - aTime; // desc
      });

    return NextResponse.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { error: 'Nepavyko gauti užsakymų' },
      { status: 500 }
    );
  }
} 