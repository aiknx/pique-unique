// This script can be run in the browser console at http://localhost:3000
// Make sure Firebase emulators are running

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, connectAuthEmulator } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, connectFirestoreEmulator } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC69-VVdw7zQ-cTU0rBk5krH7qd7RqLw3g",
  authDomain: "pique-unique.firebaseapp.com",
  projectId: "pique-unique",
  storageBucket: "pique-unique.firebasestorage.app",
  messagingSenderId: "884457148412",
  appId: "1:884457148412:web:92dc5b411d239ac37d6c79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators
connectAuthEmulator(auth, 'http://localhost:9099');
connectFirestoreEmulator(db, 'localhost', 8080);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    const email = 'admin@test.com';
    const password = 'test123';
    
    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ User created:', user.uid);
    
    // Create admin document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      isAdmin: true,
      createdAt: new Date(),
      displayName: 'Test Admin',
      role: 'admin'
    });
    
    console.log('✅ Admin document created in Firestore');
    console.log('\n🎉 Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🆔 UID:', user.uid);
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️  User already exists');
      console.log('📧 Email: admin@test.com');
      console.log('🔑 Password: test123');
    } else {
      console.error('❌ Error creating user:', error.message);
    }
  }
}

// Run the function
createAdminUser(); 