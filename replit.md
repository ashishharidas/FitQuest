# FitQuest RPG - Fitness Gamification Application

## Overview

FitQuest RPG is a modern fitness gamification web application that transforms real-world workouts into an immersive gaming experience. The app features a character progression system where users' fitness data powers their virtual character's advancement through fantasy adventures. Users can battle villains, complete quests, level up, and earn cryptocurrency rewards based on their fitness achievements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for smooth micro-interactions and transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with Express routes
- **Storage**: PostgreSQL database with Drizzle ORM for persistent data storage

### Design System
- **Theme**: Dark cyberpunk/sci-fi aesthetic with neon accents
- **Colors**: Electric blue (#3B82F6), purple (#8B5CF6), gold (#F59E0B)
- **Effects**: Glassmorphism with frosted glass panels and holographic elements
- **Layout**: Mobile-first responsive design with card-based UI

## Key Components

### Character System
- Progressive character evolution through 4 stages: Novice → Warrior → Champion → Legend
- Real-time character model that changes based on fitness progress
- Four core stats: Strength, Stamina, Agility, Health (linked to workout data)
- Equipment/gear system unlocked through achievements
- Visual character animations for level-ups and victories

### Fitness Integration
- Simulated smartwatch integration (Apple Watch, Fitbit)
- Real-time tracking of steps, calories, heart rate, active minutes
- Activity type detection and workout categorization
- Daily and weekly fitness data visualization with animated progress indicators

### Quest & Reward System
- Dynamic quest generation with three types: daily, weekly, and boss battles
- Quest completion tied to real fitness metrics
- XP rewards for character progression
- Cryptocurrency (ETH) rewards for achievements
- Quest expiration and claiming mechanics

### Wallet Integration
- MetaMask wallet connection simulation
- ETH balance display and transaction history
- Reward claiming interface with blockchain transaction simulation
- Wallet address formatting and validation utilities

### Battle Arena
- Interactive orb-matching battle system
- Turn-based combat with health tracking
- Strategic gameplay combining fitness achievements with battle mechanics

### Social Features
- Global leaderboard with XP, level, and ETH rankings
- User profiles with achievement galleries
- Competitive elements to encourage continued engagement

## Data Flow

1. **Fitness Data Collection**: Simulated smartwatch APIs provide real-time fitness metrics
2. **Character Progression**: Fitness achievements automatically update character stats and XP
3. **Quest Management**: System generates and tracks quest progress based on fitness data
4. **Reward Distribution**: Completed quests trigger XP and ETH reward calculations
5. **Leaderboard Updates**: Character progression updates global rankings
6. **Wallet Integration**: Rewards are reflected in user's connected wallet balance

## External Dependencies

### UI and Styling
- Radix UI for accessible component primitives
- Tailwind CSS for utility-first styling
- Framer Motion for animations
- Lucide React for consistent iconography

### State Management
- TanStack Query for server state caching and synchronization
- React Hook Form with Zod validation for form handling

### Database and ORM
- Drizzle ORM for type-safe database operations
- Drizzle Kit for database migrations
- Neon Database for serverless PostgreSQL hosting

### Development Tools
- TypeScript for type safety
- Vite for development server and building
- ESBuild for server bundling
- PostCSS with Autoprefixer for CSS processing

## Deployment Strategy

### Development
- Vite development server with HMR for frontend
- TSX for running TypeScript server with hot reloading
- Replit-specific plugins for development environment integration

### Production
- Frontend: Vite builds optimized static assets
- Backend: ESBuild bundles server code for Node.js deployment
- Database: Automated migrations using Drizzle Kit
- Environment: Production mode serves static files through Express

### Database Management
- Schema definitions in shared TypeScript files
- Type-safe database operations with Drizzle ORM
- Migration system for schema changes
- Connection pooling for production scaling

The application follows a monorepo structure with clear separation between client, server, and shared code. The architecture supports both development and production deployments while maintaining type safety throughout the stack. The design prioritizes user experience with smooth animations, responsive design, and gamification elements that encourage continued fitness engagement.