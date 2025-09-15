"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import { StarIcon } from 'lucide-react';
import ReviewForm from '@/components/reviews/ReviewForm';

interface Review {
  id: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  userEmail?: string;
  name?: string;
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-linen py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-hunter-green mb-4">
            Klientų Atsiliepimai
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Perskaitykite, ką sako mūsų svečiai apie savo pikniko patirtį. 
            Jūsų atsiliepimas mums labai svarbus!
          </p>
        </div>

        {/* Review Form - Automatically show for registered users */}
        {user ? (
          <div className="mb-12">
            <ReviewForm
              bookingId="temp" // This should be passed from user's booking
              onSuccess={() => {
                fetchReviews();
              }}
            />
          </div>
        ) : (
          <div className="mb-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Norite palikti atsiliepimą?
            </h3>
            <p className="text-yellow-700 mb-4">
              Prisijunkite, kad galėtumėte pasidalinti savo patirtimi su kitais svečiais.
            </p>
            <a
              href="/auth/signin"
              className="inline-block bg-hunter text-white px-6 py-3 rounded-lg hover:bg-hunter-dark transition-colors font-medium"
            >
              Prisijungti
            </a>
          </div>
        )}

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter mx-auto"></div>
            <p className="mt-4 text-gray-600">Kraunami atsiliepimai...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Dar nėra atsiliepimų</p>
            {user && (
              <p className="text-gray-400 mt-2">Būkite pirmas, kuris paliks atsiliepimą!</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start space-x-4 mb-4">
                  {review.images && review.images.length > 0 && (
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={review.images[0]}
                        alt="Atsiliepimo nuotrauka"
                        fill
                        className="object-cover rounded"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex mb-2">{renderStars(review.rating)}</div>
                    <p className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString('lt-LT')}
                    </p>
                    {review.name ? (
                      <p className="text-sm text-gray-500 mt-1">
                        {review.name}
                      </p>
                    ) : review.userEmail && (
                      <p className="text-sm text-gray-500 mt-1">
                        {review.userEmail.split('@')[0]}***
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                {review.images && review.images.length > 1 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {review.images.slice(1, 4).map((image, index) => (
                      <div key={index} className="relative h-20">
                        <Image
                          src={image}
                          alt={`Atsiliepimo nuotrauka ${index + 1}`}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 768px) 33vw, 80px"
                        />
                        {review.images && index === 2 && review.images.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                            <span className="text-white text-sm font-medium">
                              +{review.images.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 