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

    // Fetch all themes
    const themesRef = db.collection('themes');
    const snapshot = await themesRef
      .orderBy('createdAt', 'desc')
      .get();

    const themes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
    }));

    return NextResponse.json({
      themes,
      total: themes.length
    });
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, description, price, imageUrl } = body;

    // Validate required fields
    if (!name || !description || !price) {
      return NextResponse.json(
        { error: 'Trūksta būtinų duomenų' },
        { status: 400 }
      );
    }

    // Create new theme
    const themeData = {
      name,
      description,
      price: parseFloat(price),
      imageUrl: imageUrl || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const themeRef = await db.collection('themes').add(themeData);
    const newTheme = {
      id: themeRef.id,
      ...themeData
    };

    return NextResponse.json({
      theme: newTheme,
      message: 'Tema sėkmingai sukurta'
    });
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json(
      { error: 'Failed to create theme' },
      { status: 500 }
    );
  }
} 