# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing
- `npm run test` - Run all tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

### Backend Development
- `npx convex dev` - Start Convex development backend
- `npx convex deploy` - Deploy Convex backend to production

## Architecture Overview

This is a Next.js 15 application using the App Router with TypeScript. It's an AI-powered startup pitch evaluation platform with the following key architectural components:

### Core Technology Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Convex (real-time backend-as-a-service)
- **Authentication**: Clerk
- **AI Integration**: OpenAI API for pitch analysis
- **State Management**: Zustand + React Context
- **Testing**: Vitest with React Testing Library

### Project Structure

#### App Router Organization
- `src/app/(dashboard)/dashboard/` - Main dashboard with pitch management
- `src/app/(pitch)/pitch/[id]/` - Individual pitch evaluation pages
- `src/app/(auth)/` - Authentication pages
- `src/app/api/` - API routes for external integrations

#### Component Architecture
- `src/components/ui/` - Base UI components (Shadcn/ui primitives)
- `src/components/shared/` - Feature-specific shared components organized by domain:
  - `navigation/` - App navigation components
  - `forms/add-pitches/` - Multi-step pitch upload forms
  - `modals/` - Modal dialogs
  - `common/` - Generic shared components

#### Backend Schema (Convex)
The Convex schema supports both legacy and new structured evaluation formats:
- `pitches` table with user/org-based access control
- `userFavorites` for pitch bookmarking
- Evaluation data supports both legacy string feedback and new structured analysis
- Full-text search on pitch titles with org-level filtering

#### Key Data Types
- **Structured Evaluation**: Multi-dimensional scoring with detailed breakdowns, strengths/improvements with priority levels, and comprehensive feedback including investment thesis, risk assessment, and founder evaluation
- **Legacy Evaluation**: Simple criteria-based scoring (maintained for backward compatibility)

### Important Patterns

#### Multi-Step Forms
The pitch upload process uses a multi-step form pattern in `src/components/shared/forms/add-pitches/steps/` with validation and state management across steps.

#### Authentication & Authorization
- Clerk handles authentication with org-based access control
- All data queries are org-scoped for multi-tenancy
- User permissions are managed through Clerk organizations

#### Real-time Updates
Convex provides real-time data synchronization. Components use Convex React hooks for live data updates.

#### AI Evaluation Pipeline
1. Audio files are processed and transcribed
2. Content is analyzed using OpenAI API with structured prompts
3. Results are stored in either legacy or structured format
4. Visualizations are generated from structured data

### Testing Strategy
- Unit tests for utilities in `src/lib/utils/`
- Component testing with React Testing Library
- Evaluation logic testing in `src/lib/eval/`
- Use Vitest for all testing needs

### Environment Requirements
- Node.js 18+
- OpenAI API key for AI evaluations
- Clerk keys for authentication
- Convex deployment for backend services

## Thesis Writing Style (Bachelor Level)
- Mirror the tone of `thesis/img/master-thesis.txt` (clear, structured, accessible). Keep language simple and direct.
- Paragraphs: 3–6 sentences; one idea per sentence; add brief lead‑in sentences to figures/tables so there are no figure‑only paragraphs.
- Sections: begin with a short purpose line (what this section covers) and end with a one‑sentence takeaway when helpful.
- Voice: active and precise; avoid jargon and stacked clauses. Prefer plain words (e.g., "shows", "uses", "finds").
- Punctuation: no em dashes; use commas or full stops. Keep hyphenation consistent (e.g., "Problem‑Solution Fit", "follow‑up").
- Content boundaries: do not reference internal file paths in the main text. Put implementation details (full configs, API status codes, diagram sources) in an appendix.
- Terminology: avoid "Natural Language Processing (NLP)" unless quoting; use "automated text analysis" or "large language models".

## For Agents 
- Use Agents in .claude/agents