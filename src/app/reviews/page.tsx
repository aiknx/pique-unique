'use client';

import { useState, useEffect } from 'react';
import { getCachedCollection } from '@/lib/firebase/cache';
import { COLLECTIONS } from '@/lib/firebase/schema';
import type { Review } from '@/lib/firebase/schema';
import Image from 'next/image';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getCachedCollection<Review>(COLLECTIONS.REVIEWS);
        setReviews(reviewsData.filter(review => review.isPublic));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linen py-12">
        <div className="container-custom">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold text-hunter mb-12 text-center">
          Klientų Atsiliepimai
        </h1>

        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={review.images?.[0] || '/images/default-avatar.png'}
                    alt="Reviewer"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-hunter">Klientas</h3>
                  <p className="text-gray-600">{review.createdAt.toLocaleDateString('lt-LT')}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">{review.comment}</p>
              {review.rating && (
                <div className="mt-2 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                Šiuo metu atsiliepimų nėra. Būkite pirmi!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 