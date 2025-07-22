import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'session';

export async function POST() {
  try {
    // Clear the session cookie
    cookies().delete(SESSION_COOKIE_NAME);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sėkmingai atsijungta' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Nepavyko atsijungti' },
      { status: 500 }
    );
  }
} 