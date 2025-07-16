'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/schema';

interface Settings {
  bookingEnabled: boolean;
  maxGuestsPerBooking: number;
  bookingAdvanceDays: number;
  locations: {
    id: string;
    name: string;
    enabled: boolean;
  }[];
  timeSlots: {
    id: string;
    start: string;
    end: string;
    enabled: boolean;
  }[];
  contactEmail: string;
  contactPhone: string;
}

const defaultSettings: Settings = {
  bookingEnabled: true,
  maxGuestsPerBooking: 8,
  bookingAdvanceDays: 90,
  locations: [
    { id: 'klaipeda', name: 'Klaipėda', enabled: true },
    { id: 'juodkrante', name: 'Juodkrantė', enabled: true },
    { id: 'nida', name: 'Nida', enabled: true },
  ],
  timeSlots: [
    { id: 'morning', start: '10:00', end: '13:00', enabled: true },
    { id: 'afternoon', start: '14:00', end: '17:00', enabled: true },
    { id: 'evening', start: '18:00', end: '21:00', enabled: true },
  ],
  contactEmail: 'info@piqueunique.lt',
  contactPhone: '+370 600 00000',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'general');
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        setSettings(settingsSnap.data() as Settings);
      } else {
        // If no settings exist, create default ones
        await updateDoc(settingsRef, defaultSettings);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Klaida gaunant nustatymus');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'general');
      await updateDoc(settingsRef, settings);

      setSuccess('Nustatymai sėkmingai išsaugoti!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Klaida išsaugant nustatymus');
    } finally {
      setSaving(false);
    }
  };

  const toggleLocation = (locationId: string) => {
    setSettings(prev => ({
      ...prev,
      locations: prev.locations.map(loc =>
        loc.id === locationId ? { ...loc, enabled: !loc.enabled } : loc
      )
    }));
  };

  const toggleTimeSlot = (slotId: string) => {
    setSettings(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(slot =>
        slot.id === slotId ? { ...slot, enabled: !slot.enabled } : slot
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hunter"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Svetainės Nustatymai</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-8">
        {/* Booking Settings */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Užsakymų Nustatymai</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bookingEnabled"
                checked={settings.bookingEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, bookingEnabled: e.target.checked }))}
                className="h-4 w-4 text-hunter border-gray-300 rounded focus:ring-hunter"
              />
              <label htmlFor="bookingEnabled" className="ml-2 block text-sm text-gray-900">
                Įgalinti užsakymus
              </label>
            </div>

            <div>
              <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700">
                Maksimalus svečių skaičius
              </label>
              <input
                type="number"
                id="maxGuests"
                min="1"
                max="20"
                value={settings.maxGuestsPerBooking}
                onChange={(e) => setSettings(prev => ({ ...prev, maxGuestsPerBooking: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
              />
            </div>

            <div>
              <label htmlFor="advanceDays" className="block text-sm font-medium text-gray-700">
                Išankstinio užsakymo dienų skaičius
              </label>
              <input
                type="number"
                id="advanceDays"
                min="1"
                max="365"
                value={settings.bookingAdvanceDays}
                onChange={(e) => setSettings(prev => ({ ...prev, bookingAdvanceDays: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
              />
            </div>
          </div>
        </div>

        {/* Locations */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Vietovės</h2>
          <div className="space-y-2">
            {settings.locations.map((location) => (
              <div key={location.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`location-${location.id}`}
                  checked={location.enabled}
                  onChange={() => toggleLocation(location.id)}
                  className="h-4 w-4 text-hunter border-gray-300 rounded focus:ring-hunter"
                />
                <label htmlFor={`location-${location.id}`} className="ml-2 block text-sm text-gray-900">
                  {location.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Laiko Intervalai</h2>
          <div className="space-y-2">
            {settings.timeSlots.map((slot) => (
              <div key={slot.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`slot-${slot.id}`}
                  checked={slot.enabled}
                  onChange={() => toggleTimeSlot(slot.id)}
                  className="h-4 w-4 text-hunter border-gray-300 rounded focus:ring-hunter"
                />
                <label htmlFor={`slot-${slot.id}`} className="ml-2 block text-sm text-gray-900">
                  {slot.start} - {slot.end}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Kontaktinė Informacija</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                El. paštas
              </label>
              <input
                type="email"
                id="contactEmail"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                Telefono numeris
              </label>
              <input
                type="tel"
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="flex justify-end">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Išsaugoma...' : 'Išsaugoti pakeitimus'}
          </button>
        </div>
      </div>
    </div>
  );
} 