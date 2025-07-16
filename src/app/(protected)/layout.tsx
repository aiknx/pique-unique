'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import SessionTimeout from '@/components/auth/SessionTimeout'

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-linen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      {children}
      <SessionTimeout />
    </>
  )
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ProtectedContent>
        <div className="min-h-screen">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </ProtectedContent>
    </AuthProvider>
  )
} 