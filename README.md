# Pista — Startup Pitch Evaluator

Pista evaluates startup pitches using structured criteria and clear scoring rules. Users upload text or audio files, receive detailed feedback, and can compare results across multiple pitches.

## What It Does

Upload a pitch in three ways: type directly, upload a text file, or record audio for automatic transcription. The system evaluates four areas: Problem-Solution Fit, Business Model & Market, Team & Execution, and Pitch Quality. Results include numerical scores, written feedback, and suggested improvements.

The dashboard shows all previous evaluations with search and filtering. Export options include PDF reports and raw data for further analysis.

## Technical Setup

Built with Next.js 15, TypeScript, and Tailwind CSS. Uses Convex for real-time data and Clerk for user authentication. OpenAI handles text analysis and audio transcription.

**Requirements:**
- Node.js 18+
- OpenAI API key
- Clerk authentication keys
- Convex backend deployment

**Installation:**
```bash
npm install
cp .env.example .env.local  # Add your API keys
npm run dev
```

## Project Structure

```
src/
├── app/           # Next.js pages and API routes
├── components/    # UI components and forms
├── lib/           # Evaluation logic and utilities
└── providers/     # Authentication and state management
```

## Commands
- `npm run dev` — start the dev server
- `npm run build` — create a production build
- `npm start` — run the built app
- `npm run lint` — run ESLint
- `npm test` — run unit tests (Vitest)

## How Evaluation Works

The system uses fixed scoring criteria with clear anchor points. Each dimension receives a score from 1-10 based on specific evidence requirements. Prompts and scoring weights are version-controlled to ensure consistent results.

All evaluations store structured data including individual scores, aggregate ratings, and qualitative feedback. This supports both single-pitch analysis and cross-pitch comparison studies.

## Research Context

This application supports a bachelor thesis examining automated pitch evaluation systems. The implementation prioritizes transparent methodology, reproducible results, and measurable agreement with human evaluators.

The codebase emphasizes clarity over complexity, with documented evaluation criteria and traceable scoring decisions.
