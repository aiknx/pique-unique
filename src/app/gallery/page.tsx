import { Metadata } from 'next';
import GalleryContent from '@/components/GalleryContent';

export const metadata: Metadata = {
  title: 'Papildomos Paslaugos - ACALA, MAAR, Tapymas | Pique Unique',
  description: 'Papildomos paslaugos jūsų ypatingam piknikui: ACALA skonių kelionė, MAAR kvapų degustacija, tapymo užsiėmimas ir estetiškas serviravimas.',
  keywords: 'papildomos paslaugos, ACALA, MAAR kvapai, tapymo užsiėmimas, užkandžių lėkštės, pikniko paslaugos, Klaipėda',
  openGraph: {
    title: 'Papildomos Paslaugos - Pique Unique',
    description: 'Papildomos paslaugos jūsų ypatingam piknikui: ACALA, MAAR, tapymas ir serviravimas',
  },
};

export default function GalleryPage() {
  return <GalleryContent />;
} 