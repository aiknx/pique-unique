import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/server/firebase-admin';
import { getAdminAuth } from '@/lib/server/firebase-admin';
import { bookingSchema } from '@/lib/validation/booking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get Firebase Admin
    const db = getFirebaseAdmin();
    const adminAuth = getAdminAuth();
    
    if (!db || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not available' },
        { status: 500 }
      );
    }

    // Get user from session cookie or ID token
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
        // Invalid session cookie - continue without auth
      }
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const idToken = authHeader.substring(7);
        const decodedClaims = await adminAuth.verifyIdToken(idToken);
        userId = decodedClaims.uid;
        userEmail = decodedClaims.email;
      } catch {
        // Invalid ID token - continue without auth
      }
    }

    // Require authentication for draft
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Turite prisijungti, kad galėtumėte išsaugoti juodraštį' },
        { status: 401 }
      );
    }

    // Validate partial data (only validate fields that are present)
    const partialSchema = bookingSchema.partial();
    const validatedData = partialSchema.parse(body);

    // Create draft document
    const draftData = {
      ...validatedData,
      userId: userId,
      userEmail: userEmail,
      isDraft: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if draft already exists
    const existingDraft = await db.collection('bookings/drafts')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    let draftRef;
    if (!existingDraft.empty) {
      // Update existing draft
      draftRef = existingDraft.docs[0].ref;
      await draftRef.update(draftData);
    } else {
      // Create new draft
      draftRef = await db.collection('bookings/drafts').add(draftData);
    }

    return NextResponse.json({
      success: true,
      draftId: draftRef.id,
      message: 'Juodraštis išsaugotas'
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating/updating draft:', error);
    }
    return NextResponse.json(
      { error: 'Nepavyko išsaugoti juodraščio' },
      { status: 500 }
    );
  }
}
