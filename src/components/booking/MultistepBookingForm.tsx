'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/auth';
import { bookingSchema, type BookingInput } from '@/lib/validation/booking';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic imports
const Calendar = dynamic(() => import('@/components/booking/Calendar'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
});

const TimeSlots = dynamic(() => import('@/components/booking/TimeSlots'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
});

const ThemeSelection = dynamic(() => import('@/components/booking/ThemeSelection'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
});

const AddOns = dynamic(() => import('@/components/booking/AddOns'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
});

const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
});

const LOCATIONS = [
  { id: 'juodkrante', name: 'Juodkrantė', description: 'Neringos miesto savivaldybė' },
  { id: 'nida', name: 'Nida', description: 'Neringos miesto savivaldybė' },
  { id: 'klaipeda', name: 'Klaipėda', description: 'Klaipėdos miesto savivaldybė' },
];

const TIME_SLOTS = {
  '10:00': { start: '10:00', end: '13:00', label: 'Rytas' },
  '14:00': { start: '14:00', end: '17:00', label: 'Popietė' },
  '18:00': { start: '18:00', end: '21:00', label: 'Vakaras' }
} as const;

type Step = 'location' | 'theme' | 'contact';

export default function MultistepBookingForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('location');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      location: 'juodkrante',
      date: '',
      theme: '',
      time: '',
      guestCount: 2,
      basePrice: 0,
      additionalServices: [],
      additionalPrice: 0,
      totalPrice: 0,
      contactInfo: {
        name: '',
        email: '',
        phone: '',
      },
    },
  });

  const { handleSubmit, watch, setValue, formState: { errors } } = methods;
  const watchedValues = watch();

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!user || currentStep === 'contact') return;

    const timer = setTimeout(async () => {
      try {
        await saveDraft(watchedValues);
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [watchedValues, user, currentStep, saveDraft]);

  const saveDraft = async (data: Partial<BookingInput>) => {
    if (!user) return;

    const response = await fetch('/api/bookings/create-draft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save draft');
    }
  };

  const onSubmit = async (data: BookingInput) => {
    if (!user) {
      router.push('/signin');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          finalize: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Nepavyko išsaugoti rezervacijos');
      }

      router.push(`/booking/confirmation/${result.bookingId}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Įvyko klaida');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    switch (currentStep) {
      case 'location':
        if (watchedValues.location && watchedValues.date && watchedValues.time) {
          setCurrentStep('theme');
        }
        break;
      case 'theme':
        if (watchedValues.theme) {
          setCurrentStep('contact');
        }
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case 'theme':
        setCurrentStep('location');
        break;
      case 'contact':
        setCurrentStep('theme');
        break;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'location':
        return watchedValues.location && watchedValues.date && watchedValues.time;
      case 'theme':
        return watchedValues.theme;
      case 'contact':
        return watchedValues.contactInfo?.name && watchedValues.contactInfo?.email && watchedValues.contactInfo?.phone;
      default:
        return false;
    }
  };

  const calculateTotal = () => {
    const basePrice = 50; // Base price per person
    const guestCount = watchedValues.guestCount || 2;
    const additionalPrice = watchedValues.additionalPrice || 0;
    return (basePrice * guestCount) + additionalPrice;
  };

  // Update total price when dependencies change
  useEffect(() => {
    const total = calculateTotal();
    setValue('totalPrice', total);
    setValue('basePrice', 50 * (watchedValues.guestCount || 2));
  }, [watchedValues.guestCount, watchedValues.additionalPrice, setValue, calculateTotal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rezervuokite Pikniką
          </h1>
          <p className="text-lg text-gray-600">
            Pasirinkite vietą, datą, temą ir užpildykite kontaktinę informaciją
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center space-x-8">
            {[
              { key: 'location', label: 'Vieta & Laikas', step: 1 },
              { key: 'theme', label: 'Tema & Paslaugos', step: 2 },
              { key: 'contact', label: 'Kontaktai', step: 3 },
            ].map(({ key, label, step }) => {
              const isActive = currentStep === key;
              const isCompleted = 
                (key === 'location' && (currentStep === 'theme' || currentStep === 'contact')) ||
                (key === 'theme' && currentStep === 'contact');
              
              return (
                <div key={key} className={`flex items-center ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isActive ? 'bg-blue-600 text-white' : 
                    isCompleted ? 'bg-green-600 text-white' : 
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? '✓' : step}
                  </div>
                  <span className="ml-3 font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Location & Time */}
                {currentStep === 'location' && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6">Pasirinkite vietą ir laiką</h2>
                    
                    {/* Location Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Vieta</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {LOCATIONS.map((location) => (
                          <button
                            key={location.id}
                            type="button"
                            onClick={() => setValue('location', location.id as 'juodkrante' | 'nida' | 'klaipeda')}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              watchedValues.location === location.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                          >
                            <h3 className="font-semibold text-gray-900">{location.name}</h3>
                            <p className="text-sm text-gray-600">{location.description}</p>
                          </button>
                        ))}
                      </div>
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                      )}
                    </div>

                    {/* Date Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Data</label>
                      <Calendar
                        selectedDate={watchedValues.date}
                        onDateSelect={(date) => setValue('date', date)}
                        location={watchedValues.location}
                        className="max-w-md"
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                      )}
                    </div>

                    {/* Time Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Laikas</label>
                      <TimeSlots
                        selectedTime={watchedValues.time}
                        onTimeSelect={(time) => setValue('time', time)}
                        date={watchedValues.date}
                        location={watchedValues.location}
                      />
                      {errors.time && (
                        <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                      )}
                    </div>

                    {/* Guest Count */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Svečių skaičius</label>
                      <select
                        value={watchedValues.guestCount}
                        onChange={(e) => setValue('guestCount', parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Array.from({ length: 19 }, (_, i) => i + 2).map(num => (
                          <option key={num} value={num}>{num} asmenys</option>
                        ))}
                      </select>
                      {errors.guestCount && (
                        <p className="mt-1 text-sm text-red-600">{errors.guestCount.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Theme & Services */}
                {currentStep === 'theme' && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6">Pasirinkite temą ir papildomas paslaugas</h2>
                    
                    {/* Theme Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Tema</label>
                      <ThemeSelection
                        selectedTheme={watchedValues.theme}
                        onThemeSelect={(theme) => setValue('theme', theme)}
                      />
                      {errors.theme && (
                        <p className="mt-1 text-sm text-red-600">{errors.theme.message}</p>
                      )}
                    </div>

                    {/* Additional Services */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Papildomos paslaugos</label>
                      <AddOns
                        selectedServices={watchedValues.additionalServices || []}
                        onServicesChange={(services: string[]) => {
                          setValue('additionalServices', services);
                          // Calculate additional price
                          const prices: Record<string, number> = { acala: 25, maar: 45, painting: 10, plates: 30 };
                          const total = services.reduce((sum: number, service: string) => sum + (prices[service] || 0), 0);
                          setValue('additionalPrice', total);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Information */}
                {currentStep === 'contact' && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6">Kontaktinė informacija</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vardas *</label>
                        <input
                          type="text"
                          {...methods.register('contactInfo.name')}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Jūsų vardas"
                        />
                        {errors.contactInfo?.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.contactInfo.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">El. paštas *</label>
                        <input
                          type="email"
                          {...methods.register('contactInfo.email')}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="jusu@email.lt"
                        />
                        {errors.contactInfo?.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.contactInfo.email.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefono numeris *</label>
                        <input
                          type="tel"
                          {...methods.register('contactInfo.phone')}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+370 600 00000"
                        />
                        {errors.contactInfo?.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.contactInfo.phone.message}</p>
                        )}
                      </div>
                    </div>

                    {error && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 'location'}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Grįžti atgal
                  </button>

                  {currentStep === 'contact' ? (
                    <button
                      type="submit"
                      disabled={isSubmitting || !canProceed()}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                    >
                      {isSubmitting ? 'Išsaugoma...' : 'Patvirtinti rezervaciją'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                    >
                      Toliau
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column - Summary & Weather */}
              <div className="space-y-6">
                {/* Weather Widget */}
                {watchedValues.location && watchedValues.date && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Oro prognozė</h3>
                    <WeatherWidget location={watchedValues.location} date={watchedValues.date} />
                  </div>
                )}

                {/* Booking Summary */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Rezervacijos santrauka</h3>
                  <div className="space-y-3 text-sm">
                    {watchedValues.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vieta:</span>
                        <span className="font-medium">
                          {LOCATIONS.find(l => l.id === watchedValues.location)?.name}
                        </span>
                      </div>
                    )}
                    {watchedValues.date && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data:</span>
                        <span className="font-medium">
                          {new Date(watchedValues.date).toLocaleDateString('lt-LT')}
                        </span>
                      </div>
                    )}
                    {watchedValues.time && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Laikas:</span>
                        <span className="font-medium">
                          {TIME_SLOTS[watchedValues.time as keyof typeof TIME_SLOTS]?.label} ({watchedValues.time})
                        </span>
                      </div>
                    )}
                    {watchedValues.guestCount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Svečiai:</span>
                        <span className="font-medium">{watchedValues.guestCount} asmenys</span>
                      </div>
                    )}
                    {watchedValues.theme && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tema:</span>
                        <span className="font-medium">{watchedValues.theme}</span>
                      </div>
                    )}
                    {watchedValues.additionalServices && watchedValues.additionalServices.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Papildomos paslaugos:</span>
                        <span className="font-medium">{watchedValues.additionalServices.length} paslaugos</span>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bazinė kaina:</span>
                        <span className="font-medium">{watchedValues.basePrice || 0}€</span>
                      </div>
                      {watchedValues.additionalPrice && watchedValues.additionalPrice > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Papildomos paslaugos:</span>
                          <span className="font-medium">{watchedValues.additionalPrice}€</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                        <span>Iš viso:</span>
                        <span className="text-green-600">{watchedValues.totalPrice || 0}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
