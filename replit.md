# Community Food Share - Donation Impact Visualization Platform

## Overview

This application is a React-based platform that creates personalized impact visualizations for donors and volunteers of Community Food Share. The system calculates and displays donation/volunteer impacts in an engaging, Spotify Wrapped-style interface that shows exactly how contributions translate into meals provided, people served, and environmental benefits.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool and development server
- **Tailwind CSS** with custom theming for Community Food Share branding
- **Radix UI** components for accessible UI primitives
- **Framer Motion** for smooth animations and transitions
- **Wouter** for client-side routing
- **React Hook Form** with Zod validation for form handling
- **TanStack Query** for server state management

### Backend Architecture
- **Express.js** server with TypeScript
- **Drizzle ORM** for database operations
- **Neon Database** (PostgreSQL) for data persistence
- **Multer** for file upload handling (Excel/CSV imports)
- **XLSX library** for spreadsheet processing

### Database Design
The system uses PostgreSQL with the following core tables:
- **users**: Authentication and admin users
- **donors**: Donor contact information and metadata
- **donations**: Individual donation records with amounts and timestamps
- **volunteers**: Volunteer contact information
- **volunteer_shifts**: Volunteer hours and shift records

## Key Components

### Impact Calculation Engine
- Converts donation amounts into tangible impact metrics using almanac data
- Calculates meals provided, people served, food rescued, environmental benefits
- Generates creative weight comparisons for food rescued amounts
- Uses real organizational data for accurate conversions

### Slideshow Interface
- Multi-slide presentation system similar to Spotify Wrapped
- Smooth transitions between impact metrics
- Animated counters and visual progress indicators
- Mobile-optimized touch navigation
- Customizable slide ordering and content

### Data Import System
- Excel/CSV file processing for bulk donor data imports
- Flexible column mapping for various data formats
- Donor deduplication and update handling
- Support for donation history imports

### URL Parameter Handling
- Secure donor data passing via encrypted URL parameters
- Fallback to email-based lookups
- Support for both anonymous and personalized experiences

## Data Flow

1. **Data Import**: Donor and donation data imported via Excel/CSV uploads
2. **Impact Request**: User provides donation amount or is identified via URL parameters
3. **Calculation**: Server calculates impact metrics using almanac conversion rates
4. **Presentation**: Frontend displays results through animated slideshow interface
5. **Sharing**: Generated impact summaries can be shared or downloaded

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Database connectivity
- **drizzle-orm**: Database ORM and query builder
- **framer-motion**: Animation library
- **react-hook-form**: Form state management
- **@tanstack/react-query**: Server state management
- **xlsx**: Excel file processing

### UI Components
- **@radix-ui/**: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **eslint**: Code linting

## Deployment Strategy

The application is designed for deployment on platforms like Replit with:
- Environment variable configuration for database connections
- Automatic database schema setup on startup
- File upload handling for data imports
- Keep-alive mechanisms to prevent server timeouts
- Production build optimization with Vite

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `VITE_ENCRYPTION_KEY`: For secure URL parameter encryption (optional)

### Database Setup
The system automatically creates required tables on startup and includes migration support through Drizzle Kit for schema changes.