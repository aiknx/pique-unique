'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

const LOCATIONS = [
  { id: 'juodkrante', name: 'Juodkrantė', description: 'Neringos miesto savivaldybė' },
  { id: 'nida', name: 'Nida', description: 'Neringos miesto savivaldybė' },
  { id: 'klaipeda', name: 'Klaipėda', description: 'Klaipėdos miesto savivaldybė' },
  { id: 'palanga', name: 'Palanga', description: 'Palangos miesto savivaldybė' },
  { id: 'svencele', name: 'Svencelė', description: 'Klaipėdos rajono savivaldybė' },
  { id: 'other', name: 'Kita vieta *', description: 'Pagal individualų užsakymą' }
];

const TIME_SLOTS = {
  '10:00': { start: '10:00', end: '13:00', label: 'Rytas' },
  '14:00': { start: '14:00', end: '17:00', label: 'Popietė' },
  '18:00': { start: '18:00', end: '21:00', label: 'Vakaras' }
};

const THEMES = {
  'undiniu': 'Undinių',
  'feju': 'Fejų',
  'laumiu': 'Laumių',
  'disco': 'Disco'
};

const ADDITIONAL_SERVICES = [
  {
    id: 'acala',
    name: 'ACALA Skonių kelionė',
    description: 'Leiskite šventei įgyti dar daugiau prasmės su tikrais, natūraliais ir keičiančiais jūsų požiūrį į nealkoholinius gėrimus, skoniais. Puikios akimirkos nusipelno puikių gėrimų, todėl atsisakydami nusistovėjusių normų, suteikiame galimybę laisvai mėgautis rafinuotu, vyniško stiliaus putojančiu arbatos gėrimu, kuris yra vertas tosto.',
    price: 25,
    pricePer: '5 asmenys',
    icon: '🍵'
  },
  {
    id: 'maar',
    name: 'MAAR kvapų degustacija',
    description: 'Suteikite savo šventei subtilios prabangos su MAAR kvapų degustaciją, kur kiekvienas dalyvis galės pasinerti į prabangių kvapų pasaulį ir atrasti sau tinkamiausią aromatą. Turtingi ir ypatingi kvepalai yra tie, kurie spinduliuoja kompleksiškumu, ilgam įsirašo atmintyje ir yra sukurti, naudojant kokybiškus ingredientus. Degustacija idealiai tinka mergvakariams, ieškant vestuvių kvapo!',
    price: 45,
    pricePer: 'vienkartinė',
    icon: '🌸'
  },
  {
    id: 'painting',
    name: 'Tapymo užsiėmimas',
    description: 'Mėgaukitės kūryba po atviru dangumi! Siūlome intuityvios tapybos užsiėmimą, kurio metu kiekvienas dalyvis gali atsipalaiduoti, išreikšti emocijas ir sukurti savo unikalų paveikslą. Visi tapymo reikmenys įskaičiuoti. Ši veikla puikiai tinka gimtadieniams bei mergvakariams, padeda sustiprinti ryšį tarp dalyvių ir su savimi.',
    price: 10,
    pricePer: 'asm',
    icon: '🎨'
  },
  {
    id: 'plates',
    name: 'Užkandžių lėkštės',
    description: 'Maisto neteikiame, bet galime pasiūlyti estetiškas serviravimo lėkštes su jūsų atsineštiems užkandžiams arba pasirūpinti sezoninėmis, teminėmis vaišėmis (vaisias, uogomis, riešutais, sūriu, alyvuogėmis).',
    price: 30,
    pricePer: '5 asmenys',
    icon: '🍽️'
  }
];

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [guestCount, setGuestCount] = useState(2);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  // const [showContactForm, setShowContactForm] = useState(false);

  const location = searchParams.get('location');
  const date = searchParams.get('date');
  const theme = searchParams.get('theme');
  const time = searchParams.get('time');

  // Kainų struktūra pagal žmonių skaičių
  const getBasePrice = (guestCount: number) => {
    if (guestCount === 2) return 200;
    if (guestCount >= 3 && guestCount <= 6) return 240;
    if (guestCount >= 7 && guestCount <= 10) return 290;
    if (guestCount >= 11 && guestCount <= 14) return 380;
    return 200;
  };

  // Papildomų paslaugų kainos skaičiavimas
  const getAdditionalServicesPrice = () => {
    let total = 0;
    selectedServices.forEach(serviceId => {
      const service = ADDITIONAL_SERVICES.find(s => s.id === serviceId);
      if (service) {
        if (service.pricePer === 'asm') {
          total += service.price * guestCount;
        } else if (service.pricePer === '5 asmenys') {
          total += service.price * Math.ceil(guestCount / 5);
        } else {
          total += service.price;
        }
      }
    });
    return total;
  };

  const basePrice = getBasePrice(guestCount);
  const additionalPrice = getAdditionalServicesPrice();
  const totalPrice = basePrice + additionalPrice;

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate contact info
      if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
        alert('Prašome užpildyti visus kontaktinius duomenis');
        return;
      }

      // Create booking data
      const bookingData = {
        location,
        date,
        theme,
        time,
        guestCount,
        basePrice,
        additionalServices: selectedServices,
        additionalPrice,
        totalPrice,
        contactInfo
      };

      // Get ID token for authentication
      const idToken = await user?.getIdToken();
      
      // Send to API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { 'Authorization': `Bearer ${idToken}` }),
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Rezervacija sėkmingai išsaugota! Netrukus gausite patvirtinimo el. laišką.');
        router.push('/');
      } else if (response.status === 401) {
        // Redirect to sign in if unauthorized
        const returnUrl = `/booking/confirmation?${searchParams.toString()}`;
        router.push(`/auth/signin?from=${encodeURIComponent(returnUrl)}`);
      } else {
        throw new Error(result.error || 'Nepavyko išsaugoti rezervacijos');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(error instanceof Error ? error.message : 'Įvyko klaida kuriant rezervaciją');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!authLoading && !user) {
      const returnUrl = `/booking/confirmation?${searchParams.toString()}`;
      router.push(`/auth/signin?from=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, authLoading, router, searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kraunama...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  if (!location || !date || !theme || !time) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Klaida</h1>
          <p className="text-gray-600">Trūksta rezervacijos duomenų.</p>
        </div>
      </div>
    );
  }

  const locationName = LOCATIONS.find(l => l.id === location)?.name || location;
  const themeName = THEMES[theme as keyof typeof THEMES] || theme;
  const timeSlot = TIME_SLOTS[time as keyof typeof TIME_SLOTS];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rezervacijos Patvirtinimas
          </h1>
          <p className="text-lg text-gray-600">
            Patikrinkite savo rezervacijos informaciją ir pasirinkite papildomas paslaugas
          </p>
        </div>

        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Confirmation Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Rezervacijos Informacija</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Vieta:</span>
                <span className="font-semibold">{locationName}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Data:</span>
                <span className="font-semibold">
                  {new Date(date).toLocaleDateString('lt-LT')}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Tema:</span>
                <span className="font-semibold">{themeName}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Laikas:</span>
                <span className="font-semibold">
                  {timeSlot?.label} ({timeSlot?.start} - {timeSlot?.end})
                </span>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Žmonių skaičius
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={2}>2 asmenys - €200</option>
                <option value={3}>3-6 asmenys - €240</option>
                <option value={7}>7-10 asmenų - €290</option>
                <option value={11}>11-14 asmenų - €380</option>
              </select>
            </div>

            {/* Contact Information Form */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Kontaktinė informacija</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vardas ir pavardė *
                  </label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => handleContactInfoChange('name', e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jūsų vardas ir pavardė"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    El. paštas *
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="jūsų@email.lt"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefono numeris *
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+370 600 00000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Kainų Sąskaita</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Pagrindinė kaina:</span>
                <span className="font-semibold">€{basePrice}</span>
              </div>
              
              {selectedServices.length > 0 && (
                <div className="border-b border-gray-200 pb-4">
                  <div className="text-gray-600 mb-2">Papildomos paslaugos:</div>
                  {selectedServices.map(serviceId => {
                    const service = ADDITIONAL_SERVICES.find(s => s.id === serviceId);
                    if (!service) return null;
                    
                    let servicePrice = service.price;
                    if (service.pricePer === 'asm') {
                      servicePrice = service.price * guestCount;
                    } else if (service.pricePer === '5 asmenys') {
                      servicePrice = service.price * Math.ceil(guestCount / 5);
                    }
                    
                    return (
                      <div key={serviceId} className="flex justify-between items-center text-sm py-1">
                        <span className="text-gray-600">• {service.name}</span>
                        <span className="font-medium">€{servicePrice}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t-2 border-blue-200">
                <span className="text-lg font-semibold text-gray-900">Bendra kaina:</span>
                <span className="text-2xl font-bold text-blue-600">€{totalPrice}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                disabled={isSubmitting || !contactInfo.name || !contactInfo.email || !contactInfo.phone}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Išsaugoma...' : 'Patvirtinti Rezervaciją'}
              </button>
            </form>
          </div>
        </div>

        {/* Additional Services Section - Full Width */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Papildomos Paslaugos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADDITIONAL_SERVICES.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id={service.id}
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor={service.id} className="font-medium text-gray-900 cursor-pointer">
                        <span className="mr-2 text-xl">{service.icon}</span>
                        {service.name}
                      </label>
                    </div>
                    <div className="text-blue-600 font-semibold text-sm mb-2">
                      €{service.pricePer === 'asm' ? service.price : service.price}/{service.pricePer}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Grįžti atgal
          </button>
        </div>
      </div>
    </div>
  );
} 