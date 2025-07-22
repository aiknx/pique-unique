'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Patikrinkite savo el. paštą
          </h1>
          
          <p className="text-gray-600 mb-6">
            {email && (
              <>
                Išsiuntėme patvirtinimo nuorodą į <strong>{email}</strong>
              </>
            )}
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Greitas patvirtinimas:</strong> Spustelėkite nuorodą el. laiške arba tiesiog 
              <Link href="/auth/signin" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                prisijunkite dabar
              </Link>
            </p>
          </div>
          
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hunter hover:bg-hunter-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunter transition-colors"
            >
              Prisijungti dabar
            </Link>
            
            <Link
              href="/"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunter transition-colors"
            >
              Grįžti į pagrindinį
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 