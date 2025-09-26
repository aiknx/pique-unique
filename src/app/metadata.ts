import { Metadata } from 'next';

const defaultMetadata: Metadata = {
  title: {
    default: 'Pique Unique | Prabangūs Pikninkai Paplūdimyje Klaipėdoje ir Neringoje',
    template: '%s | Pique Unique'
  },
  description: 'Pique Unique - prabangūs pikninkai paplūdimyje Klaipėdoje ir Neringoje. Kuriame nepamirštamus momentus su išskirtiniais piknikais, pritaikytais jūsų ypatingoms progoms. Romantiški, šeimos ir ypatingi renginiai prie jūros.',
  keywords: [
    'piknikas paplūdimyje',
    'prabangus piknikas',
    'romantiškas piknikas',
    'piknikas Klaipėdoje',
    'piknikas Neringoje',
    'šventė paplūdimyje',
    'gimtadienis paplūdimyje',
    'piršlybos paplūdimyje',
    'romantiškas vakaras',
    'šeimos piknikas',
    'ypatingi renginiai',
    'jūros piknikas',
    'paplūdimio piknikas',
    'pikniko organizavimas',
    'pikniko paslaugos',
    'pikniko dekoracijos',
    'pikniko meniu',
    'pikniko vietos',
    'pikniko rezervacija',
    'pikniko kainos',
    'pikniko temos',
    'undinių piknikas',
    'fejų piknikas',
    'laumių piknikas',
    'disco piknikas',
    'ACALA skonių kelionė',
    'MAAR kvapai',
    'tapymo užsiėmimas',
    'užkandžių lėkštės',
    'pikniko serviravimas'
  ],
  authors: [{ name: 'Pique Unique', url: 'https://piqueunique.lt' }],
  creator: 'Pique Unique',
  publisher: 'Pique Unique',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://piqueunique.lt'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pique Unique | Prabangūs Pikninkai Paplūdimyje Klaipėdoje ir Neringoje',
    description: 'Kuriame nepamirštamus momentus paplūdimyje su prabangiais piknikais, pritaikytais jūsų ypatingoms progoms. Romantiški, šeimos ir ypatingi renginiai prie jūros.',
    url: 'https://piqueunique.lt',
    siteName: 'Pique Unique',
    locale: 'lt_LT',
    type: 'website',
    images: [
      {
        url: '/images/hero-picnic.webp',
        width: 1200,
        height: 630,
        alt: 'Prabangus piknikas paplūdimyje - Pique Unique',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pique Unique | Prabangūs Pikninkai Paplūdimyje',
    description: 'Kuriame nepamirštamus momentus paplūdimyje su prabangiais piknikais',
    images: ['/images/hero-picnic.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'travel',
  classification: 'picnic services',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  other: {
    'geo.region': 'LT',
    'geo.placename': 'Klaipėda',
    'geo.position': '55.7033;21.1443',
    'ICBM': '55.7033, 21.1443',
    'DC.title': 'Pique Unique - Prabangūs Pikninkai Paplūdimyje',
    'DC.creator': 'Pique Unique',
    'DC.subject': 'Pikniko paslaugos, Romantiški renginiai, Šeimos piknikai',
    'DC.description': 'Prabangūs pikninkai paplūdimyje Klaipėdoje ir Neringoje',
    'DC.publisher': 'Pique Unique',
    'DC.contributor': 'Pique Unique',
    'DC.date': '2024',
    'DC.type': 'Service',
    'DC.format': 'text/html',
    'DC.identifier': 'https://piqueunique.lt',
    'DC.language': 'lt',
    'DC.coverage': 'Klaipėda, Neringa, Lietuva',
    'DC.rights': 'Copyright 2024 Pique Unique',
    'cache-version': 'v3.0-optimized',
    'deploy-timestamp': new Date().toISOString(),
  },
};

export default defaultMetadata; 