'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './common/Logo';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
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
            
            {/* Desktop Authentication */}
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-hunter-green hover:text-cambridge-blue transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="block text-hunter-green hover:text-cambridge-blue transition-colors py-2"
              >
                Pradžia
              </Link>
              <Link
                href="/themes"
                onClick={closeMobileMenu}
                className="block text-hunter-green hover:text-cambridge-blue transition-colors py-2"
              >
                Temos
              </Link>
              <Link
                href="/gallery"
                onClick={closeMobileMenu}
                className="block text-hunter-green hover:text-cambridge-blue transition-colors py-2"
              >
                Galerija
              </Link>
              <Link
                href="/reviews"
                onClick={closeMobileMenu}
                className="block text-hunter-green hover:text-cambridge-blue transition-colors py-2"
              >
                Atsiliepimai
              </Link>
              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="block text-hunter-green hover:text-cambridge-blue transition-colors py-2"
              >
                Apie Mus
              </Link>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="block text-hunter-green hover:text-cambridge-blue transition-colors py-2"
              >
                Kontaktai
              </Link>
              <Link
                href="/booking"
                onClick={closeMobileMenu}
                className="block bg-hunter text-white px-4 py-2 rounded-lg hover:bg-hunter-dark transition-all duration-200 text-center"
              >
                Rezervuoti
              </Link>

              {/* Mobile Authentication */}
              {user ? (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  {isAdmin && (
                    <Link
                      href="/admin/bookings"
                      onClick={closeMobileMenu}
                      className="block bg-verdigris text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 text-center"
                    >
                      Admin
                    </Link>
                  )}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                    {!isAdmin && (
                      <>
                        <Link
                          href="/my-bookings"
                          onClick={closeMobileMenu}
                          className="block text-hunter-green hover:text-cambridge-blue transition-colors py-1"
                        >
                          Mano Užsakymai
                        </Link>
                        <Link
                          href="/booking"
                          onClick={closeMobileMenu}
                          className="block text-hunter-green hover:text-cambridge-blue transition-colors py-1"
                        >
                          Rezervuoti Pikniką
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-hunter-green hover:text-cambridge-blue transition-colors py-1"
                    >
                      Atsijungti
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <Link
                    href="/auth/signin"
                    onClick={closeMobileMenu}
                    className="block text-hunter-green hover:text-cambridge-blue transition-colors py-2"
                  >
                    Prisijungti
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={closeMobileMenu}
                    className="block bg-hunter text-white px-4 py-2 rounded-lg hover:bg-hunter-dark transition-all duration-200 text-center"
                  >
                    Registruotis
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 