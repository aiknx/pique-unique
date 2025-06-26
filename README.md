# Pique Unique

A Next.js booking system application with Firebase backend.

## Project Overview

This project is a booking system built with Next.js and Firebase, designed to provide a seamless booking experience for service-based businesses. It includes features such as user authentication, service management, booking management, and review system.

## Project Structure

The project follows a structured implementation plan divided into phases:

1. **Firebase Foundation**: Setting up Firebase, implementing authentication, and creating base data models.
2. **Core Booking Functionality**: Implementing calendar integration, booking system, and service management.
3. **User Experience & Reviews**: Creating user dashboard, review system, and UI refinements.
4. **Admin & Analytics**: Building admin dashboard, analytics integration, and optimization.
5. **Testing & Deployment**: Implementing testing, deployment pipeline, and documentation.

## Documentation

- **PROJECT_ARCHITECTURE.md**: Technical architecture, data models, and development standards.
- **IMPLEMENTATION_PLAN.md**: Detailed implementation plan with phases and tasks.
- **SONNET_INSTRUCTIONS.md**: Instructions for Sonnet AI for implementation.
- **TASK_TRACKING.md**: Progress tracking for implementation tasks.
- **DIAGRAMS.md**: Visual representations of the project structure and data models.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pique-unique
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Working with Sonnet AI

This project is being implemented with the assistance of Sonnet AI. The implementation follows a structured approach:

1. **Understanding Requirements**: Sonnet AI works from the project architecture and implementation plan.
2. **Methodical Implementation**: Features are implemented in phases, following the defined plan.
3. **Quality Standards**: All code follows the quality standards defined in the implementation plan.
4. **Progress Tracking**: Implementation progress is tracked in TASK_TRACKING.md.

## License

[MIT](LICENSE)
