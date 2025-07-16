import { auth, db } from './index';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from './schema';

export async function seedTestData() {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Seeding is only allowed in development mode');
    return;
  }

  try {
    // Create test admin user
    const adminEmail = 'admin@test.com';
    const adminPassword = 'test123';

    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const adminUser = userCredential.user;

    // Create admin user document
    await setDoc(doc(db, COLLECTIONS.USERS, adminUser.uid), {
      email: adminEmail,
      isAdmin: true,
      createdAt: new Date(),
      displayName: 'Test Admin'
    });

    // Create some test bookings
    const bookings = [
      {
        id: 'booking1',
        userId: adminUser.uid,
        date: '2024-07-01',
        status: 'confirmed',
        theme: 'Romantiškas',
        location: 'Melnragė',
        createdAt: new Date()
      },
      {
        id: 'booking2',
        userId: adminUser.uid,
        date: '2024-07-02',
        status: 'pending',
        theme: 'Šeimos',
        location: 'Giruliai',
        createdAt: new Date()
      }
    ];

    for (const booking of bookings) {
      await setDoc(doc(db, COLLECTIONS.BOOKINGS, booking.id), booking);
    }

    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
  }
} 