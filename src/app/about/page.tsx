import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Apie Mus - Pique Unique Istorija | Prabangūs Piknikai Klaipėdoje ir Neringoje',
  description: 'Sužinokite Pique Unique istoriją - kaip gimė mūsų idėja kurti prabangius paplūdimio piknikus Klaipėdoje ir Neringoje. Mes kuriame nepamirštamus momentus prie jūros su profesionaliais dekoracijomis ir meniu.',
  keywords: 'Pique Unique istorija, apie mus, paplūdimio piknikai Klaipėda, prabangūs piknikai, mūsų komanda, pikniko organizatoriai, pikniko paslaugos Klaipėdoje, pikniko istorija, pikniko komanda',
  openGraph: {
    title: 'Apie Mus - Pique Unique Istorija',
    description: 'Sužinokite Pique Unique istoriją ir kaip mes kuriame nepamirštamus momentus prie jūros',
    images: [
      {
        url: '/images/about-story.webp',
        width: 1200,
        height: 630,
        alt: 'Pique Unique istorija - nuostabūs momentai paplūdimyje',
      }
    ],
    locale: 'lt_LT',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="bg-sand">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src="/images/about-story.webp"
          alt="Pique Unique istorija - nuostabūs momentai paplūdimyje"
          fill
          className="object-cover object-bottom md:object-center"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center px-4 mb-4">
              Mūsų Istorija
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4">
              Kaip gimė Pique Unique ir kodėl mes kuriame nepamirštamus momentus
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-hunter-green mb-6">
              Kaip Viskas Prasidėjo
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Pique Unique gimė iš meilės jūrai ir noro sukurti ypatingus momentus. 
              Mes tikime, kad kiekviena proga verta švęsti, o kas gali būti geriau 
              nei šventė paplūdimyje su artimaisiais?
            </p>
            <p className="text-lg text-gray-700">
              Mūsų kelionė prasidėjo Klaipėdoje, kur jūros ošimas ir smėlio 
              švelnumas įkvėpė mus kurti unikalius piknikus. Nuo tada mes 
              nepaliaujamai tobuliname savo paslaugas, kad galėtume pasiūlyti 
              jums nepakartojamai gražius momentus prie jūros.
            </p>
          </div>
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Pique Unique",
            "description": "Prabangūs pikninkai paplūdimyje Klaipėdoje ir Neringoje",
            "url": "https://piqueunique.lt",
            "logo": "https://piqueunique.lt/logo.png",
            "image": "https://piqueunique.lt/images/about-story.webp",
            "foundingDate": "2024",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Klaipėda",
              "addressRegion": "Klaipėdos apskritis",
              "addressCountry": "LT"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "info@piqueunique.lt"
            },
            "sameAs": [
              "https://facebook.com/piqueunique",
              "https://instagram.com/piqueunique.lt"
            ]
          })
        }}
      />
    </main>
  );
} 