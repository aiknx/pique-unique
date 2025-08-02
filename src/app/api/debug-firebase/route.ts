import { NextResponse } from 'next/server';
import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      FIREBASE_ADMIN_PROJECT_ID: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
      FIREBASE_ADMIN_PRIVATE_KEY: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      FIREBASE_ADMIN_CLIENT_EMAIL: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      FIREBASE_ADMIN_CLIENT_ID: !!process.env.FIREBASE_ADMIN_CLIENT_ID,
      FIREBASE_ADMIN_CLIENT_CERT_URL: !!process.env.FIREBASE_ADMIN_CLIENT_CERT_URL,
      // Fallback variables
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    };

    // Try to get Firebase Admin
    const db = getFirebaseAdmin();
    const auth = getAdminAuth();
    
    let firestoreStatus = 'Not initialized';
    let authStatus = 'Not initialized';
    let testDocStatus = 'Not tested';

    if (db) {
      firestoreStatus = 'Connected';
      try {
        // Test Firestore connection
        const testDoc = await db.collection('test').doc('connection').get();
        testDocStatus = testDoc.exists ? 'Document exists' : 'Document does not exist';
      } catch (error) {
        testDocStatus = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }

    if (auth) {
      authStatus = 'Connected';
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: {
        node_env: process.env.NODE_ENV,
        vercel_env: process.env.VERCEL_ENV,
        vercel_url: process.env.VERCEL_URL,
      },
      firebase_config: envCheck,
      firebase_status: {
        firestore: firestoreStatus,
        auth: authStatus,
        test_document: testDocStatus,
      },
      debug_info: {
        has_db: !!db,
        has_auth: !!auth,
        error_details: db ? null : 'Firebase Admin initialization failed'
      }
    });
    
  } catch (error) {
    console.error('Debug Firebase error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 