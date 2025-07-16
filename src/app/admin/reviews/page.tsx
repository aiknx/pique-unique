'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/schema';

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export default function ReviewsManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsQuery = query(
        collection(db, COLLECTIONS.REVIEWS),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(reviewsQuery);
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Review[];
      setReviews(reviewsData);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Klaida gaunant atsiliepimų sąrašą');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: Review['status']) => {
    try {
      const reviewRef = doc(db, COLLECTIONS.REVIEWS, reviewId);
      await updateDoc(reviewRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      // Update local state
      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId
            ? { ...review, status: newStatus }
            : review
        )
      );
    } catch (err) {
      console.error('Error updating review status:', err);
      setError('Klaida atnaujinant atsiliepimo statusą');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Ar tikrai norite ištrinti šį atsiliepimą?')) return;

    try {
      await deleteDoc(doc(db, COLLECTIONS.REVIEWS, reviewId));
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Klaida trinant atsiliepimą');
    }
  };

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Review['status']) => {
    switch (status) {
      case 'pending': return 'Laukiama';
      case 'approved': return 'Patvirtinta';
      case 'rejected': return 'Atmesta';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hunter"></div>
      </div>
    );
  }

  const filteredReviews = reviews.filter(
    review => statusFilter === 'all' || review.status === statusFilter
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Atsiliepimų Valdymas</h1>
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
        >
          <option value="all">Visi atsiliepimai</option>
          <option value="pending">Laukiantys</option>
          <option value="approved">Patvirtinti</option>
          <option value="rejected">Atmesti</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Klientas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Įvertinimas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Atsiliepimas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statusas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Veiksmai
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{review.name}</div>
                  <div className="text-sm text-gray-500">{review.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{review.comment}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(review.status)}`}>
                    {getStatusText(review.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {review.createdAt.toLocaleDateString('lt-LT')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(review.id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Patvirtinti
                        </button>
                        <button
                          onClick={() => handleStatusChange(review.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Atmesti
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Ištrinti
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredReviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Nerasta atsiliepimų pagal pasirinktus filtrus
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 