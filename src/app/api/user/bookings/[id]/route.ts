import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';

// Allow a logged-in user to update their own booking's limited fields
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getFirebaseAdmin();
    const adminAuth = getAdminAuth();

    if (!db || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not available' },
        { status: 500 }
      );
    }

    // Authenticate user via session cookie or Bearer token
    const sessionCookie = request.cookies.get('session')?.value;
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (sessionCookie) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
        userId = decodedClaims.uid;
      } catch {
        // ignore
      }
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const idToken = authHeader.substring(7);
        const decodedClaims = await adminAuth.verifyIdToken(idToken);
        userId = decodedClaims.uid;
      } catch {
        // ignore
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingId = params.id;
    const bookingRef = db.collection('bookings').doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const bookingData = bookingSnap.data() as Record<string, unknown> | undefined;
    if (!bookingData || bookingData.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Whitelist updatable fields for users
    const allowed: Record<string, unknown> = {};
    if (body?.contactInfo && typeof body.contactInfo === 'object') {
      allowed.contactInfo = {
        ...((bookingData.contactInfo as Record<string, unknown>) || {}),
        ...body.contactInfo,
      };
    }
    if (typeof body?.specialRequests === 'string') {
      allowed.specialRequests = body.specialRequests;
    }
    // Allow tentative reschedule request notes, but not actual date/time change directly
    if (typeof body?.rescheduleNote === 'string') {
      allowed.rescheduleNote = body.rescheduleNote;
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
    }

    allowed.updatedAt = new Date();
    await bookingRef.set(allowed, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}


