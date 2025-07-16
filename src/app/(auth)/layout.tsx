'use client'

import { AuthProvider } from '@/lib/auth'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-linen flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
          {children}
        </div>
      </div>
    </AuthProvider>
  )
} 