'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/schema';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  createdAt: Date;
}

export default function GalleryManagementPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Visos nuotraukos' },
    { id: 'beach', name: 'Paplūdimys' },
    { id: 'picnic', name: 'Piknikai' },
    { id: 'decoration', name: 'Dekoracijos' },
    { id: 'food', name: 'Maistas' },
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const imagesQuery = query(
        collection(db, COLLECTIONS.GALLERY),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(imagesQuery);
      const imagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as GalleryImage[];
      setImages(imagesData);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Klaida gaunant nuotraukų sąrašą');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    try {
      setUploading(true);
      const file = e.target.files[0];
      const imageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      
      // Upload image to Firebase Storage
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);

      // Add image metadata to Firestore
      await addDoc(collection(db, COLLECTIONS.GALLERY), {
        url: imageUrl,
        title: '',
        description: '',
        category: selectedCategory === 'all' ? 'picnic' : selectedCategory,
        createdAt: new Date()
      });

      // Refresh images list
      await fetchImages();
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Klaida įkeliant nuotrauką');
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (image: GalleryImage) => {
    if (!confirm('Ar tikrai norite ištrinti šią nuotrauką?')) return;

    try {
      // Delete from Storage
      const imageRef = ref(storage, image.url);
      await deleteObject(imageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, COLLECTIONS.GALLERY, image.id));

      // Update local state
      setImages(prev => prev.filter(img => img.id !== image.id));
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Klaida trinant nuotrauką');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hunter"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Galerijos Valdymas</h1>
        <div className="flex gap-4">
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label className="btn-primary cursor-pointer">
            {uploading ? 'Įkeliama...' : 'Įkelti nuotrauką'}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images
          .filter(img => selectedCategory === 'all' || img.category === selectedCategory)
          .map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow overflow-hidden group relative"
            >
              <img
                src={image.url}
                alt={image.title || 'Gallery image'}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Pavadinimas"
                  className="w-full mb-2 px-2 py-1 border rounded"
                  value={image.title}
                  onChange={(e) => {
                    const newImages = images.map(img =>
                      img.id === image.id ? { ...img, title: e.target.value } : img
                    );
                    setImages(newImages);
                  }}
                />
                <textarea
                  placeholder="Aprašymas"
                  className="w-full px-2 py-1 border rounded"
                  value={image.description}
                  onChange={(e) => {
                    const newImages = images.map(img =>
                      img.id === image.id ? { ...img, description: e.target.value } : img
                    );
                    setImages(newImages);
                  }}
                />
                <div className="mt-2">
                  <select
                    className="w-full px-2 py-1 border rounded"
                    value={image.category}
                    onChange={(e) => {
                      const newImages = images.map(img =>
                        img.id === image.id ? { ...img, category: e.target.value } : img
                      );
                      setImages(newImages);
                    }}
                  >
                    {categories
                      .filter(cat => cat.id !== 'all')
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => handleImageDelete(image)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
} 