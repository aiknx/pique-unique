'use client'

import { AuthProvider } from '@/lib/auth'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-linen flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </AuthProvider>
  )
} 