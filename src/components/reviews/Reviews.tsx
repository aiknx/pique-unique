import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCachedCollection } from '@/lib/firebase/cache';
import { COLLECTIONS } from '@/lib/firebase/schema';
import type { Review } from '@/lib/firebase/schema';
import { StarIcon } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getCachedCollection<Review>(COLLECTIONS.REVIEWS);
        setReviews(reviewsData.filter(review => review.isPublic).slice(0, 6));
      } catch (error) {
        console.error('Klaida gaunant atsiliepimus:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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

  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto mt-4 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-32 mt-2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Ką Sako Mūsų Svečiai</h2>
        <p className="text-gray-600">
          Perskaitykite atsiliepimus iš mūsų nuostabių svečių
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4 mb-4">
              {review.images && review.images.length > 0 && (
                <div className="relative w-20 h-20">
                  <Image
                    src={review.images[0]}
                    alt="Atsiliepimo nuotrauka"
                    fill
                    className="object-cover rounded"
                    sizes="80px"
                  />
                </div>
              )}
              <div>
                <div className="flex mb-1">{renderStars(review.rating)}</div>
                <p className="text-sm text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString('lt-LT')}
                </p>
              </div>
            </div>

            <p className="text-gray-700 line-clamp-4">{review.comment}</p>

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
    </div>
  );
} 