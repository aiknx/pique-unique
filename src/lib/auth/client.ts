'use client';

import { auth } from '../firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}; 