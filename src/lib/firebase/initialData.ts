import { Theme } from './schema';

export const initialThemes: Omit<Theme, 'id'>[] = [
  {
    name: 'Romantiškas piknikas',
    description: 'Tobulas pasirinkimas poroms, norinčioms praleisti ypatingą laiką dviese.',
    price: 99,
    images: [
      'https://images.unsplash.com/photo-1526401485004-46910ecc8e51',
      'https://images.unsplash.com/photo-1602634010758-ff59e36a1c0b'
    ],
    capacity: {
      min: 2,
      max: 2
    },
    features: [
      'Dekoruotas stalas dviem',
      'Romantiška atmosfera',
      'Žvakės ir gėlės',
      'Minkšti pledai',
      'Pagalvėlės'
    ],
    isAvailable: true
  },
  {
    name: 'Šeimos piknikas',
    description: 'Jaukus ir linksmas piknikas visai šeimai su žaidimais ir pramogomis.',
    price: 149,
    images: [
      'https://images.unsplash.com/photo-1526279037267-c71fc1966b54',
      'https://images.unsplash.com/photo-1591543620767-582b2e76369e'
    ],
    capacity: {
      min: 3,
      max: 6
    },
    features: [
      'Erdvus stalas šeimai',
      'Žaidimai vaikams',
      'Patogūs sėdmaišiai',
      'Pledai ir pagalvėlės',
      'Vaikiškas meniu'
    ],
    isAvailable: true
  },
  {
    name: 'Prabangus piknikas',
    description: 'Aukščiausios klasės piknikas su išskirtiniu aptarnavimu ir premium patiekalais.',
    price: 199,
    images: [
      'https://images.unsplash.com/photo-1559329007-40df8a9345d8',
      'https://images.unsplash.com/photo-1590779033100-9f60a05a013d'
    ],
    capacity: {
      min: 2,
      max: 8
    },
    features: [
      'Premium klasės indai',
      'Šampanas',
      'Išskirtinės dekoracijos',
      'Asmeninis padavėjas',
      'Gourmet užkandžiai'
    ],
    isAvailable: true
  }
]; 