# Firebase Dokumentacija - Pique Unique Projektas

## 📚 **Išsamus Firebase Vadovas**

---

## 🔥 **Firebase Emuliatorių Paleidimas**

### **1. Patikrinti Firebase CLI**
```bash
# Patikrinti, ar Firebase CLI įdiegtas
firebase --version

# Jei ne - įdiegti
npm install -g firebase-tools

# Prisijungti prie Firebase
firebase login
```

### **2. Paleisti Emuliatorius**
```bash
# Paleisti visus emuliatorius
firebase emulators:start

# Arba paleisti tik reikalingus
firebase emulators:start --only auth,firestore
```

### **3. Emuliatorių URL'ai**
- **Auth Emulator:** http://localhost:9099
- **Firestore Emulator:** http://localhost:8080
- **Emulator UI:** http://localhost:4000

---

## 🏗️ **Firebase Konfigūracija**

### **1. firebase.json**
```json
{
  "firestore": {
    "rules": "firestore.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "ui": {
      "enabled": true
    },
    "singleProjectMode": true
  }
}
```

### **2. .env.local**
```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Emulator Config
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL=http://127.0.0.1:9099
NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL=http://127.0.0.1:8080

# Admin Config
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=test123

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
```

---

## 🔐 **Autentifikacijos Sistema**

### **1. Client-Side Auth (src/lib/auth.ts)**
```typescript
// Firebase Auth import'ai
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';

// Auth Provider komponentas
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const authUser = user as AuthUser;
        const admin = await isUserAdmin(authUser);
        setIsAdmin(admin);
        setUser(authUser);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auth funkcijos...
}
```

### **2. Server-Side Auth (src/lib/server/firebase-admin.ts)**
```typescript
// Firebase Admin import'ai
import { initializeApp, getApps, cert, ServiceAccount, deleteApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Admin inicializacija
function initializeFirebaseAdmin() {
  if (isInitialized) return;

  try {
    const isEmulator = process.env.FIRESTORE_EMULATOR_HOST || 
                      process.env.FIREBASE_AUTH_EMULATOR_HOST || 
                      process.env.NODE_ENV === 'development';
    
    if (isEmulator) {
      // Emulator konfigūracija
      initializeApp({
        projectId: 'pique-unique'
      });
    } else {
      // Produkcijos konfigūracija
      initializeApp({
        credential: cert(firebaseAdminConfig as ServiceAccount),
      });
    }
    
    isInitialized = true;
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
  }
}

// Export funkcijos
export const getAdminDb = () => {
  if (!isInitialized) initializeFirebaseAdmin();
  return getFirestore();
};

export const getAdminAuth = () => {
  if (!isInitialized) initializeFirebaseAdmin();
  return getAuth();
};

export const getFirebaseAdmin = getAdminDb; // Alias
```

---

## 📊 **Firestore Duomenų Modelis**

### **1. Rezervacijų Kolekcija (bookings)**
```typescript
interface Booking {
  id: string;
  location: string;
  date: Date;
  theme: string;
  time: string;
  guestCount: number;
  basePrice: number;
  additionalServices: string[];
  additionalPrice: number;
  totalPrice: number;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  userId: string | null;
  userEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### **2. Vartotojų Kolekcija (users)**
```typescript
interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### **3. Firestore Rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null || 
                   (request.auth == null && request.time < timestamp.date(2026, 1, 1));
      allow write: if request.auth != null && (request.auth.uid == userId || isAdmin()) || 
                   (request.auth == null && request.time < timestamp.date(2026, 1, 1));
    }

    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
    }
  }
}
```

---

## 🔌 **API Endpoint'ai**

### **1. Rezervacijų API (/api/bookings)**
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, date, theme, time, guestCount, totalPrice, contactInfo } = body;

    // Validate required fields
    if (!location || !date || !theme || !time || !guestCount || !totalPrice) {
      return NextResponse.json(
        { error: 'Trūksta būtinų duomenų' },
        { status: 400 }
      );
    }

    // Get Firebase Admin
    const db = getFirebaseAdmin();
    const adminAuth = getAdminAuth();
    
    if (!db || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin not available' },
        { status: 500 }
      );
    }

    // Get user from session cookie or Authorization header (ID token)
    const sessionCookie = request.cookies.get('session')?.value;
    const authHeader = request.headers.get('authorization');
    let userId = null;
    let userEmail = null;

    if (sessionCookie) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
        userId = decodedClaims.uid;
        userEmail = decodedClaims.email;
      } catch {
        // ignore
      }
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const idToken = authHeader.substring(7);
        const decodedClaims = await adminAuth.verifyIdToken(idToken);
        userId = decodedClaims.uid;
        userEmail = decodedClaims.email;
      } catch {
        // ignore
      }
    }

    // Create booking document
    const bookingData = {
      location,
      date: new Date(date),
      theme,
      time,
      guestCount,
      basePrice,
      additionalServices: additionalServices || [],
      additionalPrice: additionalPrice || 0,
      totalPrice,
      contactInfo: contactInfo || {},
      status: 'pending',
      paymentStatus: 'pending',
      userId: userId,
      userEmail: userEmail,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to Firestore
    const bookingRef = await db.collection('bookings').add(bookingData);
    const bookingId = bookingRef.id;

    // Send confirmation emails
    try {
      await sendConfirmationEmails(bookingId, bookingData);
    } catch (emailError) {
      console.error('Failed to send confirmation emails:', emailError);
    }

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Rezervacija sėkmingai išsaugota'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Nepavyko išsaugoti rezervacijos' },
      { status: 500 }
    );
  }
}
```

### **2. Admin API (/api/admin/bookings)**
```typescript
export async function GET() {
  try {
    const db = getFirebaseAdmin();
    
    if (!db) {
      return NextResponse.json({
        bookings: [],
        total: 0
      });
    }

    const bookingsRef = db.collection('bookings');
    const snapshot = await bookingsRef
      .orderBy('createdAt', 'desc')
      .get();

    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      date: doc.data().date?.toDate?.() || doc.data().date
    }));

    return NextResponse.json({
      bookings,
      total: bookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
```

---

## 📧 **El. Laiškų Sistema**

### **1. Resend Konfigūracija**
```typescript
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendBookingConfirmation(customerEmail: string, bookingDetails: any) {
  if (!resend) {
    console.warn('Resend API key not configured, skipping email sending');
    return;
  }

  await resend.emails.send({
    from: 'Pique Unique <info@pique-unique.lt>',
    to: customerEmail,
    subject: 'Jūsų rezervacija gauta - Pique Unique',
    html: `
      <h1>Ačiū už rezervaciją!</h1>
      <p>Jūsų užsakymas buvo sėkmingai gautas ir netrukus bus peržiūrėtas.</p>
      <h2>Rezervacijos detalės:</h2>
      <ul>
        <li>Data: ${new Date(bookingDetails.date).toLocaleDateString('lt-LT')}</li>
        <li>Laikas: ${bookingDetails.timeSlot.start} - ${bookingDetails.timeSlot.end}</li>
        <li>Vieta: ${bookingDetails.location}</li>
        <li>Svečių skaičius: ${bookingDetails.guests}</li>
        <li>Tema: ${bookingDetails.themeName}</li>
        <li>Kaina: ${bookingDetails.themePrice} €</li>
      </ul>
    `,
  });
}
```

---

## 🧪 **Testavimas**

### **1. Emuliatorių Testavimas**
```bash
# Paleisti emuliatorius
firebase emulators:start

# Atidaryti Emulator UI
open http://localhost:4000

# Patikrinti Auth emuliatorių
curl http://localhost:9099

# Patikrinti Firestore emuliatorių
curl http://localhost:8080
```

### **2. Rezervacijos Testavimas**
1. Eiti į `http://localhost:3000/booking`
2. Pasirinkti vietą, datą, temą, laiką
3. Prisijungti
4. Užpildyti kontaktinę informaciją
5. Pasirinkti papildomas paslaugas
6. Spausti "Patvirtinti Rezervaciją"
7. Patikrinti Firestore emuliatoriuje
8. Patikrinti el. laiškus

### **3. Admin Testavimas**
1. Prisijungti kaip admin
2. Eiti į `/admin/bookings`
3. Patikrinti rezervacijų sąrašą
4. Patikrinti rezervacijos detalės
5. Pakeisti rezervacijos statusą

---

## 🚨 **Dažnai Pasitaikančios Problemos**

### **1. Firebase Emuliatorius Nepasileidžia**
```bash
# Patikrinti, ar portai neužimti
lsof -i :9099
lsof -i :8080
lsof -i :4000

# Jei užimti - sustabdyti procesus
kill -9 <PID>

# Arba naudoti kitus portus
firebase emulators:start --only auth,firestore --auth-port 9098 --firestore-port 8081
```

### **2. Autentifikacija Neveikia**
```typescript
// Patikrinti, ar emuliatorius prijungtas
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}
```

### **3. Firestore Neveikia**
```typescript
// Patikrinti, ar duomenys išsaugomi
const docRef = await addDoc(collection(db, 'bookings'), bookingData);
console.log('Document written with ID: ', docRef.id);
```

### **4. El. Laiškai Neišsiunčiami**
```typescript
// Patikrinti RESEND_API_KEY
console.log('Resend API Key:', process.env.RESEND_API_KEY ? 'Set' : 'Not set');

// Patikrinti el. laiško siuntimą
try {
  await resend.emails.send({...});
  console.log('Email sent successfully');
} catch (error) {
  console.error('Email sending failed:', error);
}
```

---

## 📚 **Naudingi Šaltiniai**

- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Resend Email API](https://resend.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## 🎯 **Rytdienos Veiksmai**

1. **Paleisti Firebase emuliatorių**
2. **Ištaisyti UI problemas**
3. **Išbandyti visą sistemą**
4. **Pabaigti admin panelį**

**Sėkmės! 🚀** 