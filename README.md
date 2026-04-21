# Pista — AI Startup Pitch Evaluator

Pista evaluates startup pitches using structured AI-driven criteria and clear scoring rubrics. Users submit text or audio pitches, receive detailed multi-dimensional feedback, and track progress across evaluations over time.

> Built as a bachelor thesis project and extended into a production-quality portfolio piece.

---

## Features

- **Three input modes** — type directly, upload a `.txt` file, or record audio for automatic transcription (Whisper)
- **Structured evaluation** across four dimensions: Problem-Solution Fit, Business Model & Market, Team & Execution, and Pitch Quality
- **Per-dimension scoring** with aspect-level breakdowns, strengths, improvement areas, and actionable recommendations
- **Real-time dashboard** — search, filter by score range, sort by date or score, mark favourites
- **Organisation workspaces** — share pitches and evaluations within a Clerk organisation
- **Export** — PDF reports (jsPDF) and CSV for external analysis
- **Rate limiting** — per-user request throttling on all AI endpoints

---

## Architecture

```
Browser
  │
  ├── Next.js 15 App Router (React 18)
  │     ├── /dashboard        — pitch list, stats, search/filter
  │     ├── /pitch/[id]       — evaluation detail, charts, export
  │     └── /api              — evaluate, transcribe, generate-questions
  │
  ├── Convex (real-time backend)
  │     ├── pitches           — CRUD, search index, CSV export
  │     └── userFavorites     — per-user/org favourite tracking
  │
  ├── Clerk (authentication)
  │     └── Personal + organisation workspaces
  │
  └── OpenAI
        ├── gpt-4o-mini       — pitch evaluation (parallel criteria requests)
        └── whisper-1         — audio transcription
```

### Key Design Decisions

**Why Convex instead of a traditional database?**
Convex provides real-time query subscriptions out of the box. The dashboard updates live when a pitch evaluation completes — no polling or WebSocket management required. It also collocates schema, indexes, and query logic in TypeScript, eliminating the ORM layer.

**Why parallel AI requests?**
Each evaluation criterion (Problem-Solution Fit, Business Model, etc.) is evaluated in a separate OpenAI call that runs concurrently. This reduces total latency from ~120s (sequential) to ~30-40s (parallel), and isolates prompt context per dimension for more consistent scoring.

**Structured vs. legacy evaluation format**
Early evaluations used a flat JSON format. The current version uses a structured schema with per-aspect scores, impact ratings, and actionable improvements. Both formats are supported at runtime via a type guard (`isStructuredEvaluationData`) so older pitches render correctly alongside new ones.

**Rate limiting strategy**
Rate limits are keyed on the authenticated Clerk `userId` — not the client IP, which is spoofable behind proxies. This gives per-user fairness: 20 evaluation requests and 10 transcription requests per minute.

**Versioned evaluation policy**
`MODEL_VERSION`, `PROMPT_VERSION`, and `POLICY_VERSION` are stored with every evaluation. This allows future studies to compare evaluation quality across prompt iterations and model upgrades — important for the thesis research context.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Convex |
| Auth | Clerk |
| AI | OpenAI (gpt-4o-mini, whisper-1) |
| Charts | Recharts |
| Animations | Framer Motion |
| Testing | Vitest |
| Deployment | Vercel |

---

## Local Setup

**Prerequisites:** Node.js 18+, a Convex account, a Clerk application, and an OpenAI API key.

**1. Install dependencies**
```bash
npm install
```

**2. Configure environment variables**
```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|----------|----------------|
| `CONVEX_DEPLOYMENT` | `npx convex dev` output |
| `NEXT_PUBLIC_CONVEX_URL` | `npx convex dev` output |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk dashboard → API Keys |
| `CLERK_ISSUER_URL` | Clerk dashboard → Issuer URL (e.g. `https://xxx.clerk.accounts.dev/`) |
| `OPENAI_API_KEY` | platform.openai.com |

**3. Deploy the Convex backend**
```bash
npx convex dev
```
This starts the local Convex dev server and syncs your schema and functions.

**4. Start the Next.js dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Sign-in / sign-up pages
│   ├── (dashboard)/         # Main dashboard with pitch list
│   ├── (pitch)/pitch/[id]/  # Pitch evaluation detail
│   └── api/                 # evaluate, transcribe, generate-questions
├── components/
│   ├── shared/              # Navigation, forms, landing page
│   └── ui/                  # shadcn/ui primitives
├── convex/                  # Schema, queries, mutations, auth config
├── hooks/                   # Custom React hooks
└── lib/
    ├── auth/                # API route auth helpers
    ├── constants/           # Evaluation rubric, model config
    ├── eval/                # AI response parsing
    ├── rate-limit/          # Per-user request throttling
    ├── types/               # TypeScript interfaces
    └── utils/               # PDF export, CSV export, evaluation utilities
```

---

## How Evaluation Works

1. User submits pitch text (or audio, which is first transcribed via Whisper)
2. Four evaluation criteria run **in parallel** via `Promise.all`, each with its own system prompt and rubric anchors
3. Each response is parsed from structured JSON with a text-based fallback
4. Scores are clamped to 1–10, averaged across aspect dimensions within each criterion
5. A separate overall feedback call synthesises the results into investment thesis, risk assessment, and next steps
6. The complete evaluation is stored in Convex with metadata (model version, prompt version, processing time)

Scoring rubric anchors are defined in `src/lib/constants/eval.ts` and sent with every request to ensure consistent interpretation across model updates.

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js + Convex dev servers |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run test:coverage` | Test coverage report |

---

## Deployment

The app is deployed on Vercel. The Convex backend is deployed separately via `npx convex deploy`.

Required Vercel environment variables mirror `.env.example`. Set `CLERK_ISSUER_URL` to your production Clerk issuer domain.
