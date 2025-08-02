import { NextResponse } from 'next/server';
import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';

export async function GET() {
  try {
    const db = getFirebaseAdmin();
    const auth = getAdminAuth();
    
    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Firebase Admin not available',
        config: {
          projectId: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
          privateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
          clientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          clientId: !!process.env.FIREBASE_ADMIN_CLIENT_ID,
          clientCertUrl: !!process.env.FIREBASE_ADMIN_CLIENT_CERT_URL,
        }
      }, { status: 500 });
    }
    
    if (!auth) {
      return NextResponse.json({
        success: false,
        error: 'Firebase Admin Auth not available'
      }, { status: 500 });
    }
    
    // Test Firestore connection
    const testDoc = await db.collection('test').doc('connection').get();
    
    return NextResponse.json({
      success: true,
      message: 'Firebase Admin is working correctly',
      firestore: 'Connected',
      auth: 'Connected',
      testDoc: testDoc.exists ? 'Document exists' : 'Document does not exist'
    });
    
  } catch (error) {
    console.error('Firebase Admin test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 