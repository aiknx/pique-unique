'use client';

import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    // Create session
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    return result.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    await fetch('/api/auth/session', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await fetch('/api/auth/session');
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
} 