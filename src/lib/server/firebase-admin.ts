import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let adminApp: App | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;

const getFirebaseAdminConfig = () => {
  // Try new Firebase Admin variables first, then fall back to old ones
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const privateKeyId = process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID || process.env.FIREBASE_PRIVATE_KEY_ID;
  const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  const clientId = process.env.FIREBASE_ADMIN_CLIENT_ID || process.env.FIREBASE_CLIENT_ID;
  const clientCertUrl = process.env.FIREBASE_ADMIN_CLIENT_CERT_URL || process.env.FIREBASE_CLIENT_CERT_URL;

  // Check if we have the minimum required configuration
  if (!projectId || !privateKey || !clientEmail) {
    console.error('Missing Firebase Admin configuration:', {
      projectId: !!projectId,
      privateKey: !!privateKey,
      clientEmail: !!clientEmail,
      privateKeyId: !!privateKeyId,
      clientId: !!clientId,
      clientCertUrl: !!clientCertUrl
    });
    return null;
  }

  return {
    type: "service_account",
    project_id: projectId,
    private_key_id: privateKeyId || undefined,
    private_key: privateKey,
    client_email: clientEmail,
    client_id: clientId || undefined,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: clientCertUrl || undefined,
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
            projectId: config.project_id,
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
            projectId: config.project_id,
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