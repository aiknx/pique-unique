'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { blurDataURL } from '@/lib/utils';

// Tikrosios papildomos paslaugos iš rezervacijos formos
const additionalServices = [
  {
    id: 'acala',
    title: 'ACALA Skonių kelionė',
    description: 'Rafinuotas, vyniško stiliaus putojantis arbatos gėrimas',
    price: '25€',
    pricePer: '5 asmenys',
    image: '/images/services/acala.webp',
    details: 'Leiskite šventei įgyti dar daugiau prasmės su tikrais, natūraliais ir keičiančiais jūsų požiūrį į nealkoholinius gėrimus, skoniais. Puikios akimirkos nusipelno puikių gėrimų, todėl atsisakydami nusistovėjusių normų, suteikiame galimybę laisvai mėgautis rafinuotu, vyniško stiliaus putojančiu arbatos gėrimu, kuris yra vertas tosto.',
    icon: '🍵'
  },
  {
    id: 'maar',
    title: 'MAAR kvapų degustacija',
    description: 'Prabangių kvapų pasaulio atradimas',
    price: '45€',
    pricePer: 'vienkartinė',
    image: '/images/services/maar.webp',
    details: 'Suteikite savo šventei subtilios prabangos su MAAR kvapų degustacija, kur kiekvienas dalyvis galės pasinerti į prabangių kvapų pasaulį ir atrasti sau tinkamiausią aromatą. Turtingi ir ypatingi kvepalai yra tie, kurie spinduliuoja kompleksiškumu, ilgam įsirašo atmintyje ir yra sukurti, naudojant kokybiškus ingredientus. Degustacija idealiai tinka mergvakariams, ieškant vestuvių kvapo!',
    icon: '🌸'
  },
  {
    id: 'painting',
    title: 'Tapymo užsiėmimas',
    description: 'Kūryba po atviru dangumi',
    price: '10€',
    pricePer: 'asm',
    image: '/images/services/painting.webp',
    details: 'Mėgaukitės kūryba po atviru dangumi! Siūlome intuityvios tapybos užsiėmimą, kurio metu kiekvienas dalyvis gali atsipalaiduoti, išreikšti emocijas ir sukurti savo unikalų paveikslą. Visi tapymo reikmenys įskaičiuoti. Ši veikla puikiai tinka gimtadieniams bei mergvakariams, padeda sustiprinti ryšį tarp dalyvių ir su savimi.',
    icon: '🎨'
  },
  {
    id: 'plates',
    title: 'Užkandžių lėkštės',
    description: 'Estetiškas serviravimas ir sezoniniai užkandžiai',
    price: '30€',
    pricePer: '5 asmenys',
    image: '/images/services/plates.webp',
    details: 'Maisto neteikiame, bet galime pasiūlyti estetiškas serviravimo lėkštes su jūsų atsineštiems užkandžiams arba pasirūpinti sezoninėmis, teminėmis vaišėmis (vaisias, uogomis, riešutais, sūriu, alyvuogėmis).',
    icon: '🍽️'
  }
];

export default function GalleryContent() {
  const [selectedService, setSelectedService] = useState<typeof additionalServices[0] | null>(null);

  return (
    <main className="bg-sand min-h-screen">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold text-hunter-green text-center mb-8">
            Papildomos Paslaugos
          </h1>
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-12">
            Pasirūpinkime, kad jūsų piknikas būtų dar ypatingesnis. 
            Siūlome įvairias papildomas paslaugas, kurios padarys jūsų dieną nepamirštamą.
          </p>
        </div>
      </section>



      {/* Services Grid */}
      <section className="pb-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow"
                onClick={() => setSelectedService(service)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-hunter-green text-white px-3 py-1 rounded-full text-sm font-medium">
                    {service.price}
                    <div className="text-xs opacity-90">{service.pricePer}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-hunter-green mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <button className="text-cambridge-blue hover:text-hunter-green font-medium transition-colors">
                    Sužinoti daugiau →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <Image
                src={selectedService.image}
                alt={selectedService.title}
                fill
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL={blurDataURL}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                onClick={() => setSelectedService(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedService.icon}</span>
                  <h2 className="text-2xl font-bold text-hunter-green">
                    {selectedService.title}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="bg-hunter-green text-white px-4 py-2 rounded-full text-lg font-medium">
                    {selectedService.price}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">{selectedService.pricePer}</div>
                </div>
              </div>
              <p className="text-gray-600 text-lg mb-6">
                {selectedService.details}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Uždaryti
                </button>
                <Link
                  href="/booking"
                  onClick={() => setSelectedService(null)}
                  className="flex-1 bg-hunter-green text-white py-3 rounded-lg hover:bg-hunter-dark transition-colors text-center"
                >
                  Užsakyti
                </Link>
              </div>
            </div>
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
          <Link href="/booking" className="btn-primary">
            Rezervuoti Dabar
          </Link>
        </div>
      </section>
    </main>
  );
} 