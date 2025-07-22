const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, connectAuthEmulator } = require('firebase/auth');
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
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}

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
      console.log('⚠️  User already exists, trying to sign in...');
      
      const email = 'admin@test.com';
      const password = 'test123';
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update admin document
        await setDoc(doc(db, 'users', user.uid), {
          email: email,
          isAdmin: true,
          createdAt: new Date(),
          displayName: 'Test Admin',
          role: 'admin'
        }, { merge: true });
        
        console.log('✅ Admin privileges updated for existing user');
        console.log('📧 Email:', email);
        console.log('🔑 Password:', password);
        console.log('🆔 UID:', user.uid);
        
      } catch (signInError) {
        console.error('❌ Error signing in:', signInError.message);
      }
    } else {
      console.error('❌ Error creating user:', error.message);
    }
  }
}

createAdminUser(); 