'use client';

// import { useState } from 'react';
import Image from 'next/image';

interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  color: string;
}

const themes: Theme[] = [
  {
    id: 'undiniu',
    name: 'Undinių',
    description: 'Mėlynos spalvos tema su vandens elementais - puikiai tinka gimtadieniam ir mergvakariam',
    icon: '🧜‍♀️',
    price: 0,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  {
    id: 'feju',
    name: 'Fejų',
    description: 'Žalios spalvos tema su gamtos elementais - idealus gimtadieniam ir mergvakariam',
    icon: '🧚‍♀️',
    price: 0,
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'laumiu',
    name: 'Laumių',
    description: 'Violetinės spalvos tema su magiškais elementais - puikiai tinka gimtadieniam ir mergvakariam',
    icon: '👸',
    price: 0,
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  },
  {
    id: 'disco',
    name: 'Disco',
    description: 'Spalvota tema su šviesomis ir muzika - puikiai tinka gimtadieniam ir mergvakariam',
    icon: '🍸',
    price: 0,
    color: 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 hover:from-pink-100 hover:to-purple-100'
  }
];

interface ThemeSelectionProps {
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
}

interface ThemeIconProps {
  themeId: string;
  label: string;
  className?: string;
}

const ThemeIcon = ({ themeId, label, className = "w-8 h-8" }: ThemeIconProps) => {
  const iconMap = {
    'undiniu': '/icons/undine.png',
    'feju': '/icons/feja.png', 
    'laumiu': '/icons/laume.png',
    'disco': '/icons/disco.png'
  };

  const iconPath = iconMap[themeId as keyof typeof iconMap];
  
  if (!iconPath) {
    return <div className={`${className} bg-gray-200 rounded`}></div>;
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200`}>
      <Image
        src={iconPath}
        alt={`${label} tema`}
        fill
        className="object-contain p-0.5"
        sizes="(max-width: 768px) 48px, 64px"
      />
    </div>
  );
};

export default function ThemeSelection({ selectedTheme, onThemeSelect }: ThemeSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeSelect(theme.id)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all duration-200
              ${selectedTheme === theme.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : theme.color
              }
            `}
          >
            <div className="flex items-center space-x-4">
              <ThemeIcon themeId={theme.id} label={theme.name} className="w-24 h-24" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{theme.name}</h3>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Selected theme display removed */}
    </div>
  );
} 