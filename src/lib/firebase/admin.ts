import { Firestore } from 'firebase-admin/firestore';
import { getAdminDb } from '../server/firebase-admin';

// Legacy compatibility - redirect to centralized admin
export function getFirebaseAdmin(): Firestore | null {
  return getAdminDb();
}

export function getFirebaseAdminApp() {
  // Return null for legacy compatibility
  return null;
} 