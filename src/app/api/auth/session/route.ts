import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/server/firebase-admin';

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

    // Create session cookie
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
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Nepavyko sukurti sesijos' },
      { status: 401 }
    );
  }
}

export async function GET() {
  try {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ user: decodedClaims });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ user: null });
  }
}

export async function DELETE() {
  try {
    cookies().delete(SESSION_COOKIE_NAME);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { error: 'Nepavyko ištrinti sesijos' },
      { status: 500 }
    );
  }
} 