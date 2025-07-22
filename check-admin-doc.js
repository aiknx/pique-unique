const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, connectFirestoreEmulator } = require('firebase/firestore');

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

async function checkAdminDocument() {
  try {
    console.log('Checking admin document in Firestore...');
    
    const uid = '6ES5nVX7857HeD640D8SkMiFoG8x';
    
    // Check admin document in Firestore
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('✅ Admin document exists in Firestore');
      console.log('📄 Document data:', JSON.stringify(userData, null, 2));
      console.log('👑 isAdmin:', userData.isAdmin);
      console.log('📧 Email:', userData.email);
      console.log('📝 Display Name:', userData.displayName);
      console.log('🎭 Role:', userData.role);
    } else {
      console.log('❌ Admin document does not exist in Firestore');
    }
    
  } catch (error) {
    console.error('❌ Error checking admin document:', error.message);
  }
}

checkAdminDocument(); 