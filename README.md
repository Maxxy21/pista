# Pista — Startup Pitch Evaluator

Pista is a web application that helps teams review startup pitches in a consistent way. It supports text input, audio transcription, structured evaluation, and clear reports. The focus is on reproducibility and simple, transparent scoring.

## Overview

- Upload a pitch as text, a text file, or an audio file.
- Get a structured evaluation across four criteria with transparent rules.
- See summaries, strengths, and areas for improvement.
- Export results and review past pitches in a clean dashboard.

## How It Works

- Input: type or paste text, upload a `.txt` file, or upload audio for transcription.
- Processing: the app prepares the content and applies a rubric with clear anchors and scoring rules.
- Output: JSON results are rendered as charts and summaries, and can be exported as PDF.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Dashboard route group
│   ├── (pitch)/            # Pitch details and analysis
│   └── api/                # API endpoints (evaluate, transcribe, questions)
├── components/             # UI and shared components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, types, constants, parsing
├── providers/              # Context providers
└── store/                  # State management
```

## Getting Started

Requirements
- Node.js 18+ and npm
- Accounts/keys for your chosen auth and backend services

Setup
1) Install dependencies
   - `npm install`
2) Configure environment
   - Copy `.env.example` to `.env.local` and fill values
3) Start development
   - `npm run dev` and open `http://localhost:3000`

## Commands
- `npm run dev` — start the dev server
- `npm run build` — create a production build
- `npm start` — run the built app
- `npm run lint` — run ESLint
- `npm test` — run unit tests (Vitest)

## Evaluation Details

Pista uses a rubric with anchors and simple rules to avoid mid‑scale defaults and to prefer evidence. Scores are returned as structured data and aggregated with stable, documented weights. Prompts, model names, and temperatures are versioned in code so results are repeatable.

## Security Notes

- Authentication and organization scoping are enforced on protected routes.
- API endpoints validate inputs and apply rate limits.
- Responses include standard security headers.

## Acknowledgements

This project was built to support a bachelor thesis on automated, consistent pitch evaluation. The code and documentation favor clarity, reproducibility, and small, focused modules.
