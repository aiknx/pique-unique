import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const db = getFirebaseAdmin();
    const adminAuth = getAdminAuth();
    
    if (!db || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not available' },
        { status: 500 }
      );
    }

    // Check if user is admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      
      if (!userDoc.exists || !userDoc.data()?.isAdmin) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch all users
    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .orderBy('createdAt', 'desc')
      .get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      lastLoginAt: doc.data().lastLoginAt?.toDate?.() || doc.data().lastLoginAt
    }));

    return NextResponse.json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 