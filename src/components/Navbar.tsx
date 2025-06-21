import Link from 'next/link'
import Logo from './Logo'

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-14 items-center px-4">
          <Link href="/" className="flex items-center">
            <Logo variant="horizontal" className="h-5" />
          </Link>

          <div className="hidden md:flex items-center ml-auto space-x-8">
            <Link href="/about" className="text-neutral-700 hover:text-primary-600">
              About
            </Link>
            <Link href="/services" className="text-neutral-700 hover:text-primary-600">
              Services
            </Link>
            <Link href="/gallery" className="text-neutral-700 hover:text-primary-600">
              Gallery
            </Link>
            <Link href="/contact" className="text-neutral-700 hover:text-primary-600">
              Contact
            </Link>
            <Link 
              href="/book" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 