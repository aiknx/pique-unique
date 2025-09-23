import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const GalleryContent = dynamic(() => import('@/components/GalleryContent'), {
  loading: () => <div className="py-16 text-center">Kraunama galerija...</div>
});

export const metadata: Metadata = {
  title: 'Pikniko Paslaugos - ACALA, MAAR, Tapymas | Pique Unique',
  description: 'Profesionalios pikniko paslaugos Klaipėdoje su temomis ir papildomomis paslaugomis. ACALA skonių kelionė, MAAR kvapų degustacija, tapymo užsiėmimas.',
  keywords: 'pikniko paslaugos, ACALA, MAAR kvapai, tapymo užsiėmimas, užkandžių lėkštės, Klaipėda, paplūdimio piknikas',
  openGraph: {
    title: 'Pikniko Paslaugos - Pique Unique',
    description: 'Profesionalios pikniko paslaugos su ACALA, MAAR ir kitomis paslaugomis',
    type: 'website',
    locale: 'lt_LT',
    siteName: 'Pique Unique',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pikniko Paslaugos - Pique Unique',
    description: 'Profesionalios pikniko paslaugos su ACALA, MAAR ir kitomis paslaugomis',
  },
  alternates: {
    canonical: 'https://pique-unique.lt/services',
  },
};

export const revalidate = 3600;

export default function ServicesPage() {
  return <GalleryContent />;
}
