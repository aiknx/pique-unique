import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminAuth } from '@/lib/server/firebase-admin';

const SESSION_COOKIE_NAME = 'session';
const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'Trūksta autentifikacijos duomenų' },
        { status: 400 }
      );
    }

    // Check if we're in emulator environment
    const isEmulator = process.env.FIRESTORE_EMULATOR_HOST || 
                      process.env.FIREBASE_AUTH_EMULATOR_HOST || 
                      process.env.NODE_ENV === 'development';
    
    if (isEmulator) {
      // In emulator, just return success without creating session cookie
      if (process.env.NODE_ENV === 'development') {
        console.log('Emulator environment - skipping session cookie creation');
      }
      return NextResponse.json({ status: 'success' });
    }

    // Create session cookie only in production
    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      return NextResponse.json({ error: 'Firebase Admin not available' }, { status: 500 });
    }
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRY,
    });

    // Set cookie options
    const cookieOptions = {
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      maxAge: SESSION_EXPIRY,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    // Set the cookie
    cookies().set(cookieOptions);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Session creation error:', error);
    }
    return NextResponse.json(
      { error: 'Nepavyko sukurti sesijos' },
      { status: 401 }
    );
  }
}

export async function GET() {
  try {
    // Check if we're in emulator environment
    const isEmulator = process.env.FIRESTORE_EMULATOR_HOST || 
                      process.env.FIREBASE_AUTH_EMULATOR_HOST || 
                      process.env.NODE_ENV === 'development';
    
    if (isEmulator) {
      // In emulator, return null user (client-side auth will handle it)
      if (process.env.NODE_ENV === 'development') {
        console.log('Emulator environment - returning null user for session check');
      }
      return NextResponse.json({ user: null });
    }

    const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      return NextResponse.json({ user: null });
    }
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ user: decodedClaims });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Session verification error:', error);
    }
    return NextResponse.json({ user: null });
  }
}

export async function DELETE() {
  try {
    cookies().delete(SESSION_COOKIE_NAME);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Session deletion error:', error);
    }
    return NextResponse.json(
      { error: 'Nepavyko ištrinti sesijos' },
      { status: 500 }
    );
  }
} 