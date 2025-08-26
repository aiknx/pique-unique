# Pique Unique - Project Architecture

## Overview
Pique Unique is a Next.js application using Firebase as its backend infrastructure. This document outlines the technical architecture, development standards, and deployment processes.

## Tech Stack
- Frontend: Next.js 14 with TypeScript
- Styling: Tailwind CSS
- Backend: Firebase Services
  - Authentication: Firebase Auth
  - Database: Cloud Firestore
  - Storage: Firebase Storage
  - Hosting: Firebase Hosting
  - Analytics: Firebase Analytics
- Calendar: FullCalendar
- State Management: React Query + React Context

## Firebase Data Model

### Collections Structure

1. Users Collection
   ```typescript
   interface User {
     uid: string;
     email: string;
     displayName: string;
     photoURL?: string;
     preferences: {
       notifications: boolean;
       theme: 'light' | 'dark';
     };
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }
   ```

2. Bookings Collection
   ```typescript
   interface Booking {
     id: string;
     userId: string;
     serviceId: string;
     date: Timestamp;
     status: 'pending' | 'confirmed' | 'cancelled';
     totalPrice: number;
     notes?: string;
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }
   ```

3. Services Collection
   ```typescript
   interface Service {
     id: string;
     name: string;
     description: string;
     price: number;
     duration: number; // in minutes
     available: boolean;
     imageUrl?: string;
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }
   ```

4. Reviews Collection
   ```typescript
   interface Review {
     id: string;
     userId: string;
     bookingId: string;
     rating: number;
     comment: string;
     createdAt: Timestamp;
     updatedAt: Timestamp;
   }
   ```

## Security Rules

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    
    // Services
    match /services/{serviceId} {
      allow read: if true;
      allow write: if false; // Admin only via Firebase Admin SDK
    }
    
    // Reviews
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null 
        && exists(/databases/$(database)/documents/bookings/$(request.resource.data.bookingId))
        && get(/databases/$(database)/documents/bookings/$(request.resource.data.bookingId)).data.userId == request.auth.uid;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## Component Architecture

### Core Components
1. Authentication
   - SignIn
   - SignUp
   - AuthGuard
   - UserProfile

2. Booking System
   - Calendar
   - BookingForm (kreipiasi į `/api/bookings` su auth; nebe rašo tiesiai į Firestore)
   - ServiceSelector
   - TimeSlotPicker

3. Reviews
   - ReviewList
   - ReviewForm
   - RatingStars

4. Admin Dashboard
   - ServiceManager
   - BookingManager
   - UserManager
   - Analytics

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Firebase emulator for auth and Firestore operations
- Mock implementations for Firebase services

### Integration Tests
- End-to-end flows using Cypress
- Firebase emulator suite for full backend testing
- API route testing

### Security Testing
- Firestore rules testing using firebase-rules-testing
- Authentication flow testing
- Rate limiting verification

## Deployment Process

### Development
1. Local setup with Firebase emulators
2. Environment configuration
3. Local testing workflow

### Staging / Production (Vercel)
1. Deploy per GitHub push į `main`
2. `NEXT_PUBLIC_*` ir `FIREBASE_ADMIN_*` kintamieji Vercel aplinkoje
3. (Pasirinktinai) `RESEND_API_KEY` + domeno verifikacija el. laiškams

### Production
1. GitHub Actions CI/CD pipeline
2. Firebase Hosting deployment
3. Database backup strategy
4. Monitoring and alerting setup

## Performance Optimization

### Frontend
1. Image optimization
2. Code splitting
3. Progressive loading
4. Cache management

### Backend
1. Firestore indexing
2. Batch operations
3. Offline persistence
4. Real-time updates optimization

## Monitoring Strategy

1. Firebase Performance Monitoring
2. Error tracking with Firebase Crashlytics
3. User analytics with Firebase Analytics
4. Custom logging implementation

## Development Guidelines

### Code Style
- ESLint configuration
- Prettier setup
- TypeScript strict mode
- Component naming conventions
- File structure standards

### Git Workflow
1. Branch naming convention
2. Commit message format
3. PR template
4. Review process
5. Deployment checks

### Documentation
1. Component documentation
2. API documentation
3. Setup guides
4. Troubleshooting guides

## Current Endpoints (core)

- POST `/api/bookings`: sukuria rezervaciją (reikia auth; rašo `userId`/`userEmail`)
- GET `/api/user/bookings`: grąžina prisijungusio vartotojo rezervacijas
- PUT `/api/user/bookings/[id]`: atnaujina savo rezervacijos kontaktus/pageidavimus
- Admin GET `/api/admin/bookings`, `/api/admin/users` (reikia admin teisių)