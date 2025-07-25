import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { name, description, price, imageUrl, isActive } = body;

    // Validate required fields
    if (!name || !description || !price) {
      return NextResponse.json(
        { error: 'Trūksta būtinų duomenų' },
        { status: 400 }
      );
    }

    // Update theme
    const updateData = {
      name,
      description,
      price: parseFloat(price),
      imageUrl: imageUrl || null,
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date()
    };

    await db.collection('themes').doc(params.id).update(updateData);

    return NextResponse.json({
      message: 'Tema sėkmingai atnaujinta',
      themeId: params.id
    });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Delete theme
    await db.collection('themes').doc(params.id).delete();

    return NextResponse.json({
      message: 'Tema sėkmingai ištrinta',
      themeId: params.id
    });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json(
      { error: 'Failed to delete theme' },
      { status: 500 }
    );
  }
} 