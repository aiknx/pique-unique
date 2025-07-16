'use client';

import AdminRoute from '@/components/auth/AdminRoute';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <main className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AdminRoute>
  );
} 