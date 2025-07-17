# Pique Unique

## Diegimo instrukcijos

### Lokaliam development'ui:
1. Sukurkite `.env.local` failą pagal instrukcijas žemiau
2. Paleiskite Firebase emulatorius: `firebase emulators:start`
3. Paleiskite development server'į: `npm run dev`

### Vercel produkcijai:
1. Eikite į Vercel Dashboard → Settings → Environment Variables
2. Pridėkite visus reikalingus aplinkos kintamuosius (žr. žemiau)
3. **BŪTINAI** nustatykite `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false`
4. Įveskite visus Firebase konfigūracijos parametrus
5. Admin prisijungimo duomenys:
   - El. paštas: admin@test.com
   - Slaptažodis: test123

## Aplinkos kintamieji

### Lokaliam development'ui (.env.local):
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

# Weather API
# Naudojame meteo.lt API (nereikia API rakto)
# Dokumentacija: https://api.meteo.lt/
```

### Vercel produkcijai (Environment Variables):
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

# Email Service (Resend) - opcionalus
RESEND_API_KEY=

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## Funkcionalumas

1. Pagrindinis puslapis
   - Orų informacija (meteo.lt)
   - Fotosesijų paketai
   - Kontaktinė forma

2. Admin panelė (/admin)
   - Užsakymų valdymas
   - Paketų valdymas
   - Galerijos valdymas (bus įkelta vėliau)

## Žinomi apribojimai

1. Galerijos funkcionalumas bus pridėtas vėliau, kai bus paruoštos profesionalios nuotraukos
2. Admin panelė šiuo metu turi bazinį funkcionalumą, bus plečiama pagal poreikį
