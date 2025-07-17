import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminAuth, getAdminDb } from '@/lib/server/firebase-admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

const SESSION_COOKIE_NAME = 'session';

export async function GET() {
  try {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Nėra sesijos' },
        { status: 401 }
      );
    }

    const adminAuth = await getAdminAuth();
    if (!adminAuth) {
      return NextResponse.json({ error: 'Firebase Admin not available' }, { status: 500 });
    }
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Check if user is admin using Firestore
    const adminDb = await getAdminDb();
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not available' }, { status: 500 });
    }
    const userDoc = await adminDb.collection(COLLECTIONS.USERS).doc(decodedClaims.uid).get();
    const userData = userDoc.data();
    const isAdmin = userData?.isAdmin || false;
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Nėra administratoriaus teisių' },
        { status: 403 }
      );
    }

    // Return some test admin data
    return NextResponse.json({
      message: 'Admin prieiga sėkminga',
      timestamp: new Date().toISOString(),
      adminUser: {
        email: decodedClaims.email,
        uid: decodedClaims.uid,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin test error:', error);
    return NextResponse.json(
      { error: 'Serverio klaida' },
      { status: 500 }
    );
  }
} 