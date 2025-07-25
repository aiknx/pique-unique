'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';

interface Theme {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminThemesPage() {
  const { user } = useAuth();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const fetchThemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const idToken = await user?.getIdToken();
      if (!idToken) {
        setError('Nėra autentifikacijos');
        return;
      }

      const response = await fetch('/api/admin/themes', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setThemes(data.themes || []);
      } else {
        setError('Klaida gaunant temas');
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      setError('Klaida gaunant temas');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchThemes();
    }
  }, [user, fetchThemes]);

  const handleEditTheme = (theme: Theme) => {
    setEditingTheme(theme);
    setIsAddingNew(false);
  };

  const handleAddNewTheme = () => {
    setEditingTheme(null);
    setIsAddingNew(true);
  };

  const handleSaveTheme = async (themeData: Partial<Theme>) => {
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) {
        setError('Nėra autentifikacijos');
        return;
      }

      if (isAddingNew) {
        const response = await fetch('/api/admin/themes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify(themeData)
        });

        if (!response.ok) {
          throw new Error('Failed to create theme');
        }
      } else if (editingTheme) {
        const response = await fetch(`/api/admin/themes/${editingTheme.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify(themeData)
        });

        if (!response.ok) {
          throw new Error('Failed to update theme');
        }
      }
      
      await fetchThemes();
      setEditingTheme(null);
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error saving theme:', error);
      setError('Klaida išsaugant temą');
    }
  };

  const handleDeleteTheme = async (themeId: string) => {
    if (!confirm('Ar tikrai norite ištrinti šią temą?')) {
      return;
    }

    try {
      const idToken = await user?.getIdToken();
      if (!idToken) {
        setError('Nėra autentifikacijos');
        return;
      }

      const response = await fetch(`/api/admin/themes/${themeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete theme');
      }

      await fetchThemes();
    } catch (error) {
      console.error('Error deleting theme:', error);
      setError('Klaida ištrinant temą');
    }
  };

  const handleToggleActive = async (theme: Theme) => {
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) {
        setError('Nėra autentifikacijos');
        return;
      }

      const response = await fetch(`/api/admin/themes/${theme.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          ...theme,
          isActive: !theme.isActive
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update theme');
      }

      await fetchThemes();
    } catch (error) {
      console.error('Error toggling theme status:', error);
      setError('Klaida keičiant temos statusą');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Kraunama...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Klaida</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-hunter-green">Temų Valdymas</h1>
          <button
            onClick={handleAddNewTheme}
            className="bg-hunter-green text-white px-6 py-3 rounded-lg hover:bg-hunter-dark transition-colors"
          >
            Pridėti Naują Temą
          </button>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div key={theme.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {theme.imageUrl && (
                <div className="relative h-48">
                  <Image
                    src={theme.imageUrl}
                    alt={theme.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{theme.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    theme.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {theme.isActive ? 'Aktyvi' : 'Neaktyvi'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{theme.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-hunter-green">€{theme.price}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(theme.updatedAt).toLocaleDateString('lt-LT')}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditTheme(theme)}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Redaguoti
                  </button>
                  <button
                    onClick={() => handleToggleActive(theme)}
                    className={`flex-1 px-4 py-2 rounded transition-colors ${
                      theme.isActive
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {theme.isActive ? 'Deaktyvuoti' : 'Aktyvuoti'}
                  </button>
                  <button
                    onClick={() => handleDeleteTheme(theme.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Ištrinti
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {themes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nėra temų</h3>
            <p className="text-gray-500">Pridėkite pirmąją temą, kad pradėtumėte</p>
          </div>
        )}

        {/* Edit/Add Modal would go here */}
        {(editingTheme || isAddingNew) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">
                {isAddingNew ? 'Pridėti Naują Temą' : 'Redaguoti Temą'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSaveTheme({
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  price: parseFloat(formData.get('price') as string),
                  imageUrl: formData.get('imageUrl') as string,
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pavadinimas
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingTheme?.name || ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hunter-green"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aprašymas
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingTheme?.description || ''}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hunter-green"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kaina (€)
                    </label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      defaultValue={editingTheme?.price || ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hunter-green"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paveikslėlio URL
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      defaultValue={editingTheme?.imageUrl || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hunter-green"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTheme(null);
                      setIsAddingNew(false);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Atšaukti
                  </button>
                  <button
                    type="submit"
                    className="bg-hunter-green text-white px-6 py-2 rounded hover:bg-hunter-dark transition-colors"
                  >
                    Išsaugoti
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 