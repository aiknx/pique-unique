// Firebase collection names
export const COLLECTIONS = {
  USERS: 'users',
  THEMES: 'themes',
  BOOKINGS: 'bookings',
  ADD_ONS: 'addOns',
  REVIEWS: 'reviews',
} as const;

// Schema types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  capacity: {
    min: number;
    max: number;
  };
  features: string[];
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  themeId: string;
  date: Date;
  guests: number;
  addOns: string[];
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

export interface Review {
  id: string;
  userId: string;
  bookingId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  isPublic: boolean;
}

// Firestore rules
export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Themes
    match /themes/{themeId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true
      );
    }
    
    // Add-ons
    match /addOns/{addOnId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Reviews
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null && exists(/databases/$(database)/documents/bookings/$(request.resource.data.bookingId));
      allow update, delete: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true
      );
    }
  }
}
`; 