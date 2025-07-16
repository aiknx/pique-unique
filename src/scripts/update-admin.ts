import 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc, setDoc } from 'firebase/firestore';

const COLLECTIONS = {
  USERS: 'users'
};

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

// Connect to emulators
connectAuthEmulator(auth, 'http://127.0.0.1:9099');
connectFirestoreEmulator(db, '127.0.0.1', 8080);

async function updateAdmin() {
  console.log('Updating admin permissions...');
  
  try {
    // Sign in existing admin user
    const adminEmail = 'admin@test.com';
    const adminPassword = 'test123';

    const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    const adminUser = userCredential.user;

    // Update admin user document
    await setDoc(doc(db, COLLECTIONS.USERS, adminUser.uid), {
      email: adminEmail,
      isAdmin: true,
      createdAt: new Date(),
      displayName: 'Test Admin'
    }, { merge: true });

    console.log('Admin permissions updated successfully!');
    console.log('\nYou can now:');
    console.log('1. Login with admin@test.com / test123');
    console.log('2. Access admin panel at /admin');
  } catch (error) {
    console.error('Error updating admin permissions:', error);
  }
}

updateAdmin(); 