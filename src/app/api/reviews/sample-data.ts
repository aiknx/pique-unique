export type PublicReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
  isPublic: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
};

export const SAMPLE_REVIEWS: PublicReview[] = [
  {
    id: 'sample-1',
    name: 'Simona M.',
    rating: 5,
    comment:
      'Absoliučiai magiška patirtis! Apipavidalinimas buvo nuostabus, o dėmesys detalėms - neįtikėtinas. Padarė mūsų metines ypatingas.',
    date: '2025-07-15',
    image: '/images/reviews/sarah.jpg',
    isPublic: true,
    status: 'approved',
    createdAt: new Date('2025-07-15'),
  },
  {
    id: 'sample-2',
    name: 'Jonas K.',
    rating: 5,
    comment:
      'Tobula vieta piršlyboms! Komanda padarė viską ir dar daugiau, kad viskas būtų tobula. Ji pasakė taip!',
    date: '2025-07-10',
    image: '/images/reviews/james.jpg',
    isPublic: true,
    status: 'approved',
    createdAt: new Date('2025-07-10'),
  },
  {
    id: 'sample-3',
    name: 'Emilija R.',
    rating: 5,
    comment:
      'Toks unikalus būdas atšvęsti gimtadienį. Maistas buvo skanus, o apipavidalinimas - vertas Instagramo!',
    date: '2025-07-01',
    image: '/images/reviews/emily.jpg',
    isPublic: true,
    status: 'approved',
    createdAt: new Date('2025-07-01'),
  },
];


