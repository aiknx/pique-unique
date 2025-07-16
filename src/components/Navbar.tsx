'use client';

import Link from 'next/link';
import Logo from './common/Logo';

export default function Navbar() {
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
            <Link href="/about" className="text-hunter-green hover:text-cambridge-blue transition-colors">
              Apie Mus
            </Link>
            <Link href="/contact" className="text-hunter-green hover:text-cambridge-blue transition-colors">
              Kontaktai
            </Link>
            <Link href="/booking" className="btn-primary">
              Rezervuoti
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 