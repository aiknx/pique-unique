'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepavyko atstatyti slaptažodžio');
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="w-full max-w-sm mx-4 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-hunter">Slaptažodžio Atstatymas</h1>
          <p className="mt-2 text-sm text-gray-600">
            Įveskite savo el. paštą ir mes atsiųsime jums slaptažodžio atstatymo nuorodą
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="p-2 bg-green-50 text-green-600 text-sm rounded-lg">
              Slaptažodžio atstatymo nuoroda išsiųsta į jūsų el. paštą
            </div>
            <div className="text-center">
              <Link
                href="/signin"
                className="text-sm text-hunter hover:text-hunter-dark"
              >
                Grįžti į prisijungimo puslapį
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                El. paštas
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-hunter text-white rounded-md hover:bg-hunter-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunter text-sm font-medium transition-colors"
            >
              Siųsti atstatymo nuorodą
            </button>

            <div className="text-center">
              <Link
                href="/signin"
                className="text-xs text-hunter hover:text-hunter-dark"
              >
                Grįžti į prisijungimo puslapį
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 