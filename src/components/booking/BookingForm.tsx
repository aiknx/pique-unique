'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/schema';
import ThemeSelection from './ThemeSelection';

interface BookingFormProps {
  selectedDate: Date;
  selectedLocation: string;
  selectedTimeSlot: {
    start: string;
    end: string;
  };
  selectedTheme?: string;
}

export default function BookingForm({ selectedDate, selectedLocation, selectedTimeSlot, selectedTheme }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    guests: 2,
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    },
    specialRequests: '',
    agreeToTerms: false,
    selectedTheme: null as unknown as { id: string; name: string; price: number }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('contactInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value
        }
      }));
    } else if (name === 'guests') {
      const guestCount = Math.min(Math.max(2, parseInt(value) || 2), 8);
      setFormData(prev => ({
        ...prev,
        [name]: guestCount
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleThemeSelect = (theme: unknown) => {
    setFormData(prev => ({
      ...prev,
      selectedTheme: theme as { id: string; name: string; price: number }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.selectedTheme) {
        throw new Error('Pasirinkite pikniko temą');
      }
      if (!formData.agreeToTerms) {
        throw new Error('Turite sutikti su sąlygomis');
      }
      if (formData.guests < 2 || formData.guests > 8) {
        throw new Error('Svečių skaičius turi būti nuo 2 iki 8');
      }

      // Create booking in Firestore
      const bookingData = {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        location: selectedLocation,
        guests: formData.guests,
        contactInfo: formData.contactInfo,
        specialRequests: formData.specialRequests,
        themeId: formData.selectedTheme.id,
        themeName: formData.selectedTheme.name,
        themePrice: formData.selectedTheme.price,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.BOOKINGS), bookingData);
      
      // Redirect to confirmation page
      router.push(`/booking/confirmation/${docRef.id}`);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err instanceof Error ? err.message : 'Įvyko klaida kuriant rezervaciją');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Selected Date and Time Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Jūsų pasirinkimas:</h3>
        <p>Data: {selectedDate.toLocaleDateString('lt-LT')}</p>
        <p>Laikas: {selectedTimeSlot.start} - {selectedTimeSlot.end}</p>
        <p>Vieta: {selectedLocation}</p>
      </div>

      {/* Guest Count */}
      <div className="max-w-2xl">
        <label htmlFor="guests" className="block text-lg font-semibold text-gray-900 mb-4">
          Kiek žmonių dalyvaus?
        </label>
        <div className="max-w-xs flex items-center space-x-4">
          <button
            type="button"
            onClick={() => {
              const newCount = Math.max(2, formData.guests - 1);
              setFormData(prev => ({ ...prev, guests: newCount }));
            }}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-hunter"
          >
            -
          </button>
          <div className="flex-1">
            <input
              type="number"
              name="guests"
              id="guests"
              min="2"
              max="8"
              required
              value={formData.guests}
              onChange={handleInputChange}
              className="block w-full text-center rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const newCount = Math.min(8, formData.guests + 1);
              setFormData(prev => ({ ...prev, guests: newCount }));
            }}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-hunter"
          >
            +
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">Minimalus svečių skaičius: 2, maksimalus: 8</p>
      </div>

      {/* Theme Selection */}
      <div className="border-t pt-8">
        <ThemeSelection
          onThemeSelect={handleThemeSelect}
          selectedTheme={formData.selectedTheme?.id || selectedTheme || ''}
        />
      </div>

      {/* Contact Information */}
      <div className="border-t pt-8 space-y-6">
        <h3 className="text-lg font-semibold">Kontaktinė informacija</h3>
        
        <div className="grid grid-cols-1 gap-6 max-w-2xl">
          <div>
            <label htmlFor="contactInfo.name" className="block text-sm font-medium text-gray-700">
              Vardas ir pavardė *
            </label>
            <input
              type="text"
              name="contactInfo.name"
              id="contactInfo.name"
              required
              value={formData.contactInfo.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            />
          </div>

          <div>
            <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700">
              El. paštas *
            </label>
            <input
              type="email"
              name="contactInfo.email"
              id="contactInfo.email"
              required
              value={formData.contactInfo.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            />
          </div>

          <div>
            <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700">
              Telefono numeris *
            </label>
            <input
              type="tel"
              name="contactInfo.phone"
              id="contactInfo.phone"
              required
              value={formData.contactInfo.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            />
          </div>

          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
              Papildomi pageidavimai
            </label>
            <textarea
              name="specialRequests"
              id="specialRequests"
              rows={3}
              value={formData.specialRequests}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            />
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            type="checkbox"
            name="agreeToTerms"
            id="agreeToTerms"
            required
            checked={formData.agreeToTerms}
            onChange={handleCheckboxChange}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-hunter focus:ring-hunter"
          />
          <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
            Sutinku su <a href="/terms" className="text-hunter hover:underline">taisyklėmis ir sąlygomis</a> *
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className={`
            px-6 py-2 bg-hunter text-white rounded-lg hover:bg-hunter-dark transition-colors
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {loading ? 'Siunčiama...' : 'Užbaigti rezervaciją'}
        </button>
      </div>
    </form>
  );
} 