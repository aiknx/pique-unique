# 🚀 **Profesionalaus Full Stack Developer'o Vadovas**

## 📋 **Pagrindiniai Principai**

### **1. Planavimas Prieš Kodavimą**
- ✅ **VISADA** pirmiausia suplanuoti visą procesą
- ✅ **VISADA** patikrinti esamus failus prieš keičiant
- ✅ **VISADA** testuoti po kiekvieno žingsnio
- ✅ **NIEKADA** nedaryti spėjimų - visada patikrinti dokumentaciją

### **2. Problemių Sprendimas**
- 🔍 **Pirmiausia** - nustatyti tikslą
- 🔍 **Antra** - išanalizuoti esamą situaciją
- 🔍 **Trečia** - suplanuoti sprendimą
- 🔍 **Ketvirta** - įgyvendinti žingsnis po žingsnio
- 🔍 **Penkta** - testuoti rezultatą

### **3. Kodo Kokybė**
- 📝 **Aiškūs komentarai** - kas ir kodėl daroma
- 📝 **Konsistentus stilius** - vienodas kodas visur
- 📝 **Error handling** - visada apdoroti klaidas
- 📝 **TypeScript** - naudoti tipus visur

---

## 🔥 **Firebase Professional Workflow**

### **1. Emuliatorių Paleidimas (VISADA PIRMIAUSIA)**
```bash
# Patikrinti, ar Firebase CLI įdiegtas
firebase --version

# Jei ne - įdiegti
npm install -g firebase-tools

# Prisijungti prie Firebase
firebase login

# Paleisti emuliatorius
firebase emulators:start

# Patikrinti URL'us:
# - Auth: http://localhost:9099
# - Firestore: http://localhost:8080
# - UI: http://localhost:4000
```

### **2. Konfigūracijos Patikrinimas**
```bash
# Patikrinti .env.local
cat .env.local

# Patikrinti firebase.json
cat firebase.json

# Patikrinti package.json dependencies
npm list firebase firebase-admin
```

### **3. API Endpoint'ų Testavimas**
```bash
# Testuoti bookings API
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"location":"juodkrante","date":"2024-07-21","theme":"undiniu","time":"10:00","guestCount":4,"totalPrice":120}'

# Testuoti auth session
curl http://localhost:3000/api/auth/session
```

---

## ⚡ **Next.js Professional Workflow**

### **1. Development Server Paleidimas**
```bash
# Išvalyti cache prieš paleidimą
rm -rf .next

# Paleisti development server
npm run dev

# Patikrinti, ar veikia
curl http://localhost:3000
```

### **2. Komponentų Optimizacija**
```typescript
// VISADA naudoti React.memo() dideliems komponentams
const BookingForm = React.memo(({ onSubmit }) => {
  // komponento logika
});

// VISADA naudoti useCallback() funkcijoms
const handleSubmit = useCallback((data) => {
  // submit logika
}, [dependencies]);

// VISADA naudoti useMemo() skaičiavimams
const totalPrice = useMemo(() => {
  return basePrice + additionalServicesPrice;
}, [basePrice, additionalServicesPrice]);
```

### **3. Error Boundary**
```typescript
// VISADA pridėti error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Kažkas nutiko. Bandykite dar kartą.</h1>;
    }
    return this.props.children;
  }
}
```

---

## 🎨 **UI/UX Professional Workflow**

### **1. CSS Problemų Sprendimas**
```bash
# Patikrinti Tailwind CSS
npx tailwindcss --help

# Patikrinti globals.css
cat src/app/globals.css

# Patikrinti tailwind.config.js
cat tailwind.config.js
```

### **2. Responsive Design**
```typescript
// VISADA naudoti responsive klases
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* content */}
</div>

// VISADA testuoti mobile
// - Chrome DevTools → Toggle device toolbar
// - Testuoti iPhone, iPad, Desktop
```

### **3. Loading States**
```typescript
// VISADA pridėti loading states
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await submitData();
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

// Loading UI
{loading && <div className="animate-spin">Kraunama...</div>}
```

---

## 🔐 **Authentication Professional Workflow**

### **1. Session Management**
```typescript
// VISADA patikrinti session prieš API calls
const { user, loading } = useAuth();

if (loading) return <div>Kraunama...</div>;
if (!user) return <div>Reikia prisijungti</div>;

// API call su session
const response = await fetch('/api/bookings', {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // VISADA pridėti
});
```

### **2. Protected Routes**
```typescript
// VISADA apsaugoti routes
export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  if (loading) return <div>Kraunama...</div>;
  if (!user) return null;

  return <div>Protected content</div>;
}
```

---

## 📊 **Database Professional Workflow**

### **1. Firestore Rules**
```javascript
// VISADA testuoti rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Collection rules
    match /bookings/{bookingId} {
      allow read: if isAuthenticated() && (
        isOwner(resource.data.userId) || isAdmin()
      );
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && (
        isOwner(resource.data.userId) || isAdmin()
      );
    }
  }
}
```

### **2. Data Validation**
```typescript
// VISADA validuoti duomenis
interface BookingData {
  location: string;
  date: Date;
  theme: string;
  time: string;
  guestCount: number;
  totalPrice: number;
}

function validateBooking(data: any): BookingData {
  if (!data.location || !data.date || !data.theme || !data.time || !data.guestCount || !data.totalPrice) {
    throw new Error('Trūksta būtinų duomenų');
  }
  
  if (data.guestCount < 1 || data.guestCount > 20) {
    throw new Error('Neteisingas svečių skaičius');
  }
  
  return data as BookingData;
}
```

---

## 📧 **Email Professional Workflow**

### **1. Resend Configuration**
```typescript
// VISADA patikrinti API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn('Resend API key not configured');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Pique Unique <info@pique-unique.lt>',
      to,
      subject,
      html,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
```

### **2. Email Templates**
```typescript
// VISADA naudoti templates
const bookingConfirmationTemplate = (booking: BookingData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #333;">Ačiū už rezervaciją!</h1>
    <p>Jūsų užsakymas buvo sėkmingai gautas.</p>
    
    <h2>Rezervacijos detalės:</h2>
    <ul>
      <li><strong>Data:</strong> ${new Date(booking.date).toLocaleDateString('lt-LT')}</li>
      <li><strong>Laikas:</strong> ${booking.time}</li>
      <li><strong>Vieta:</strong> ${booking.location}</li>
      <li><strong>Svečių skaičius:</strong> ${booking.guestCount}</li>
      <li><strong>Kaina:</strong> ${booking.totalPrice} €</li>
    </ul>
  </div>
`;
```

---

## 🧪 **Testing Professional Workflow**

### **1. Manual Testing Checklist**
```markdown
## Rezervacijos Proceso Testavimas

### 1. Pagrindinis Puslapis
- [ ] Puslapis kraunasi be klaidų
- [ ] Meniu veikia
- [ ] Orai rodomi
- [ ] Paketai rodomi

### 2. Rezervacijos Puslapis
- [ ] Vietos pasirinkimas veikia
- [ ] Datos pasirinkimas veikia
- [ ] Temų pasirinkimas veikia
- [ ] Laiko pasirinkimas veikia
- [ ] "Tęsti" mygtukas veikia

### 3. Confirmation Puslapis
- [ ] Duomenys perduodami teisingai
- [ ] Autentifikacija veikia
- [ ] Kontaktinė forma veikia
- [ ] Papildomos paslaugos veikia
- [ ] Kainų skaičiavimas veikia
- [ ] "Patvirtinti" mygtukas veikia

### 4. API Testavimas
- [ ] Rezervacija išsaugoma į Firestore
- [ ] El. laiškas išsiunčiamas klientui
- [ ] El. laiškas išsiunčiamas admin
- [ ] Nukreipimas į pagrindinį puslapį

### 5. Admin Panelis
- [ ] Rezervacijos rodomos
- [ ] Rezervacijos redaguojamos
- [ ] Statusas keičiamas
```

### **2. Error Testing**
```typescript
// VISADA testuoti error cases
// 1. Network error
// 2. Invalid data
// 3. Unauthorized access
// 4. Server error
// 5. Timeout

// Testuoti su disabled network
// Testuoti su invalid form data
// Testuoti be authentication
```

---

## 🚨 **Debugging Professional Workflow**

### **1. Console Logging**
```typescript
// VISADA naudoti structured logging
console.group('Booking Process');
console.log('Step 1: User data', { user });
console.log('Step 2: Form data', { formData });
console.log('Step 3: API response', { response });
console.groupEnd();

// Error logging
console.error('Booking failed:', {
  error: error.message,
  stack: error.stack,
  user: user?.email,
  data: formData
});
```

### **2. Browser DevTools**
```javascript
// Network tab - patikrinti API calls
// Console tab - patikrinti errors
// Application tab - patikrinti localStorage, cookies
// Elements tab - patikrinti CSS
```

### **3. Firebase Emulator UI**
```
http://localhost:4000
- Authentication tab
- Firestore tab
- Functions tab
```

---

## 📚 **Documentation Professional Workflow**

### **1. Code Comments**
```typescript
/**
 * Creates a new booking in Firestore and sends confirmation emails
 * @param bookingData - The booking information
 * @param user - The authenticated user (optional)
 * @returns Promise<{success: boolean, bookingId: string}>
 */
export async function createBooking(bookingData: BookingData, user?: User) {
  // Implementation
}
```

### **2. README Updates**
```markdown
## Recent Changes (2024-07-20)
- ✅ Added booking API endpoints
- ✅ Added confirmation page with authentication
- ✅ Added email notifications
- ❌ Firebase emulator not running
- ❌ UI issues need fixing

## Next Steps (2024-07-21)
1. Start Firebase emulator
2. Fix UI issues
3. Test complete booking flow
4. Create admin panel
```

---

## 🎯 **Daily Workflow Checklist**

### **Prieš Pradėdamas:**
- [ ] Patikrinti Firebase emuliatorių
- [ ] Patikrinti development server
- [ ] Patikrinti .env.local
- [ ] Patikrinti package.json dependencies

### **Po Kiekvieno Žingsnio:**
- [ ] Testuoti funkcionalumą
- [ ] Patikrinti console errors
- [ ] Patikrinti network requests
- [ ] Patikrinti UI/UX

### **Prieš Baigiant:**
- [ ] Testuoti visą procesą
- [ ] Patikrinti error handling
- [ ] Atnaujinti dokumentaciją
- [ ] Sukurti backup

---

## 🚀 **Emergency Procedures**

### **Jei Kažkas Neveikia:**
1. **Patikrinti console errors**
2. **Patikrinti network tab**
3. **Patikrinti Firebase emulator**
4. **Patikrinti .env.local**
5. **Restartinti development server**
6. **Išvalyti cache**

### **Jei Import'ai Neveikia:**
```bash
# Išvalyti cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Restart server
npm run dev
```

### **Jei Firebase Neveikia:**
```bash
# Patikrinti emulator
firebase emulators:start

# Patikrinti konfigūraciją
firebase projects:list

# Patikrinti rules
firebase deploy --only firestore:rules
```

---

**🎯 TIKSLAS: BŪTI PROFESIONALIU FULL STACK DEVELOPER'IU!**

**📝 PRINCIPAS: PLANUOTI → TESTUOTI → DOKUMENTUOTI → KARTOTI** 