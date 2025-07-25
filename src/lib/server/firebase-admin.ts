import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let adminApp: App | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

const getFirebaseAdminConfig = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    console.error('Missing Firebase Admin configuration');
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
    console.error('Failed to initialize Firebase Admin:', error);
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
    console.error('Failed to initialize Firebase Admin Auth:', error);
    return null;
  }
};

// Cleanup function for testing
export const cleanupFirebaseAdmin = () => {
  if (adminApp) {
    // Firebase Admin App doesn't have a delete method in this version
    // Just reset the instances
    adminApp = null;
    firestoreInstance = null;
    authInstance = null;
  }
}; 