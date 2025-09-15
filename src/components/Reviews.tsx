/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Review = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
  image?: string
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Simona M.',
    rating: 5,
    comment: 'Absoliučiai magiška patirtis! Apipavidalinimas buvo nuostabus, o dėmesys detalėms - neįtikėtinas. Padarė mūsų metines ypatingas.',
    date: '2025-07-15',
    image: '/images/reviews/sarah.jpg'
  },
  {
    id: '2',
    name: 'Jonas K.',
    rating: 5,
    comment: 'Tobula vieta piršlyboms! Komanda padarė viską ir dar daugiau, kad viskas būtų tobula. Ji pasakė taip!',
    date: '2025-07-10',
    image: '/images/reviews/james.jpg'
  },
  {
    id: '3',
    name: 'Emilija R.',
    rating: 5,
    comment: 'Toks unikalus būdas atšvęsti gimtadienį. Maistas buvo skanus, o apipavidalinimas - vertas Instagramo!',
    date: '2025-07-01',
    image: '/images/reviews/emily.jpg'
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'text-yellow-400' : 'text-neutral-200'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) return;
        const data: { reviews?: Partial<Review & { createdAt?: string | Date }>[]} = await res.json();
        const apiReviews: Review[] = (data.reviews || []).map((r, idx: number) => ({
          id: r.id || String(idx),
          name: r.name as string,
          rating: r.rating as number,
          comment: r.comment as string,
          date: (r.date as string) || new Date(r.createdAt as string | Date).toISOString().slice(0, 10),
          image: r.image as string | undefined,
        }));
        if (isMounted && apiReviews.length) setReviews(apiReviews);
      } catch {}
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-primary-600 mb-4">
            Ką sako mūsų svečiai
          </h2>
          <p className="text-lg text-neutral-700">
            Perskaitykite apie magiškas akimirkas, kurias sukūrėme mūsų svečiams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map(review => (
            <div key={review.id} className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-neutral-100 mr-4">
                  {/* Image placeholder */}
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">{review.name}</h3>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="text-neutral-700 mb-4">{review.comment}</p>
              <time className="text-sm text-neutral-500">{review.date}</time>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/reviews"
            className="btn-outline"
          >
            Visi atsiliepimai
          </Link>
        </div>
      </div>
    </section>
  )
} 