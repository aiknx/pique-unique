'use client';

import Link from 'next/link';
import Logo from './common/Logo';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container-custom">
        <div className="flex items-center justify-between -my-2">
          <Logo />
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-hunter-green hover:text-cambridge-blue transition-colors">
              Pradžia
            </Link>
            <Link href="/themes" className="text-hunter-green hover:text-cambridge-blue transition-colors">
              Temos
            </Link>
            <Link href="/gallery" className="text-hunter-green hover:text-cambridge-blue transition-colors">
              Galerija
            </Link>
            <Link href="/reviews" className="text-hunter-green hover:text-cambridge-blue transition-colors">
              Atsiliepimai
            </Link>
            <Link href="/about" className="text-hunter-green hover:text-cambridge-blue transition-colors">
              Apie Mus
            </Link>
            <Link href="/contact" className="text-hunter-green hover:text-cambridge-blue transition-colors">
              Kontaktai
            </Link>
            <Link href="/booking" className="btn-primary">
              Rezervuoti
            </Link>
            
            {/* Authentication */}
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link href="/admin/bookings" className="bg-verdigris text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200">
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="text-hunter-green hover:text-cambridge-blue transition-colors">
                    {user.email}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {isAdmin && (
                      <Link
                        href="/admin/bookings"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panelis
                      </Link>
                    )}
                    {!isAdmin && (
                      <>
                        <Link
                          href="/my-bookings"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Mano Užsakymai
                        </Link>
                        <Link
                          href="/booking"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Rezervuoti Pikniką
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Atsijungti
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin" className="text-hunter-green hover:text-cambridge-blue transition-colors">
                  Prisijungti
                </Link>
                <Link href="/auth/signup" className="bg-hunter text-white px-4 py-2 rounded-lg hover:bg-hunter-dark transition-all duration-200">
                  Registruotis
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 