'use client'

import Image from 'next/image'
import Link from 'next/link'

interface ThemeCardProps {
  id: string
  title: string
  description: string
  image: string
  price: number
}

export default function ThemeCard({ id, title, description, image, price }: ThemeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-hunter mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-hunter">${price}</span>
          <Link
            href={`/booking/form?theme=${id}`}
            className="px-4 py-2 bg-hunter text-white rounded-md hover:bg-hunter-dark transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
} 