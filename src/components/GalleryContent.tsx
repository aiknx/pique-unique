'use client';

import { useState } from 'react';
import Image from 'next/image';

// Galerijos nuotraukų duomenys
const galleryImages = [
  {
    src: '/images/gallery/romantic-1.jpg',
    alt: 'Romantiškas piknikas saulėlydyje',
    category: 'romantic'
  },
  {
    src: '/images/gallery/romantic-2.jpg',
    alt: 'Vakarienė paplūdimyje dviems',
    category: 'romantic'
  },
  {
    src: '/images/gallery/family-1.jpg',
    alt: 'Šeimos piknikas paplūdimyje',
    category: 'family'
  },
  {
    src: '/images/gallery/family-2.jpg',
    alt: 'Vaikų gimtadienis paplūdimyje',
    category: 'family'
  },
  {
    src: '/images/gallery/luxury-1.jpg',
    alt: 'Prabangus piknikas su šampanu',
    category: 'luxury'
  },
  {
    src: '/images/gallery/luxury-2.jpg',
    alt: 'VIP piknikas saulėlydyje',
    category: 'luxury'
  },
  // Galite pridėti daugiau nuotraukų pagal poreikį
];

export default function GalleryContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <main className="bg-sand min-h-screen">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-hunter-green text-center mb-8">
            Mūsų Piknikų Galerija
          </h1>
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-12">
            Apžiūrėkite mūsų suorganizuotus piknikus ir įkvėpkite save savo ypatingai progai.
            Kiekvienas piknikas yra unikalus ir pritaikytas pagal klientų norus.
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="pb-8">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-hunter-green text-white'
                  : 'bg-white text-hunter-green hover:bg-hunter-green hover:text-white'
              }`}
            >
              Visi
            </button>
            <button
              onClick={() => setSelectedCategory('romantic')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'romantic'
                  ? 'bg-hunter-green text-white'
                  : 'bg-white text-hunter-green hover:bg-hunter-green hover:text-white'
              }`}
            >
              Romantiški
            </button>
            <button
              onClick={() => setSelectedCategory('family')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'family'
                  ? 'bg-hunter-green text-white'
                  : 'bg-white text-hunter-green hover:bg-hunter-green hover:text-white'
              }`}
            >
              Šeimai
            </button>
            <button
              onClick={() => setSelectedCategory('luxury')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'luxury'
                  ? 'bg-hunter-green text-white'
                  : 'bg-white text-hunter-green hover:bg-hunter-green hover:text-white'
              }`}
            >
              Prabangūs
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => setSelectedImage(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-center px-4">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-4xl aspect-[3/2]">
            <Image
              src={selectedImage}
              alt="Enlarged gallery image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-hunter-green text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">
            Norite Savo Ypatingo Momento?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Susisiekite su mumis ir sukurkime jūsų svajonių pikniką paplūdimyje kartu!
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-hunter-green py-3 px-8 rounded-md font-medium hover:bg-sand transition-colors"
          >
            Rezervuoti Dabar
          </a>
        </div>
      </section>
    </main>
  );
} 