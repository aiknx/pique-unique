import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin, getAdminAuth } from '@/lib/server/firebase-admin';

export async function GET(
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

    // Check if user is admin - use Authorization header
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

    // Fetch booking by ID
    const bookingDoc = await db.collection('bookings').doc(params.id).get();
    
    if (!bookingDoc.exists) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const bookingData = bookingDoc.data();
    const booking = {
      id: bookingDoc.id,
      ...bookingData,
      createdAt: bookingData?.createdAt?.toDate?.() || bookingData?.createdAt,
      date: bookingData?.date?.toDate?.() || bookingData?.date
    };

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

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

    // Check if user is admin - use Authorization header
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
    const { status, auditLog, ...updateData } = body;

    // Get current booking data for audit log
    const bookingDoc = await db.collection('bookings').doc(params.id).get();
    if (!bookingDoc.exists) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const currentData = bookingDoc.data();

    // Update booking
    const bookingRef = db.collection('bookings').doc(params.id);
    const updateFields: Record<string, unknown> = {
      updatedAt: new Date()
    };

    if (status) {
      updateFields.status = status;
    }

    // Add other fields if provided
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        updateFields[key] = updateData[key];
      }
    });

    await bookingRef.update(updateFields);

    // Create audit log entry if auditLog data is provided
    if (auditLog) {
      try {
        const { auditLogger } = await import('@/lib/audit-logger');
        await auditLogger.logAction({
          actorUid: decodedToken.uid,
          action: auditLog.action || 'booking_update',
          bookingId: params.id,
          before: auditLog.before || { status: currentData?.status },
          after: auditLog.after || { status },
          timestamp: new Date(),
          metadata: auditLog.metadata
        });
      } catch (auditError) {
        console.error('Failed to create audit log:', auditError);
        // Don't fail the update if audit logging fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
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

    // Check if user is admin - use Authorization header
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

    // Delete booking
    await db.collection('bookings').doc(params.id).delete();

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
} 