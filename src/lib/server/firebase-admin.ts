import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { firebaseAdminConfig } from '../firebase/config';

// Initialize Firebase Admin
const apps = getApps();

if (!apps.length) {
  try {
    // Check if all required environment variables are set
    if (firebaseAdminConfig.project_id && firebaseAdminConfig.private_key && firebaseAdminConfig.client_email) {
      initializeApp({
        credential: cert(firebaseAdminConfig as ServiceAccount),
      });
    } else {
      console.warn('Firebase Admin not initialized: Missing environment variables');
    }
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
  }
}

// Export functions for easier access
export const getAdminDb = () => {
  try {
    return getFirestore();
  } catch (error) {
    console.warn('Firebase Admin not available:', error);
    return null;
  }
};

export const getAdminAuth = () => {
  try {
    return getAuth();
  } catch (error) {
    console.warn('Firebase Admin not available:', error);
    return null;
  }
}; 