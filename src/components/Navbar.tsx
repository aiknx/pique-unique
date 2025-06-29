'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Pradžia' },
    { href: '/themes', label: 'Temos' },
    { href: '/gallery', label: 'Galerija' },
    { href: '/about', label: 'Apie Mus' },
    { href: '/contact', label: 'Kontaktai' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo className="h-16 w-auto" variant="horizontal" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-hunter-green transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/book" className="btn-primary">
              Rezervuoti
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-hunter-green transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="block py-2 text-hunter-green font-semibold hover:text-cambridge-blue transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Rezervuoti
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
} 