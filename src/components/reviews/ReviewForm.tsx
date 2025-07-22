'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { StarIcon } from 'lucide-react';

interface ReviewFormProps {
  bookingId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ bookingId, onSuccess, onCancel }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Reikia prisijungti prieš paliekant atsiliepimą');
      return;
    }

    if (!comment.trim()) {
      setError('Prašome parašyti atsiliepimą');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          bookingId
        }),
      });

      const result = await response.json();

      if (result.success) {
        setComment('');
        setRating(5);
        onSuccess?.();
      } else {
        setError(result.error || 'Nepavyko išsaugoti atsiliepimo');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Įvyko klaida siunčiant atsiliepimą');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setRating(index + 1)}
        className={`p-1 transition-colors ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400`}
      >
        <StarIcon className="h-6 w-6 fill-current" />
      </button>
    ));
  };

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Reikia prisijungti prieš paliekant atsiliepimą.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Palikite atsiliepimą</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Įvertinimas
          </label>
          <div className="flex items-center space-x-1">
            {renderStars()}
            <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Atsiliepimas *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            placeholder="Pasidalinkite savo patirtimi..."
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Atšaukti
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="px-4 py-2 bg-hunter text-white rounded-md hover:bg-hunter-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Siunčiama...' : 'Pateikti atsiliepimą'}
          </button>
        </div>
      </form>
    </div>
  );
} 