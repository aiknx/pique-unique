const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, connectFirestoreEmulator } = require('firebase/firestore');

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
const db = getFirestore(app);

// Connect to emulators
connectFirestoreEmulator(db, 'localhost', 8080);

async function createAdminDocument() {
  try {
    console.log('Creating admin document in Firestore...');
    
    const uid = 'fAutjc6M9wRn0q5kTy23irfnxEv2'; // Updated UID from create-admin-simple.js
    const email = 'admin@test.com';
    
    // Create admin document in Firestore
    await setDoc(doc(db, 'users', uid), {
      email: email,
      isAdmin: true,
      createdAt: new Date(),
      displayName: 'Test Admin',
      role: 'admin'
    });
    
    console.log('✅ Admin document created in Firestore');
    console.log('\n🎉 Admin privileges added successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password: test123');
    console.log('🆔 UID:', uid);
    console.log('👑 Admin: true');
    
  } catch (error) {
    console.error('❌ Error creating admin document:', error.message);
  }
}

createAdminDocument(); 