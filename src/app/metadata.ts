import { Metadata } from 'next';

const defaultMetadata: Metadata = {
  title: {
    default: 'Pique Unique | Prabangūs Pikninkai Paplūdimyje',
    template: '%s | Pique Unique'
  },
  description: 'Pique Unique - prabangūs pikninkai paplūdimyje Klaipėdoje. Kuriame nepamirštamus momentus su išskirtiniais piknikais, pritaikytais jūsų ypatingoms progoms.',
  keywords: [
    'piknikas paplūdimyje',
    'prabangus piknikas',
    'romantiškas piknikas',
    'piknikas Klaipėdoje',
    'šventė paplūdimyje',
    'gimtadienis paplūdimyje',
    'piršlybos paplūdimyje'
  ],
  authors: [{ name: 'Pique Unique' }],
  creator: 'Pique Unique',
  publisher: 'Pique Unique',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://piqueunique.lt'),
  openGraph: {
    title: 'Pique Unique | Prabangūs Pikninkai Paplūdimyje',
    description: 'Kuriame nepamirštamus momentus paplūdimyje su prabangiais piknikais, pritaikytais jūsų ypatingoms progoms.',
    url: 'https://piqueunique.lt',
    siteName: 'Pique Unique',
    locale: 'lt_LT',
    type: 'website',
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
};

export default defaultMetadata; 