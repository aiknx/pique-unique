'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCachedCollection } from '@/lib/firebase/cache';
import { COLLECTIONS } from '@/lib/firebase/schema';
import type { Theme } from '@/lib/firebase/schema';

interface ThemeSelectorProps {
  onSelect?: (themeId: string) => void;
}

export default function ThemeSelector({ onSelect }: ThemeSelectorProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const themesData = await getCachedCollection<Theme>(COLLECTIONS.THEMES);
        setThemes(themesData);
      } catch (error) {
        console.error('Error fetching themes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    if (onSelect) {
      onSelect(themeId);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Choose Your Theme</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themes.map((theme, index) => (
          <div
            key={theme.id}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedTheme === theme.id
                ? 'ring-2 ring-primary'
                : 'hover:shadow-lg'
            }`}
            onClick={() => handleSelectTheme(theme.id)}
          >
            <div className="relative h-48">
              <Image
                src={theme.images[0]}
                alt={theme.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={index < 2}
              />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-medium">{theme.name}</h3>
              <p className="text-gray-600">{theme.description}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-semibold">
                  ${theme.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {theme.capacity.min}-{theme.capacity.max} guests
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 