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
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default defaultMetadata; 