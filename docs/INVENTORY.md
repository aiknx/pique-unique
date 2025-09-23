# Project Inventory

## Frameworks and Libraries
- **Next.js**: Version ^14.2.30
- **React**: Version ^18.2.0
- **TypeScript**: Enabled

## Firebase Integration
- **Authentication**: Firebase Auth with extensive usage across components and scripts.
- **Database**: Firestore for managing collections like `users`, `bookings`, and `themes`.
- **Storage**: Firebase Storage for file uploads and management.
- **Admin SDK**: Used for server-side administrative tasks.

## Key Files
- `src/lib/firebase/index.ts`: Initializes Firebase services.
- `src/lib/server/firebase-admin.ts`: Manages Firebase Admin SDK.
- `src/lib/auth.ts`: Handles authentication logic.
- `src/app/admin/gallery/page.tsx`: Implements Firebase Storage operations.

## Security Rules
- **Firestore**: Role-based access control (RBAC) implemented using `isAdmin` helper function.
- **Storage**: No `storage.rules` file found, indicating potential risk.

## Development and Testing
- Firebase emulators are configured for development and testing.

## Observations
- Firebase is deeply integrated into the project.
- Environment variables are used for configuration.
- Security rules are well-structured but lack `storage.rules`.
