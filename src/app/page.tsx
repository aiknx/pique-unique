import { Metadata } from 'next';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import WhyChooseUs from '@/components/WhyChooseUs';
import Features from '@/components/Features';
import Link from 'next/link';

const Reviews = dynamic(() => import('@/components/Reviews'), {
  loading: () => <div className="py-16 text-center">Kraunami atsiliepimai...</div>
});

export const metadata: Metadata = {
  title: 'Pique Unique - Prabangūs Piknikai Paplūdimyje Klaipėdoje ir Neringoje | Romantiški & Šeimos Piknikai',
  description: 'Atraskite unikalius prabangius piknikus paplūdimyje Klaipėdoje ir Neringoje. Romantiški, šeimai ir ypatingiems renginiams. Kruopščiai kurtos patirtys prie jūros su profesionaliais dekoracijomis ir meniu.',
  keywords: 'piknikai paplūdimyje, prabangūs piknikai, romantiški piknikai, šeimos piknikai, Klaipėda, Neringa, jūros piknikai, ypatingi renginiai, Pique Unique, paplūdimio piknikai, pikniko organizavimas, pikniko dekoracijos, pikniko meniu, undinių piknikas, fejų piknikas, laumių piknikas, disco piknikas',
  openGraph: {
    title: 'Pique Unique - Prabangūs Piknikai Paplūdimyje Klaipėdoje ir Neringoje',
    description: 'Atraskite unikalius prabangius piknikus paplūdimyje Klaipėdoje ir Neringoje. Romantiški, šeimai ir ypatingiems renginiams.',
    images: [
      {
        url: '/images/hero-picnic.webp',
        width: 1200,
        height: 630,
        alt: 'Prabangus piknikas paplūdimyje su draugėmis saulėlydyje - Pique Unique',
      }
    ],
    locale: 'lt_LT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pique Unique - Prabangūs Piknikai Paplūdimyje',
    description: 'Atraskite unikalius prabangius piknikus paplūdimyje Klaipėdoje ir Neringoje',
    images: ['/images/hero-picnic.webp'],
  },
  alternates: {
    canonical: '/',
  },
  other: {
    'geo.region': 'LT',
    'geo.placename': 'Klaipėda, Neringa',
    'geo.position': '55.7033;21.1443',
    'ICBM': '55.7033, 21.1443',
  },
};

export default function HomePage() {
  return (
    <main>
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-picnic.webp"
            alt="Prabangus piknikas paplūdimyje su draugėmis saulėlydyje - Pique Unique"
            fill
            className="object-cover object-left md:object-center"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            quality={65}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        {/* Content */}
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Prabangūs Piknikai
              <br />
              <span className="text-cherry-blossom">
                Paplūdimyje Klaipėdoje
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              PIQUE UNIQUE – tai ne tik piknikai, tai kruopščiai kurtos patirtys kviečiančios sustoti, 
              būti su artimaisiais ir švęsti gyvenimą kartu prie jūros.
            </p>
            
            {/* Large Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/booking" 
                className="btn-primary text-lg px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
              >
                Rezervuoti Dabar
              </Link>
              <Link 
                href="/themes" 
                className="btn-secondary text-lg px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
              >
                Peržiūrėti Temas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Reviews Section */}
      <Reviews />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Pique Unique",
            "description": "Prabangūs pikninkai paplūdimyje Klaipėdoje ir Neringoje",
            "url": "https://piqueunique.lt",
            "telephone": "+370-XXX-XXXXX",
            "email": "info@piqueunique.lt",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Klaipėda",
              "addressRegion": "Klaipėdos apskritis",
              "addressCountry": "LT"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 55.7033,
              "longitude": 21.1443
            },
            "openingHours": "Mo-Su 09:00-21:00",
            "priceRange": "€€€",
            "currenciesAccepted": "EUR",
            "paymentAccepted": "Cash, Credit Card, Bank Transfer",
            "serviceType": "Picnic Services",
            "areaServed": ["Klaipėda", "Neringa", "Palanga"],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Picnic Packages",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Romantiškas Piknikas",
                    "description": "Romantiškas piknikas poroms paplūdimyje"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Šeimos Piknikas",
                    "description": "Šeimos piknikas su vaikais paplūdimyje"
                  }
                }
              ]
            },
            "image": "https://piqueunique.lt/images/hero-picnic.webp",
            "logo": "https://piqueunique.lt/logo.png"
          })
        }}
      />
    </main>
  );
}
