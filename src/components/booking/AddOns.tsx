'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCachedCollection } from '@/lib/firebase/cache';
import { COLLECTIONS } from '@/lib/firebase/schema';
import type { AddOn } from '@/lib/firebase/schema';

interface AddOnsProps {
  onSelect?: (addOns: string[]) => void;
}

export default function AddOns({ onSelect }: AddOnsProps) {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const addOnsData = await getCachedCollection<AddOn>(COLLECTIONS.ADD_ONS);
        setAddOns(addOnsData.filter(addon => addon.isAvailable));
      } catch (error) {
        console.error('Error fetching add-ons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddOns();
  }, []);

  const handleToggleAddOn = (addOnId: string) => {
    const newSelected = selectedAddOns.includes(addOnId)
      ? selectedAddOns.filter(id => id !== addOnId)
      : [...selectedAddOns, addOnId];
    
    setSelectedAddOns(newSelected);
    if (onSelect) {
      onSelect(newSelected);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Enhance Your Experience</h2>
      <div className="grid grid-cols-1 gap-4">
        {addOns.map((addOn) => (
          <div
            key={addOn.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedAddOns.includes(addOn.id)
                ? 'border-primary bg-primary/5'
                : 'hover:border-gray-400'
            }`}
            onClick={() => handleToggleAddOn(addOn.id)}
          >
            <div className="flex items-start space-x-4">
              <div className="relative w-20 h-20">
                <Image
                  src={addOn.image}
                  alt={addOn.name}
                  fill
                  className="object-cover rounded"
                  sizes="80px"
                />
              </div>
              <div>
                <h3 className="font-medium">{addOn.name}</h3>
                <p className="text-sm text-gray-600">{addOn.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-medium">
                    ${addOn.price.toFixed(2)}
                  </p>
                  {addOn.category && (
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {addOn.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 