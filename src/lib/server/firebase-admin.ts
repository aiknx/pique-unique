import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { firebaseAdminConfig } from '../firebase/config';

// Initialize Firebase Admin
const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert(firebaseAdminConfig),
  });
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();

// Export functions for easier access
export const getAdminDb = () => adminDb;
export const getAdminAuth = () => adminAuth; 