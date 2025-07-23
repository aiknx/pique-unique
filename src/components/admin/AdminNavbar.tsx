'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Skydelis', href: '/admin' },
  { name: 'Užsakymai', href: '/admin/bookings' },
  { name: 'Papildomos paslaugos', href: '/admin/gallery' },
  { name: 'Atsiliepimai', href: '/admin/reviews' },
  { name: 'Temos', href: '/admin/themes' },
  { name: 'Laiškai', href: '/admin/emails' },
  { name: 'Nustatymai', href: '/admin/settings' },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-hunter-green">
                Pique Unique Admin
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b text-sm font-medium ${
                      isActive
                        ? 'border-hunter-green text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 