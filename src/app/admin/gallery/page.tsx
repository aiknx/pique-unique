'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageData, setImageData] = useState({
    title: '',
    description: '',
    category: 'piknikai'
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user]);

  const fetchImages = async () => {
    try {
      setLoadingImages(true);
      const imagesRef = collection(db, 'gallery');
      const snapshot = await getDocs(imagesRef);
      const imagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[];
      
      setImages(imagesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !imageData.title) return;

    try {
      setUploading(true);
      
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `gallery/${Date.now()}_${selectedFile.name}`);
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save image data to Firestore
      const imageDoc = {
        url: downloadURL,
        title: imageData.title,
        description: imageData.description,
        category: imageData.category,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'gallery'), imageDoc);

      // Reset form
      setSelectedFile(null);
      setImageData({
        title: '',
        description: '',
        category: 'piknikai'
      });

      // Refresh images
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string, imageUrl: string) => {
    if (!confirm('Ar tikrai norite ištrinti šį paveikslėlį?')) return;

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'gallery', imageId));

      // Delete from Storage
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);

      // Refresh images
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter mx-auto"></div>
          <p className="mt-4 text-gray-600">Kraunama...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Galerijos valdymas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Pridėkite ir valdykite nuotraukas galerijoje
            </p>
          </div>

          {/* Upload Form */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Pridėti naują nuotrauką</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pasirinkite nuotrauką
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hunter file:text-white hover:file:bg-hunter-dark"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategorija
                  </label>
                  <select
                    value={imageData.category}
                    onChange={(e) => setImageData(prev => ({ ...prev, category: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
                  >
                    <option value="piknikai">Piknikai</option>
                    <option value="dekoracijos">Dekoracijos</option>
                    <option value="maistas">Maistas</option>
                    <option value="vietos">Vietos</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pavadinimas *
                </label>
                <input
                  type="text"
                  value={imageData.title}
                  onChange={(e) => setImageData(prev => ({ ...prev, title: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aprašymas
                </label>
                <textarea
                  value={imageData.description}
                  onChange={(e) => setImageData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
                />
              </div>
              
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="bg-hunter text-white px-4 py-2 rounded-md hover:bg-hunter-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Kraunama...' : 'Pridėti nuotrauką'}
              </button>
            </form>
          </div>

          {/* Images Grid */}
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Nuotraukos ({images.length})</h2>
            
            {loadingImages ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hunter mx-auto"></div>
                <p className="mt-2 text-gray-600">Kraunamos nuotraukos...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nėra nuotraukų</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div key={image.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="aspect-w-16 aspect-h-9">
                      <Image
                        src={image.url}
                        alt={image.title}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{image.title}</h3>
                      {image.description && (
                        <p className="text-sm text-gray-600 mb-2">{image.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {image.category}
                        </span>
                        <button
                          onClick={() => handleDelete(image.id, image.url)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Ištrinti
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 