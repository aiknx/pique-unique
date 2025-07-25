import { NextResponse } from 'next/server';
import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

interface FirebaseError {
  code?: string;
  message?: string;
}

export async function POST() {
  try {
    const adminAuth = getAdminAuth();
    const adminDb = getFirebaseAdmin();
    
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not available' },
        { status: 500 }
      );
    }

    const adminEmail = 'admin@test.com';
    const adminPassword = 'test123';

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: 'Test Admin'
    });

    // Create admin user document in Firestore
    await adminDb.collection(COLLECTIONS.USERS).doc(userRecord.uid).set({
      email: adminEmail,
      isAdmin: true,
      createdAt: new Date(),
      displayName: 'Test Admin',
      role: 'admin'
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      }
    });

  } catch (error: unknown) {
    console.error('Error creating admin user:', error);
    // Safe type check for error.code
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as FirebaseError).code === 'auth/email-already-in-use'
    ) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
        error: 'User with this email already exists'
      }, { status: 409 });
    }
    return NextResponse.json({
      success: false,
      message: 'Failed to create admin user',
      error: typeof error === 'object' && error !== null && 'message' in error ? (error as FirebaseError).message : String(error)
    }, { status: 500 });
  }
} 