# Pique Unique - Picnic Booking System

## 📋 **Projekto Apžvalga**

Pique Unique yra moderni pikniko rezervacijos sistema, sukurta su Next.js 14, React, TypeScript ir Firebase backend. Sistema leidžia klientams rezervuoti pikniko vietas su įvairiomis temomis ir papildomomis paslaugomis.

## 🚀 **Sistemos Funkcionalumas**

### **Klientų Puslapis:**
1. **Pagrindinis puslapis** - orų informacija, paketų peržiūra
2. **Rezervacijos procesas** - vietos, datos, temos, laiko pasirinkimas
3. **Papildomos paslaugos** - ACALA, MAAR, tapymas, lėkštės
4. **Autentifikacija** - prisijungimas/registracija
5. **Rezervacijos patvirtinimas** - kontaktinė informacija, kainų skaičiavimas
6. **El. laiškų notifikacijos** - (ATIDĖTA) bus įjungta su `RESEND_API_KEY` ir domenu

### **Admin Panelis:**
1. **Rezervacijų valdymas** - peržiūra, redagavimas, trynimas
2. **Statuso keitimas** - pending, confirmed, cancelled
3. **Mokėjimų sekimas** - pending, paid, refunded

## ✅ **Esminės Funkcijos (dabartinė būklė)**

- Vartotojas gali registruotis/prisijungti (el. paštas ir Google)
- Rezervacija sukuriama per serverio API `/api/bookings` su privaloma autentifikacija
- „Mano Užsakymai“ (`/my-bookings`) rodo prisijungusio vartotojo rezervacijas
- Vartotojas gali redaguoti rezervacijos kontaktus ir pageidavimus per `PUT /api/user/bookings/[id]`
- Admin panelė: rezervacijų ir vartotojų peržiūra, statusų valdymas (su admin teise)
- El. laiškai: ATIDĖTA iki domeno konfigūracijos (`RESEND_API_KEY` ir siuntėjo domenas)

## 🔧 **Diegimo Instrukcijos**

### **Lokaliam Development'ui:**
1. Sukurkite `.env.local` failą pagal instrukcijas žemiau
2. **BŪTINAI** paleiskite Firebase emulatorius: `firebase emulators:start`
3. Paleiskite development server'į: `npm run dev`

### **Vercel Produkcijai:**
1. Eikite į Vercel Dashboard → Settings → Environment Variables
2. Pridėkite visus reikalingus aplinkos kintamuosius
3. **BŪTINAI** nustatykite `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false`
4. Įveskite Firebase konfigūracijos parametrus
5. Admin vartotojas: galima sukurti per `POST /api/setup-admin` (sukuria `admin@test.com` / `test123`)

## 🌍 **Aplinkos Kintamieji**

### **Lokaliam Development'ui (.env.local):**
```env
# Firebase Config - būtina užpildyti
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Emulator Config
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL=http://127.0.0.1:9099
NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL=http://127.0.0.1:8080

# Admin Config
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=test123

# Email Service (Resend) - ATIDĖTA iki domeno
# RESEND_API_KEY=

# Weather API
# Naudojame meteo.lt API (nereikia API rakto)
# Dokumentacija: https://api.meteo.lt/
```

### **Vercel Produkcijai (Environment Variables):**
```env
# Firebase Config - būtina užpildyti
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin Config - būtina produkcijai
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_PRIVATE_KEY_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_CLIENT_ID=
FIREBASE_ADMIN_CLIENT_CERT_URL=

# Firebase Emulator Config
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false

# Admin Config
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=test123

# Email Service (Resend) - ATIDĖTA iki domeno
# RESEND_API_KEY=

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://pique-unique.vercel.app
```

## 📁 **Projekto Struktūra**

```
src/
├── app/
│   ├── api/
│   │   ├── bookings/route.ts              # Rezervacijų API (POST, auth required)
│   │   ├── user/bookings/route.ts         # Vartotojo rezervacijų sąrašas (GET)
│   │   ├── user/bookings/[id]/route.ts    # Vartotojo rezervacijos atnaujinimas (PUT)
│   │   ├── send-admin-notification/route.ts # Admin notifikacijos
│   │   └── auth/
│   │       ├── session/route.ts           # Sesijos API
│   │       └── logout/route.ts            # Atsijungimo API
│   ├── booking/
│   │   ├── page.tsx                       # Rezervacijos puslapis
│   │   └── confirmation/page.tsx          # Patvirtinimo puslapis
│   ├── admin/                             # Admin panelis
│   └── signin/signup/                     # Autentifikacija
├── lib/
│   ├── auth.ts                            # Auth hook'ai
│   ├── firebase/                          # Firebase konfigūracija
│   └── server/
│       └── firebase-admin.ts              # Server-side Firebase
└── components/                            # React komponentai
```

## 📚 **Dokumentacija**

- **`TODAY_PROGRESS.md`** - Šiandienos darbo suvestinė
- **`TOMORROW_PLAN.md`** - Rytdienos detalus planas
- **`FIREBASE_DOCUMENTATION.md`** - Išsami Firebase dokumentacija

## 🚨 **Žinomi Apribojimai**

1. **El. laiškai** - atidėta iki domeno ir `RESEND_API_KEY` paruošimo
2. **Seni įrašai be userId** - jei rezervacija sukurta per seną kelią be `userId`, ji nematysis vartotojui (admin mato). Reikia pridėti `userId`/`userEmail` rankiniu būdu ar sukurti iš naujo per API.

## 🔗 **Naudingi Nuorodos**

- **Firebase Emulator Suite:** https://firebase.google.com/docs/emulator-suite
- **Next.js API Routes:** https://nextjs.org/docs/api-routes/introduction
- **Resend Email API:** https://resend.com/docs
- **Meteo.lt API:** https://api.meteo.lt/

---

**Projekto Statusas:** 🟢 **Paruošta demonstracijai** (esmė veikia, el. laiškai atidėti)
**Kitas Žingsnis:** Domenas + el. laiškai (Resend) ir smulkūs UI/UX poliravimai
