import { cache } from 'react';
import { cookies } from 'next/headers';
import { getAdminAuth, getFirebaseAdmin } from '../server/firebase-admin';
import { COLLECTIONS } from '../firebase/schema';

const SESSION_COOKIE_NAME = 'session';
const SESSION_EXPIRY = 60 * 60 * 24 * 5; // 5 days

export const verifySession = cache(async () => {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const adminAuth = await getAdminAuth();
    if (!adminAuth) {
      throw new Error('Firebase Admin not available');
    }
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
});

export const getUser = cache(async () => {
  const session = await verifySession();
  
  if (!session) {
    return null;
  }

  try {
    const adminDb = getFirebaseAdmin();
    if (!adminDb) {
      throw new Error('Firebase Admin not available');
    }
    const userDoc = await adminDb.collection(COLLECTIONS.USERS).doc(session.uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return null;
    }

    return {
      ...userData,
      id: session.uid,
      email: session.email,
    };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
});

export async function createSession(uid: string) {
  const adminAuth = await getAdminAuth();
  if (!adminAuth) {
    throw new Error('Firebase Admin not available');
  }
  const customToken = await adminAuth.createCustomToken(uid);
  const expiresIn = SESSION_EXPIRY * 1000;
  const sessionCookie = await adminAuth.createSessionCookie(customToken, { expiresIn });
  
  cookies().set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: SESSION_EXPIRY,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function removeSession() {
  cookies().delete(SESSION_COOKIE_NAME);
} 