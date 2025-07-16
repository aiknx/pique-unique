# Pique Unique

## Diegimo instrukcijos

1. Sukurkite `.env.local` failą pagal `.env.example` šabloną
2. Produkcinei aplinkai būtina nustatyti:
   - `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false`
   - Įvesti visus Firebase konfigūracijos parametrus
   - Orų duomenys gaunami iš meteo.lt API (nereikia API rakto)
3. Admin prisijungimo duomenys:
   - El. paštas: admin@test.com
   - Slaptažodis: test123

## Aplinkos kintamieji

```env
# Firebase Config - būtina užpildyti
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Emulator Config
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false # Produkcijai BŪTINAI false
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL=http://127.0.0.1:9099
NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL=http://127.0.0.1:8080

# Admin Config
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=test123

# Weather API
# Naudojame meteo.lt API (nereikia API rakto)
# Dokumentacija: https://api.meteo.lt/
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
