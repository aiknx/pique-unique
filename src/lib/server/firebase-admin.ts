import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import type { ServiceAccount } from 'firebase-admin';

let adminApp: App | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

const getFirebaseAdminConfig = (): ServiceAccount | null => {
  // Try new Firebase Admin variables first, then fall back to old ones
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;

  // Check if we have the minimum required configuration
  if (!projectId || !privateKey || !clientEmail) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Missing Firebase Admin configuration:', {
        projectId: !!projectId,
        privateKey: !!privateKey,
        clientEmail: !!clientEmail
      });
    }
    return null;
  }

  return {
    projectId,
    privateKey,
    clientEmail,
  };
};

export const getFirebaseAdmin = (): Firestore | null => {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  try {
    const config = getFirebaseAdminConfig();
    if (!config) {
      return null;
    }

    if (!adminApp) {
      adminApp = getApps().length === 0 
        ? initializeApp({
            credential: cert(config),
            projectId: config.projectId,
          })
        : getApps()[0];
    }

    firestoreInstance = getFirestore(adminApp);
    return firestoreInstance;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to initialize Firebase Admin:', error);
    }
    return null;
  }
};

export const getAdminAuth = (): Auth | null => {
  if (authInstance) {
    return authInstance;
  }

  try {
    const config = getFirebaseAdminConfig();
    if (!config) {
      return null;
    }

    if (!adminApp) {
      adminApp = getApps().length === 0 
        ? initializeApp({
            credential: cert(config),
            projectId: config.projectId,
          })
        : getApps()[0];
    }

    authInstance = getAuth(adminApp);
    return authInstance;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to initialize Firebase Admin Auth:', error);
    }
    return null;
  }
};

export const cleanupFirebaseAdmin = () => {
  if (adminApp) {
    // tiesiog išvalome kintamuosius, delete() nėra reikalingas ir neveikia Next.js aplinkoje
    adminApp = null;
    firestoreInstance = null;
    authInstance = null;
  }
}; 