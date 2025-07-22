import { initializeApp, getApps, cert, ServiceAccount, deleteApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { firebaseAdminConfig } from '../firebase/config';

let isInitialized = false;
let firestoreSettingsConfigured = false;

// Initialize Firebase Admin only once
function initializeFirebaseAdmin() {
  if (isInitialized) {
    return;
  }

  // Clear any existing apps to avoid conflicts
  const existingApps = getApps();
  existingApps.forEach(app => {
    try {
      deleteApp(app);
    } catch {
      // App already deleted or in use, ignore
    }
  });

  try {
    // Check if we're in emulator environment
    const isEmulator = process.env.FIRESTORE_EMULATOR_HOST || 
                      process.env.FIREBASE_AUTH_EMULATOR_HOST || 
                      process.env.NODE_ENV === 'development';
    
    if (isEmulator) {
      console.log('Initializing Firebase Admin with emulator configuration');
      // In emulator environment, no credentials needed
      initializeApp({
        projectId: 'pique-unique'
      });
    } else {
      // In production, use service account
      console.log('Production environment detected');
      console.log('Checking Firebase Admin config...');
      console.log('project_id:', firebaseAdminConfig.project_id ? 'SET' : 'MISSING');
      console.log('private_key:', firebaseAdminConfig.private_key ? 'SET' : 'MISSING');
      console.log('client_email:', firebaseAdminConfig.client_email ? 'SET' : 'MISSING');
      console.log('private_key_id:', firebaseAdminConfig.private_key_id ? 'SET' : 'MISSING');
      console.log('client_id:', firebaseAdminConfig.client_id ? 'SET' : 'MISSING');
      console.log('client_x509_cert_url:', firebaseAdminConfig.client_x509_cert_url ? 'SET' : 'MISSING');
      
      if (firebaseAdminConfig.project_id && firebaseAdminConfig.private_key && firebaseAdminConfig.client_email) {
        console.log('Initializing Firebase Admin with service account');
        initializeApp({
          credential: cert(firebaseAdminConfig as ServiceAccount),
        });
      } else {
        console.warn('Firebase Admin not initialized: Missing environment variables');
        console.warn('Missing variables:', {
          project_id: !firebaseAdminConfig.project_id,
          private_key: !firebaseAdminConfig.private_key,
          client_email: !firebaseAdminConfig.client_email,
          private_key_id: !firebaseAdminConfig.private_key_id,
          client_id: !firebaseAdminConfig.client_id,
          client_x509_cert_url: !firebaseAdminConfig.client_x509_cert_url
        });
        return;
      }
    }
    
    isInitialized = true;
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
  }
}

// Configure Firestore settings only once
function configureFirestoreSettings(db: Firestore) {
  if (firestoreSettingsConfigured) {
    return;
  }

  try {
    // Only set emulator settings once in development
    if (process.env.NODE_ENV === 'development') {
      // Check if settings are already configured
      const currentSettings = (db as { _settings?: { host?: string } })._settings;
      if (!currentSettings || !currentSettings.host) {
        db.settings({
          host: 'localhost:8080',
          ssl: false,
        });
        console.log('Firestore emulator settings configured');
      }
    }
    
    firestoreSettingsConfigured = true;
  } catch (error) {
    console.error('Failed to configure Firestore settings:', error);
  }
}

// Export functions for easier access
export const getAdminDb = () => {
  if (!isInitialized) {
    initializeFirebaseAdmin();
  }
  
  try {
    const db = getFirestore();
    
    // Configure settings only once
    if (!firestoreSettingsConfigured) {
      configureFirestoreSettings(db);
    }
    
    return db;
  } catch (error) {
    console.error('Failed to get Firestore instance:', error);
    return null;
  }
};

export const getAdminAuth = () => {
  if (!isInitialized) {
    initializeFirebaseAdmin();
  }
  
  try {
    return getAuth();
  } catch (error) {
    console.error('Failed to get Auth instance:', error);
    return null;
  }
};

// Alias for getAdminDb for backward compatibility
export const getFirebaseAdmin = getAdminDb; 