# Architecture Documentation

## System Architecture Overview

Pista is built using a modern, scalable architecture that separates concerns cleanly and ensures optimal performance and maintainability.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15 App Router  │  TypeScript  │  Tailwind CSS     │
│  React Components       │  Framer Motion│  Shadcn/ui        │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP/WebSocket
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   API LAYER                                 │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes     │  Rate Limiting │  Validation      │
│  OpenAI Integration     │  Error Handling│  Authentication  │
└─────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│    BACKEND SERVICES     │    │   AUTHENTICATION        │
├─────────────────────────┤    ├─────────────────────────┤
│  Convex Real-time DB    │    │  Clerk Auth Service     │
│  Reactive Queries       │    │  JWT Token Management   │
│  Schema Management      │    │  Organization Support  │
│  File Storage           │    │  User Management        │
└─────────────────────────┘    └─────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────┤
│  OpenAI GPT-4          │  Whisper API   │  Vercel Analytics │
│  Content Analysis      │  Transcription │  Performance      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Architecture

**Next.js 15 with App Router**
- Server-side rendering (SSR) and static site generation (SSG)
- Route groups for logical organization: `(dashboard)`, `(pitch)`, `(auth)`
- Private folders (`_components`, `_hooks`, `_lib`) for implementation details
- Streaming and progressive loading

**Component Architecture**
```
src/components/
├── ui/                     # Reusable UI primitives
│   ├── button.tsx
│   ├── dialog.tsx
│   └── ...
└── shared/                 # Business logic components
    ├── navigation/         # Navigation components
    ├── forms/             # Form components
    ├── modals/            # Modal dialogs
    └── common/            # Common utilities
```

**State Management**
- **Zustand**: Lightweight state management for client-side state
- **Convex**: Real-time reactive queries for server state
- **React Context**: Theme and modal providers

### Backend Architecture

**Convex Backend-as-a-Service**
```typescript
// Real-time reactive architecture
const pitches = useQuery(api.pitches.getFilteredPitches, {
  orgId: organization.id,
  searchTerm,
  scoreFilter,
  sortBy
});
```

**Features:**
- Real-time data synchronization
- Optimistic updates
- Schema validation
- File storage and management
- Serverless functions

**API Design**
```
src/app/api/
├── evaluate/              # Pitch evaluation endpoint
├── evaluate-answers/      # Q&A evaluation
├── generate-questions/    # Question generation
└── transcribe/           # Audio transcription
```

### Responsibility Split: Convex vs Next.js API

- Convex
  - Owns all persistent data, real-time queries, and user/org scoping.
  - Mutations/queries implement business rules close to the data model.
  - Example: `convex/pitches.ts` handles create/update/remove/favorite and filtered reads.

- Next.js API routes
  - Stateless service adapters for external AI workloads and browser uploads.
  - Keep OpenAI calls, transcription, and prompt orchestration out of Convex to avoid long-running work in data functions.
  - Examples: `/api/evaluate`, `/api/generate-questions`, `/api/transcribe`.

This separation keeps the data plane (Convex) simple and reliable while the control plane (Next.js API) integrates external services. Next.js routes may call Convex via the client when needed, but most write operations happen through Convex mutations on the client after API responses.

### Authentication & Authorization

**Clerk Integration**
- JWT-based authentication
- Organization-based multi-tenancy
- Role-based access control (RBAC)
- Social login providers

**Security Layers:**
1. **Client-side**: Route protection with middleware
2. **Server-side**: API endpoint authentication
3. **Database**: Row-level security with organization filtering

### Data Flow Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Upload    │───▶│ Transcription│───▶│   Analysis  │
│   Audio     │    │   (Whisper)  │    │   (GPT-4)   │
└─────────────┘    └──────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ Visualization│◀───│   Storage    │◀───│  Structured │
│  (Charts)   │    │   (Convex)   │    │   Results   │
└─────────────┘    └──────────────┘    └─────────────┘
```

## File Organization

### Next.js 15 App Router Structure

```
src/app/
├── (dashboard)/           # Dashboard route group
│   └── dashboard/
│       ├── _components/   # Private dashboard components
│       │   ├── empty-states/
│       │   ├── grids/
│       │   └── cards/
│       ├── _hooks/       # Dashboard-specific hooks
│       └── _lib/         # Dashboard utilities
├── (pitch)/              # Pitch evaluation route group
│   └── pitch/[id]/
│       └── _components/  # Private pitch components
│           ├── analysis/
│           ├── charts/
│           ├── export/
│           └── sections/
├── (auth)/               # Authentication route group
│   ├── sign-in/[[...sign-in]]/
│   └── sign-up/[[...sign-up]]/
└── api/                  # API endpoints
    ├── evaluate/
    ├── transcribe/
    └── generate-questions/
```

### Component Organization

**Private Components (`_components/`)**
- Route-specific components that are implementation details
- Not publicly accessible via URL
- Co-located with their respective routes

**Shared Components (`src/components/shared/`)**
- Reusable business logic components
- Organized by feature/function
- Can be imported across the application

## Performance Architecture

### Optimization Strategies

**Client-side Optimizations**
- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image component
- Virtualization for large pitch lists
- Progressive loading with React Suspense

**Server-side Optimizations**
- Static generation for marketing pages
- Server-side rendering for dynamic content
- Edge runtime for API routes
- CDN caching via Vercel

**Database Optimizations**
- Reactive queries with automatic caching
- Optimistic updates for immediate feedback
- Background synchronization
- Query optimization with proper indexing

### Bundle Analysis

```bash
# Analyze bundle size
npm run build

# Generated bundle information:
Route (app)                    Size     First Load JS
├ ○ /                         9.89 kB   187 kB
├ ƒ /dashboard               31 kB      288 kB
├ ƒ /pitch/[id]             120 kB      307 kB
└ ƒ /sign-in/[[...sign-in]]  2 kB      131 kB
```

## Security Architecture

### Authentication Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Client    │───▶│    Clerk     │───▶│   Convex    │
│  (Browser)  │    │    Auth      │    │  Backend    │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       │ JWT Token         │ Validate Token    │ Row-level
       │                   │                   │ Security
       ▼                   ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Protected  │    │ Middleware   │    │  Filtered   │
│   Routes    │    │  Validation  │    │   Data      │
└─────────────┘    └──────────────┘    └─────────────┘
```

### Security Measures

1. **Authentication**: JWT tokens with Clerk
2. **Authorization**: Organization-based access control
3. **Input Validation**: Zod schemas for all inputs
4. **Rate Limiting**: API endpoint protection
5. **CORS Configuration**: Restricted origin access
6. **Environment Security**: Secure environment variable handling

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                      │
├─────────────────────────────────────────────────────────────┤
│  Global CDN        │  Edge Functions  │  Analytics         │
│  Static Assets     │  API Routes      │  Performance       │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND SERVICES                          │
├─────────────────────────────────────────────────────────────┤
│  Convex (Global)   │  Clerk (Global)  │  OpenAI (US)      │
│  Real-time DB      │  Authentication  │  AI Processing    │
└─────────────────────────────────────────────────────────────┘
```

### Environment Configuration

- **Development**: Local development with hot reloading
- **Preview**: Automatic preview deployments for PRs
- **Production**: Global edge deployment with CDN

## Scalability Considerations

### Horizontal Scaling
- **Frontend**: CDN distribution and edge caching
- **Backend**: Serverless functions auto-scale
- **Database**: Convex handles scaling automatically

### Performance Monitoring
- **Vercel Analytics**: Core web vitals tracking
- **Error Tracking**: Built-in error boundaries
- **User Experience**: Performance metrics collection

## Future Architecture Considerations

### Potential Enhancements

1. **Microservices**: Break down API routes into separate services
2. **Caching Layer**: Add Redis for improved performance
3. **Event-Driven Architecture**: Implement event streaming
4. **AI Pipeline**: Dedicated AI processing service
5. **Mobile App**: React Native client sharing business logic

### Monitoring & Observability

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Metrics   │    │   Logging    │    │   Tracing   │
│   (Vercel)  │    │  (Console)   │    │  (Custom)   │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
              ┌──────────────────────┐
              │   Health Dashboard   │
              │   (Future)           │
              └──────────────────────┘
```

This architecture provides a solid foundation for a scalable, maintainable, and performant application while following modern development best practices.
