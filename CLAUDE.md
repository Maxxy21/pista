# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm start` - Run production build
- `npm run lint` - Run ESLint

**Testing:**
- `npm test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

**Setup:**
```bash
npm install
cp .env.example .env.local  # Add your API keys
npm run dev
```

## Architecture

**Pista** is a startup pitch evaluation system built with Next.js 15, TypeScript, and Convex for real-time backend.

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 18, TypeScript, Tailwind CSS
- **Backend**: Convex for database and real-time operations
- **Authentication**: Clerk
- **AI Services**: OpenAI for pitch analysis and audio transcription
- **Testing**: Vitest with Testing Library

### Project Structure
```
src/
├── app/           # Next.js App Router pages and API routes
│   ├── (auth)/    # Authentication pages
│   ├── (dashboard)/ # Dashboard and pitch management
│   └── (pitch)/   # Pitch creation and evaluation
├── components/    # Reusable UI components (shadcn/ui based)
├── lib/           # Core business logic and utilities
│   ├── eval/      # Pitch evaluation parsing logic
│   ├── types/     # TypeScript type definitions
│   └── validation/ # Zod validation schemas
├── hooks/         # Custom React hooks
├── providers/     # Context providers (auth, theme)
└── store/         # Zustand state management

convex/           # Convex backend
├── schema.ts     # Database schema definitions
├── pitches.ts    # Pitch CRUD operations and queries
└── auth.config.ts # Authentication configuration
```

### Database Schema (Convex)
- **pitches**: Main pitch documents with evaluation data, supports both legacy and structured evaluation formats
- **userFavorites**: User-specific pitch favorites with org/workspace support

### Key Features
- **Pitch Input**: Text, file upload, or audio transcription
- **Evaluation System**: 4-criteria scoring (Problem-Solution Fit, Business Model & Market, Team & Execution, Pitch Quality)
- **Dashboard**: Search, filtering, favorites, export functionality
- **Multi-format Support**: Legacy and structured evaluation data

### Environment Variables
Required in `.env.local`:
- `CONVEX_DEPLOYMENT` - Convex deployment URL
- `NEXT_PUBLIC_CONVEX_URL` - Public Convex URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `OPENAI_API_KEY` - OpenAI API key
- Optional: `ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`

### Evaluation Logic
- Located in `src/lib/eval/parse.ts`
- Supports both JSON and text-based evaluation responses
- Structured scoring with aspect-based breakdown
- Score clamping (1-10 range) and validation

### Path Aliases
- `@/*` maps to `src/*`
- `@/convex/*` maps to `convex/*`

## Research Context

This application supports a bachelor thesis on automated pitch evaluation systems. The implementation prioritizes:
- **Transparent methodology** with documented evaluation criteria
- **Reproducible results** through version-controlled prompts and scoring
- **Structured data collection** for analysis and comparison studies