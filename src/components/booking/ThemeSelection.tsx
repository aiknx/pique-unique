import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/schema';
import type { Theme } from '@/lib/firebase/schema';
import Image from 'next/image';

interface ThemeSelectionProps {
  onSelect: (theme: Theme) => void;
  selectedTheme?: string;
  guestCount: number;
}

export default function ThemeSelection({ onSelect, selectedTheme, guestCount }: ThemeSelectionProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allThemes, setAllThemes] = useState<Theme[]>([]);

  useEffect(() => {
    const fetchThemes = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.THEMES));
        const themeData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Theme));
        setAllThemes(themeData);
        
        // Filter themes based on guest count
        const filteredThemes = themeData.filter(theme => 
          theme.isAvailable && 
          theme.capacity.min <= guestCount && 
          theme.capacity.max >= guestCount
        );
        
        setThemes(filteredThemes);
        
        // If previously selected theme is no longer valid, clear it
        if (selectedTheme && !filteredThemes.find(t => t.id === selectedTheme)) {
          onSelect(null as unknown as Theme);
        }
      } catch (err) {
        console.error('Error fetching themes:', err);
        setError('Nepavyko gauti temų sąrašo');
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, [guestCount, onSelect, selectedTheme]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  // Show message if no themes available for current guest count
  if (themes.length === 0 && allThemes.length > 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Pasirinkite pikniko temą</h3>
        <div className="text-center py-8 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800">
            Atsiprašome, šiuo metu nėra temų, tinkančių {guestCount} svečių grupei.
          </p>
          <p className="text-sm text-yellow-600 mt-2">
            Galimos grupių apimtys:
            {allThemes.map((theme, index) => (
              <span key={theme.id}>
                {index > 0 && ', '}
                {theme.capacity.min}-{theme.capacity.max} asm.
              </span>
            ))}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Pasirinkite pikniko temą</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => onSelect(theme)}
            className={`
              relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer
              ${selectedTheme === theme.id 
                ? 'border-hunter ring-2 ring-hunter' 
                : 'border-transparent hover:border-gray-200'
              }
            `}
          >
            {/* Theme Image */}
            <div className="relative h-48 w-full">
              <Image
                src={theme.images[0]}
                alt={theme.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Theme Info */}
            <div className="p-4 bg-white">
              <h4 className="text-lg font-medium mb-2">{theme.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
              
              {/* Features */}
              <div className="space-y-2">
                {theme.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-hunter mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-semibold">{theme.price} €</span>
                <span className="text-sm text-gray-500">
                  {theme.capacity.min}-{theme.capacity.max} asm.
                </span>
              </div>
            </div>

            {/* Selected Indicator */}
            {selectedTheme === theme.id && (
              <div className="absolute top-2 right-2 bg-hunter text-white rounded-full p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 