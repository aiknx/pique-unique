'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const from = searchParams.get('from') || '/';
  const { signIn, signInWithGoogle, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      await signIn(email, password);
      // Nukreipimas į pagrindinį puslapį
      router.push('/');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    clearError();

    try {
      await signInWithGoogle();
      // Nukreipimas į pagrindinį puslapį
      router.push('/');
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Prisijungimas</h1>
        <p className="mt-2 text-sm text-gray-600">
          Neturite paskyros?{' '}
          <Link href="/signup" className="text-hunter-green hover:text-hunter-green/80 font-medium">
            Registruotis
          </Link>
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-800 bg-red-50 rounded" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            El. paštas
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-hunter-green focus:outline-none focus:ring-1 focus:ring-hunter-green text-sm"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Slaptažodis
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full rounded border border-gray-300 px-3 py-2 shadow-sm focus:border-hunter-green focus:outline-none focus:ring-1 focus:ring-hunter-green text-sm"
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-end">
          <Link href="/reset-password" className="text-sm text-hunter-green hover:text-hunter-green/80">
            Pamiršote slaptažodį?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-hunter-green hover:bg-hunter-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunter-green disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Jungiamasi...' : 'Prisijungti'}
        </button>
      </form>

      {/* Atskira Google prisijungimo sekcija */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Arba</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunter-green disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Jungiamasi...' : 'Prisijungti su Google'}
      </button>
    </div>
  );
} 