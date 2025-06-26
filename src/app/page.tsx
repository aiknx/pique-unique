'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import Reviews from '@/components/Reviews'

const BookPage = dynamic(() => import('./book/page'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter"></div>
    </div>
  ),
  ssr: false
})

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold">Pique Unique</h1>
          <p className="text-xl text-gray-600">Luxury Picnic Experiences</p>
          <div className="space-x-4">
            <a 
              href="/book" 
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark"
            >
              Book Now
            </a>
            <a 
              href="/themes" 
              className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white"
            >
              Explore Themes
            </a>
          </div>
        </div>
        <Reviews />
      </main>
    </div>
  )
}
