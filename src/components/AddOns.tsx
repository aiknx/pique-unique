import { useState } from 'react'

type AddOn = {
  id: string
  name: string
  description: string
  price: number
  image?: string
}

const SAMPLE_ADDONS: AddOn[] = [
  {
    id: '1',
    name: 'Champagne Service',
    description: 'Premium champagne served in elegant flutes',
    price: 75,
    image: '/images/champagne.jpg'
  },
  {
    id: '2',
    name: 'Flower Bouquet',
    description: 'Fresh seasonal flowers arranged beautifully',
    price: 45,
    image: '/images/flowers.jpg'
  },
  {
    id: '3',
    name: 'Charcuterie Board',
    description: 'Selection of premium meats, cheeses, and accompaniments',
    price: 65,
    image: '/images/charcuterie.jpg'
  },
  {
    id: '4',
    name: 'Live Music',
    description: 'Acoustic guitarist for 1 hour',
    price: 150,
    image: '/images/music.jpg'
  }
]

export default function AddOns() {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const totalPrice = SAMPLE_ADDONS
    .filter(addon => selectedAddOns.includes(addon.id))
    .reduce((sum, addon) => sum + addon.price, 0)

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-heading font-bold text-primary-600 mb-6">
          Enhance Your Experience
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_ADDONS.map(addon => (
            <div
              key={addon.id}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all
                ${selectedAddOns.includes(addon.id)
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 hover:border-primary-300'
                }
              `}
              onClick={() => toggleAddOn(addon.id)}
            >
              <div className="flex items-start gap-4">
                {addon.image && (
                  <div className="w-20 h-20 rounded-lg bg-neutral-100">
                    {/* Image placeholder */}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900">{addon.name}</h3>
                  <p className="text-sm text-neutral-600">{addon.description}</p>
                  <p className="mt-1 font-medium text-primary-600">
                    ${addon.price}
                  </p>
                </div>
                <div className="flex items-center justify-center w-6 h-6 border rounded-full">
                  {selectedAddOns.includes(addon.id) && (
                    <div className="w-3 h-3 bg-primary-600 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedAddOns.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-neutral-900">
                Total Add-ons
              </span>
              <span className="text-lg font-bold text-primary-600">
                ${totalPrice}
              </span>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button type="submit" className="btn w-full">
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  )
} 