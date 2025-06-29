import { Metadata } from 'next';
import GalleryContent from '@/components/GalleryContent';

export const metadata: Metadata = {
  title: 'Galerija | Pique Unique',
  description: 'Apžiūrėkite mūsų suorganizuotus prabangius piknikus paplūdimyje. Įkvėpkite save savo ypatingai progai.',
};

export default function GalleryPage() {
  return <GalleryContent />;
} 