import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';

interface BookingFormProps {
  selectedDate?: Date;
  selectedTheme?: string;
  selectedAddOns?: string[];
}

export default function BookingForm({ selectedDate, selectedTheme, selectedAddOns }: BookingFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedDate || !selectedTheme) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        date: selectedDate,
        theme: selectedTheme,
        guests,
        addOns: selectedAddOns || [],
        specialRequests,
        status: 'pending',
        createdAt: new Date(),
      });

      // Reset form or redirect
      setGuests(2);
      setSpecialRequests('');
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Number of Guests
        </label>
        <input
          type="number"
          min={2}
          max={10}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Special Requests
        </label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !selectedDate || !selectedTheme}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Book Now'}
      </button>
    </form>
  );
} 