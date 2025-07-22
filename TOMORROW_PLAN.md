# Rytdienos Planas - 2025-07-22

## 🎯 **PIRMIAUSIAI REIKIA PADARYTI:**

### **1. Production Deployment**
- [ ] Pushinti kodą į GitHub
- [ ] Patikrinti Vercel deployment
- [ ] Sukonfigūruoti Vercel environment variables
- [ ] Testuoti production versiją

### **2. Admin Vartotojo Sukūrimas**
- [ ] Eiti į Firebase Console
- [ ] Sukurti admin vartotoją su sesės paštu
- [ ] Pridėti admin teises Firestore dokumente
- [ ] Testuoti admin prisijungimą production'e

### **3. Sistemos Testavimas**
- [ ] Testuoti visą užsakymų procesą
- [ ] Patikrinti el. laiškų siuntimą
- [ ] Testuoti admin funkcionalumą
- [ ] Patikrinti vartotojo užsakymų peržiūrą

## 🔧 **TECHNINIAI DARBAI:**

### **4. Firebase Production Konfigūracija**
- [ ] Patikrinti Firebase project settings
- [ ] Sukonfigūruoti Firestore security rules
- [ ] Patikrinti Authentication settings
- [ ] Testuoti API endpoints production'e

### **5. Vercel Environment Variables**
Reikės pridėti šiuos kintamuosius Vercel:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_PRIVATE_KEY_ID
FIREBASE_ADMIN_PRIVATE_KEY
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_CLIENT_ID
FIREBASE_ADMIN_CLIENT_CERT_URL
RESEND_API_KEY
```

## 📋 **DETALUS PLANAS:**

### **Rytas (9:00-12:00)**
1. **GitHub Push**
   - `git add .`
   - `git commit -m "Complete booking system and admin panel"`
   - `git push origin main`

2. **Vercel Deployment**
   - Patikrinti ar Vercel automatiškai deploy'ina
   - Patikrinti build log'us
   - Ištaisyti galimas klaidas

3. **Environment Variables**
   - Pridėti visus Firebase kintamuosius Vercel
   - Pridėti Resend API key

### **Popietė (13:00-17:00)**
1. **Admin Vartotojas**
   - Sukurti admin vartotoją Firebase Console
   - Pridėti admin dokumentą Firestore
   - Testuoti admin prisijungimą

2. **Sistemos Testavimas**
   - Testuoti užsakymų procesą
   - Patikrinti el. laiškų siuntimą
   - Testuoti admin panelį

3. **Bug Fixes**
   - Ištaisyti rastas problemas
   - Optimizuoti veikimą

## 🚀 **PRODUCTION READY CHECKLIST:**

### **Prieš Deployment:**
- [ ] Build sėkmingas ✅
- [ ] TypeScript klaidų nėra ✅
- [ ] Vercel.json sukurtas ✅
- [ ] .gitignore teisingas ✅

### **Po Deployment:**
- [ ] Vercel environment variables pridėti
- [ ] Firebase production konfigūracija
- [ ] Admin vartotojas sukurtas
- [ ] Sistemos testavimas baigtas

## 🎯 **TIKSLAS:**
**Rytdien iki vakaro turi veikti pilnai funkcionuojanti production sistema su admin paneliu!**

## 📞 **JEI PROBLEMŲ:**
- Patikrinti Vercel build log'us
- Patikrinti Firebase Console
- Patikrinti environment variables
- Testuoti lokaliai su production Firebase 