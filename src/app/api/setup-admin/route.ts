import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/server/firebase-admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

export async function POST(request: NextRequest) {
  try {
    const adminAuth = await getAdminAuth();
    const adminDb = await getAdminDb();
    
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

  } catch (error: any) {
    console.error('Error creating admin user:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
        error: 'User with this email already exists'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create admin user',
      error: error.message
    }, { status: 500 });
  }
} 