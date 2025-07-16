import 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, collection } from 'firebase/firestore';

// Firebase collection names
const COLLECTIONS = {
  USERS: 'users',
  BOOKINGS: 'bookings',
  THEMES: 'themes',
  REVIEWS: 'reviews'
};

// Initial themes data
const initialThemes = [
  {
    name: 'Romantiškas piknikas',
    description: 'Tobulas pasirinkimas poroms, norinčioms praleisti ypatingą laiką dviese.',
    price: 99,
    images: [
      'https://placehold.co/800x600/e2e8f0/1a472a?text=Romantiški+Piknikai',
      'https://placehold.co/800x600/e2e8f0/1a472a?text=Romantiški+Piknikai+2'
    ],
    capacity: {
      min: 2,
      max: 2
    },
    features: [
      'Dekoruotas stalas dviem',
      'Romantiška atmosfera',
      'Žvakės ir gėlės',
      'Minkšti pledai',
      'Pagalvėlės'
    ],
    isAvailable: true
  },
  {
    name: 'Šeimos piknikas',
    description: 'Jaukus ir linksmas piknikas visai šeimai su žaidimais ir pramogomis.',
    price: 149,
    images: [
      'https://placehold.co/800x600/e2e8f0/1a472a?text=Šeimos+Piknikai',
      'https://placehold.co/800x600/e2e8f0/1a472a?text=Šeimos+Piknikai+2'
    ],
    capacity: {
      min: 3,
      max: 6
    },
    features: [
      'Erdvus stalas šeimai',
      'Žaidimai vaikams',
      'Patogūs sėdmaišiai',
      'Pledai ir pagalvėlės',
      'Vaikiškas meniu'
    ],
    isAvailable: true
  },
  {
    name: 'Prabangus piknikas',
    description: 'Aukščiausios klasės piknikas su išskirtiniu aptarnavimu ir premium patiekalais.',
    price: 199,
    images: [
      'https://placehold.co/800x600/e2e8f0/1a472a?text=Prabangūs+Piknikai',
      'https://placehold.co/800x600/e2e8f0/1a472a?text=Prabangūs+Piknikai+2'
    ],
    capacity: {
      min: 2,
      max: 8
    },
    features: [
      'Premium klasės indai',
      'Šampanas',
      'Išskirtinės dekoracijos',
      'Asmeninis padavėjas',
      'Gourmet užkandžiai'
    ],
    isAvailable: true
  }
];

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

async function setupDev() {
  console.log('Setting up development environment...');
  
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

    // Create themes
    console.log('Creating themes...');
    for (const theme of initialThemes) {
      const themeRef = doc(collection(db, COLLECTIONS.THEMES));
      await setDoc(themeRef, {
        ...theme,
        id: themeRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Create some test bookings
    const bookings = [
      {
        id: 'booking1',
        userId: adminUser.uid,
        date: new Date('2024-07-01'),
        timeSlot: {
          start: '14:00',
          end: '17:00'
        },
        location: 'Melnragė',
        guests: 2,
        contactInfo: {
          name: 'Jonas Jonaitis',
          email: 'jonas@example.com',
          phone: '+37060000000'
        },
        themeId: 'theme1',
        themeName: 'Romantiškas piknikas',
        themePrice: 99,
        status: 'confirmed',
        paymentStatus: 'paid',
        totalPrice: 99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'booking2',
        userId: adminUser.uid,
        date: new Date('2024-07-02'),
        timeSlot: {
          start: '10:00',
          end: '13:00'
        },
        location: 'Giruliai',
        guests: 4,
        contactInfo: {
          name: 'Petras Petraitis',
          email: 'petras@example.com',
          phone: '+37060000001'
        },
        themeId: 'theme2',
        themeName: 'Šeimos piknikas',
        themePrice: 149,
        status: 'pending',
        paymentStatus: 'pending',
        totalPrice: 149,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const booking of bookings) {
      await setDoc(doc(db, COLLECTIONS.BOOKINGS, booking.id), booking);
    }

    console.log('Test data seeded successfully');
    console.log('\nSetup complete! You can now:');
    console.log('1. Login with admin@test.com / test123');
    console.log('2. Access admin panel at /admin');
    console.log('3. View emulator UI at http://127.0.0.1:4000');
  } catch (error) {
    console.error('Error during setup:', error);
  }
}

setupDev(); 