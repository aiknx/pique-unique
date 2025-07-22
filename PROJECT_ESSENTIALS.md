# 🎯 **Pique Unique - Esminė Informacija**

## 📋 **Projekto Apžvalga**
- **Pavadinimas:** Pique Unique - Picnic Booking System
- **Technologijos:** Next.js 14 + React + TypeScript + Firebase
- **Būsena:** 90% baigta, reikia Firebase emuliatoriaus ir UI ištaisymo
- **Domenas:** pique-unique.lt

## 🏗️ **Projekto Struktūra**

### **Pagrindiniai Puslapiai:**
- `/` - Pagrindinis puslapis (orai, paketai)
- `/booking` - Rezervacijos puslapis
- `/booking/confirmation` - Patvirtinimo puslapis
- `/signin` - Prisijungimas
- `/signup` - Registracija
- `/admin` - Admin panelis (bus pridėtas)

### **API Endpoint'ai:**
- `POST /api/bookings` - Rezervacijų išsaugojimas
- `POST /api/send-admin-notification` - Admin notifikacijos
- `GET /api/auth/session` - Sesijos patikrinimas
- `POST /api/auth/logout` - Atsijungimas

### **Firebase Kolekcijos:**
- `bookings` - Rezervacijos
- `users` - Vartotojai

## 🔧 **Konfigūracija**

### **Aplinkos Kintamieji (.env.local):**
```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Emulator
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL=http://127.0.0.1:9099
NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL=http://127.0.0.1:8080

# Admin
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=test123

# Email (Resend)
RESEND_API_KEY=
```

### **Firebase Emuliatorių URL'ai:**
- **Auth:** http://localhost:9099
- **Firestore:** http://localhost:8080
- **UI:** http://localhost:4000

## 🚀 **Paleidimo Komandos**

### **Development:**
```bash
# 1. Paleisti Firebase emuliatorius (BŪTINAI PIRMIAUSIA!)
firebase emulators:start

# 2. Paleisti development server
npm run dev

# 3. Atidaryti naršyklę
open http://localhost:3000
```

### **Testavimas:**
```bash
# Patikrinti, ar emuliatoriai veikia
curl http://localhost:9099  # Auth
curl http://localhost:8080  # Firestore

# Patikrinti, ar Next.js veikia
curl http://localhost:3000
```

## 📊 **Duomenų Modelis**

### **Booking (Rezervacija):**
```typescript
interface Booking {
  id: string;
  location: string;        // 'juodkrante', 'nida', 'klaipeda', etc.
  date: Date;             // Rezervacijos data
  theme: string;          // 'undiniu', 'feju', 'laumiu', 'disco'
  time: string;           // '10:00', '14:00', '18:00'
  guestCount: number;     // Svečių skaičius (1-20)
  basePrice: number;      // Bazinė kaina
  additionalServices: string[]; // ['acala', 'maar', 'painting', 'plates']
  additionalPrice: number; // Papildomų paslaugų kaina
  totalPrice: number;     // Bendra kaina
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

### **Papildomos Paslaugos:**
```typescript
const ADDITIONAL_SERVICES = [
  {
    id: 'acala',
    name: 'ACALA Skonių kelionė',
    price: 25,
    pricePer: '5 asmenys'
  },
  {
    id: 'maar',
    name: 'MAAR kvapų degustacija',
    price: 45,
    pricePer: 'vienkartinė'
  },
  {
    id: 'painting',
    name: 'Tapymo užsiėmimas',
    price: 10,
    pricePer: 'asm'
  },
  {
    id: 'plates',
    name: 'Užkandžių lėkštės',
    price: 30,
    pricePer: '5 asmenys'
  }
];
```

## 🎨 **UI Komponentai**

### **Pagrindiniai Komponentai:**
- `Navbar` - Navigacijos meniu
- `BookingForm` - Rezervacijos forma
- `ConfirmationForm` - Patvirtinimo forma
- `AuthProvider` - Autentifikacijos provider
- `WeatherWidget` - Orų informacija

### **CSS Framework:**
- **Tailwind CSS** - Utility-first CSS framework
- **Responsive design** - Mobile-first approach
- **Custom components** - Reusable UI elements

## 🔐 **Autentifikacija**

### **Vartotojų Tipai:**
- **Klientai** - gali kurti rezervacijas
- **Admin** - gali valdyti visas rezervacijas

### **Admin Prisijungimas:**
- **Email:** admin@test.com
- **Password:** test123

### **Sesijos Valdymas:**
- **Session cookies** - saugomi naršyklėje
- **Firebase Auth** - server-side validacija
- **Protected routes** - tik prisijungusiems vartotojams

## 📧 **El. Laiškų Sistema**

### **Resend API:**
- **Provider:** Resend (resend.com)
- **From:** Pique Unique <info@pique-unique.lt>
- **Templates:** HTML formatas

### **Laiškų Tipai:**
1. **Kliento patvirtinimas** - rezervacijos gavimas
2. **Admin notifikacija** - nauja rezervacija
3. **Statuso keitimas** - rezervacijos atnaujinimas

## 🧪 **Testavimo Scenarijus**

### **Pilnas Rezervacijos Procesas:**
1. Eiti į `/booking`
2. Pasirinkti vietą, datą, temą, laiką
3. Spausti "Tęsti"
4. Jei neprisijungęs - nukreipiamas į `/signin`
5. Prisijungti arba užsiregistruoti
6. Užpildyti kontaktinę informaciją
7. Pasirinkti papildomas paslaugas
8. Spausti "Patvirtinti Rezervaciją"
9. Patikrinti, ar rezervacija išsaugota
10. Patikrinti, ar el. laiškai išsiųsti

### **Admin Testavimas:**
1. Prisijungti kaip admin
2. Eiti į `/admin/bookings`
3. Patikrinti rezervacijų sąrašą
4. Pakeisti rezervacijos statusą
5. Patikrinti el. laiško išsiuntimą

## 🚨 **Dažnai Pasitaikančios Problemos**

### **1. Firebase Emuliatorius Nepasileidžia:**
```bash
# Patikrinti, ar portai neužimti
lsof -i :9099
lsof -i :8080
lsof -i :4000

# Jei užimti - sustabdyti
kill -9 <PID>
```

### **2. Next.js Neveikia:**
```bash
# Išvalyti cache
rm -rf .next
npm run dev
```

### **3. Import'ai Neveikia:**
```bash
# Išvalyti cache
rm -rf .next
rm -rf node_modules/.cache
npm install
```

### **4. UI Problemos:**
- Patikrinti Tailwind CSS
- Patikrinti globals.css
- Patikrinti komponentų import'us

## 📚 **Dokumentacija**

### **Pagrindiniai Failai:**
- `README.md` - Pagrindinė dokumentacija
- `TODAY_PROGRESS.md` - Šiandienos darbo suvestinė
- `TOMORROW_PLAN.md` - Rytdienos planas
- `FIREBASE_DOCUMENTATION.md` - Firebase vadovas
- `PROFESSIONAL_DEVELOPER_GUIDE.md` - Developer'o vadovas

### **Naudingi Šaltiniai:**
- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Resend API](https://resend.com/docs)

## 🎯 **Rytdienos Tikslai (2024-07-21)**

### **1. Firebase Emuliatorius (10 min)**
```bash
firebase emulators:start
```

### **2. UI/UX Ištaisymas (30 min)**
- Ištaisyti meniu dydį
- Optimizuoti puslapio veikimą

### **3. Sistemos Testavimas (20 min)**
- Išbandyti visą rezervacijos procesą
- Patikrinti duomenų išsaugojimą

### **4. Admin Panelis (60 min)**
- Sukurti rezervacijų peržiūros puslapį
- Pridėti valdymo funkcijas

## 🚀 **Sėkmės Kriterijai**

### **Rytdienos Pabaigoje Turėtume Turėti:**
- ✅ Veikiantį Firebase emuliatorių
- ✅ Ištaisytą UI/UX
- ✅ Pilnai veikiantį rezervacijos procesą
- ✅ Admin panelį su rezervacijų valdymu
- ✅ Veikiantį el. laiškų siuntimą

### **Testavimo Rezultatai:**
- Rezervacijos išsaugos į Firestore
- Klientai gaus el. laiškus
- Admin gaus notifikacijas
- UI veiks sklandžiai
- Admin galės valdyti rezervacijas

---

**🎯 TIKSLAS: Pilnai veikianti pikniko rezervacijos sistema!** 