# Cyber War Game Simulation

## Overview

A cybersecurity training simulation platform that provides immersive, real-time breach response scenarios. The application enables teams to practice incident response through role-based gameplay, featuring AI-powered threat scenarios, multi-room chat systems, and comprehensive debrief analytics. The platform showcases Microsoft security solutions while training cybersecurity professionals in realistic attack scenarios.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack React Query for server state management
- **Routing**: wouter for lightweight client-side routing
- **Theme System**: Cyberpunk/hacker aesthetic with dark mode primary color palette (neon green accents, terminal-style fonts)

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful endpoints with `/api` prefix
- **Data Layer**: Drizzle ORM for type-safe database operations
- **Storage Interface**: Abstracted storage layer supporting both memory and PostgreSQL backends

### Database Schema
- **Game Sessions**: Manages simulation lifecycle (waiting, active, debrief, completed)
- **Players**: Role-based assignments with personas (CISO, SOC_LEAD, SOC_ANALYST, IT_HEAD, PR_HEAD, CEO, LEGAL_HEAD)
- **Timeline Events**: Scheduled simulation events with severity levels and targeting
- **Player Decisions**: Captures participant choices during scenarios
- **Chat Messages**: Multi-room communication system with role-based messaging

### Authentication & Authorization
- Session-based approach with persona-specific room access
- Role-based content filtering and event targeting
- Administrative controls for game session management

### Game Engine Design
- **Phase Management**: Setup → Simulation → Debrief workflow
- **Event Scheduling**: Time-based event triggers with persona targeting
- **Decision Tracking**: Real-time capture of player responses with scoring
- **Communication System**: Multi-room chat with role-based channels

### UI/UX Design System
- **Design Language**: Terminal/hacker aesthetic inspired by cyberpunk media
- **Typography**: JetBrains Mono and Fira Code for monospace feel
- **Color Palette**: Dark backgrounds with neon green highlights
- **Component Architecture**: Modular design with reusable game components

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: Neon database connectivity for PostgreSQL
- **drizzle-orm**: Type-safe ORM with schema validation
- **@tanstack/react-query**: Server state management and caching
- **express**: Web application framework

### UI Framework
- **@radix-ui/***: Accessible UI primitives (accordion, dialog, popover, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library for consistent iconography

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production builds
- **drizzle-kit**: Database schema management and migrations

### Form & Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation (via drizzle-zod)

### Enhanced Features
- **date-fns**: Date manipulation utilities
- **embla-carousel-react**: Carousel component functionality
- **cmdk**: Command palette interface
- **vaul**: Drawer component implementation