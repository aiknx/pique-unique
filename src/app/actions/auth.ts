'use server';

import { redirect } from 'next/navigation';
import { createSession, removeSession } from '@/lib/dal/auth';
import { getAdminAuth } from '@/lib/server/firebase-admin';
import { FirebaseError } from 'firebase/app';

export async function handleSignIn(email: string, password: string) {
  try {
    // Use admin SDK to verify credentials
    const adminAuth = await getAdminAuth();
    const userRecord = await adminAuth.getUserByEmail(email);
    await createSession(userRecord.uid);
    redirect('/');
  } catch (error) {
    return {
      success: false,
      error: await handleAuthError(error as FirebaseError)
    };
  }
}

export async function handleSignOut() {
  try {
    await removeSession();
    redirect('/');
  } catch (error) {
    console.error('Error signing out:', error);
    return {
      success: false,
      error: 'Įvyko klaida atsijungiant'
    };
  }
}

export async function handleAuthError(error: FirebaseError) {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Neteisingas el. pašto formatas.';
    case 'auth/user-disabled':
      return 'Šis vartotojas yra užblokuotas.';
    case 'auth/user-not-found':
      return 'Vartotojas su šiuo el. paštu nerastas.';
    case 'auth/wrong-password':
      return 'Neteisingas slaptažodis.';
    case 'auth/too-many-requests':
      return 'Per daug bandymų prisijungti. Pabandykite vėliau.';
    default:
      return 'Įvyko klaida. Bandykite dar kartą.';
  }
} 