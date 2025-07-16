# Pique Unique - Project Context

## Current State & Priorities (2024-03-21)

### Environment Configuration
- `.env.local` file exists and is properly configured
- Environment structure mirrors `env.example` file
- Contains all necessary Firebase and API configurations
- File is not directly accessible for security reasons
- Changes to environment variables require manual updates to `.env.local`

### Firebase Setup & Development
- Emulators:
  - Auth: 127.0.0.1:9099
  - Firestore: 127.0.0.1:8080
  - UI: http://127.0.0.1:4000
  - Hub: 127.0.0.1:4400
- Development Flow:
  1. Start emulators: `firebase emulators:start`
  2. Run development server: `npm run dev`
  3. Access emulator UI at http://127.0.0.1:4000

### Development Guidelines
1. Always ensure Firebase emulators are running
2. Check emulator UI for debugging
3. Use mobile-first approach
4. Follow Lithuanian language first policy [[memory:1442848]]
5. Focus on core functionality before aesthetics
6. Document important decisions
7. Test thoroughly before deployment

### Technical Stack
- Framework: Next.js 14
- Language: TypeScript
- Styling: Tailwind CSS
- Backend: Firebase
- Deployment: Vercel

### Layout System
- Use `.container-custom` for main containers
- Center with `mx-auto`
- Padding system:
  - Mobile: `px-4`
  - Tablet: `sm:px-6`
  - Desktop: `lg:px-8`

### Color System
- `hunter-green` (#466D4B) - Primary green
- `cambridge-blue` (#779E7B) - Light green
- `blush` (#CB7286) - Pink
- `linen` (#EFE4DB) - Light background
- `white-smoke` (#F4F4F4) - Alt background
- `verdigris` (#3CA6A6) - Accent blue
- `cherry-blossom` (#E9A6B3) - Light pink

### Current Development Focus
1. Admin Authentication & Management [[memory:1442849]]
   - Fix admin panel signin issues
   - Complete admin dashboard
   - Implement booking management

2. Core Features Implementation [[memory:1442843]]
   - Complete booking system
   - Admin panel functionality
   - Photo gallery (awaiting sister's photoshoot) [[memory:1442846]]

### Known Issues & Solutions
- Admin panel auth redirect loop:
  - Check Firebase auth state persistence
  - Verify middleware functionality
- Firebase emulator connection:
  - Always start emulators before development
  - Check emulator UI for debugging
- Loading states and performance:
  - Implemented consistent loading components
  - Added proper error boundaries

### Important Notes
- Working directory is always `/home/techlift/pique-unique` [[memory:1442844]]
- Development process needs structure [[memory:1442845]]
- Website primarily in Lithuanian [[memory:1442848]]
- Professional photos pending [[memory:1442846]] 