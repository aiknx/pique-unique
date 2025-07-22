const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, connectAuthEmulator } = require('firebase/auth');
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
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators
connectAuthEmulator(auth, 'http://localhost:9099');
connectFirestoreEmulator(db, 'localhost', 8080);

async function testAdmin() {
  try {
    console.log('🔍 Testing admin user creation...');
    
    const email = 'admin@test.com';
    const password = 'test123';
    
    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ User created successfully!');
    console.log('📧 Email:', user.email);
    console.log('🆔 UID:', user.uid);
    
    // Create admin document
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      isAdmin: true,
      createdAt: new Date(),
      displayName: 'Test Admin',
      role: 'admin'
    });
    
    console.log('✅ Admin document created in Firestore');
    console.log('🎉 Ready to test admin login!');
    
  } catch (error) {
    console.error('❌ Error:', error.code, error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  User already exists - this is OK for testing');
    }
  }
}

testAdmin(); 