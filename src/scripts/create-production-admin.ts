import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

interface FirebaseError {
  code?: string;
  message?: string;
}

async function createProductionAdmin() {
  console.log('Creating production admin user...');
  
  try {
    const adminEmail = 'admin@test.com';
    const adminPassword = 'test123';

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const adminUser = userCredential.user;

    console.log('✅ Admin user created in Firebase Auth:', adminUser.uid);

    // Create admin user document in Firestore
    await setDoc(doc(db, 'users', adminUser.uid), {
      email: adminEmail,
      isAdmin: true,
      createdAt: new Date(),
      displayName: 'Test Admin',
      role: 'admin'
    });

    console.log('✅ Admin user document created in Firestore');
    console.log('\n🎉 Production admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🆔 UID:', adminUser.uid);
    console.log('\nYou can now login to admin panel at: https://pique-unique.vercel.app/admin/login');

  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as FirebaseError).code === 'auth/email-already-in-use'
    ) {
      console.log('⚠️  Admin user already exists. Updating admin privileges...');
      
      // Try to update existing user's admin status
      try {
        // Note: We can't directly update the user here, but we can update the Firestore document
        // The user will need to sign in first to get their UID
        console.log('ℹ️  Please sign in with admin@test.com / test123 first, then run this script again');
      } catch (updateError) {
        console.error('❌ Error updating admin privileges:', updateError);
      }
    } else {
      console.error('Error creating admin user:', typeof error === 'object' && error !== null && 'message' in error ? (error as FirebaseError).message : String(error));
    }
  }
}

createProductionAdmin(); 