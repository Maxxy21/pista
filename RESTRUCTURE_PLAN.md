# Project Restructuring Plan - Next.js 15 Best Practices

## 🎯 **Goals**
- Follow Next.js 15 App Router conventions
- Improve code organization and maintainability 
- Use private folders and route groups effectively
- Better separation of concerns
- Optimize for developer experience

## 📁 **Proposed Structure**

```
startup-pitches/
├── src/                              # Optional src folder (recommended)
│   ├── app/                         # App Router directory
│   │   ├── (dashboard)/             # Route group for dashboard routes
│   │   │   ├── dashboard/
│   │   │   │   ├── _components/     # Private folder for dashboard components
│   │   │   │   │   ├── dashboard-header.tsx
│   │   │   │   │   ├── dashboard-tabs.tsx
│   │   │   │   │   ├── empty-states/
│   │   │   │   │   │   ├── empty-favorites.tsx
│   │   │   │   │   │   ├── empty-org.tsx
│   │   │   │   │   │   ├── empty-pitches.tsx
│   │   │   │   │   │   └── empty-search.tsx
│   │   │   │   │   ├── grids/
│   │   │   │   │   │   ├── pitches-grid.tsx
│   │   │   │   │   │   └── virtualized-pitches-grid.tsx
│   │   │   │   │   ├── cards/
│   │   │   │   │   │   └── pitch-card.tsx
│   │   │   │   │   └── stats.tsx
│   │   │   │   ├── _hooks/           # Private folder for dashboard hooks
│   │   │   │   │   └── use-dashboard-state.ts
│   │   │   │   ├── _lib/            # Private folder for dashboard utilities
│   │   │   │   ├── loading.tsx      # Loading UI for dashboard
│   │   │   │   ├── error.tsx        # Error boundary for dashboard
│   │   │   │   └── page.tsx         # Dashboard page
│   │   │   └── layout.tsx           # Dashboard layout
│   │   │
│   │   ├── (pitch)/                 # Route group for pitch routes
│   │   │   └── pitch/
│   │   │       └── [id]/
│   │   │           ├── _components/ # Private folder for pitch detail components
│   │   │           │   ├── analysis/
│   │   │           │   │   ├── detailed-analysis.tsx
│   │   │           │   │   ├── evaluation-summary.tsx
│   │   │           │   │   ├── structured-detailed-analysis.tsx
│   │   │           │   │   └── structured-evaluation-summary.tsx
│   │   │           │   ├── charts/
│   │   │           │   │   ├── radar-chart.tsx
│   │   │           │   │   └── score-bar-chart.tsx
│   │   │           │   ├── export/
│   │   │           │   │   ├── copy-button.tsx
│   │   │           │   │   └── pdf-export.tsx
│   │   │           │   ├── sections/
│   │   │           │   │   ├── pitch-header.tsx
│   │   │           │   │   ├── questions-section.tsx
│   │   │           │   │   ├── score-overview.tsx
│   │   │           │   │   └── transcript-section.tsx
│   │   │           │   └── utils.ts
│   │   │           ├── loading.tsx
│   │   │           ├── error.tsx
│   │   │           └── page.tsx
│   │   │
│   │   ├── (auth)/                  # Route group for auth routes
│   │   │   ├── sign-in/
│   │   │   │   └── [[...sign-in]]/
│   │   │   │       ├── _components/
│   │   │   │       │   └── sign-in-form.tsx
│   │   │   │       └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── [[...sign-up]]/
│   │   │   │       ├── _components/
│   │   │   │       │   └── sign-up-form.tsx
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                     # API routes
│   │   │   ├── evaluate-answers/
│   │   │   │   └── route.ts
│   │   │   ├── evaluate/
│   │   │   │   └── route.ts
│   │   │   ├── generate-questions/
│   │   │   │   └── route.ts
│   │   │   └── transcribe/
│   │   │       └── route.ts
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Landing page
│   │   ├── loading.tsx              # Global loading
│   │   ├── error.tsx                # Global error boundary
│   │   ├── not-found.tsx           # 404 page
│   │   └── icon.tsx                 # App icon
│   │
│   ├── components/                  # Shared components
│   │   ├── ui/                      # UI primitives (shadcn/ui)
│   │   │   └── [all existing ui components]
│   │   │
│   │   ├── shared/                  # Shared business components
│   │   │   ├── navigation/
│   │   │   │   ├── app-sidebar.tsx
│   │   │   │   ├── pitch-details-sidebar.tsx
│   │   │   │   ├── nav-user.tsx
│   │   │   │   └── team-switcher.tsx
│   │   │   ├── forms/
│   │   │   │   ├── search-form.tsx
│   │   │   │   └── add-pitches/
│   │   │   │       └── [existing add-pitches components]
│   │   │   ├── modals/
│   │   │   │   ├── confirm-modal.tsx
│   │   │   │   └── rename-modal.tsx
│   │   │   ├── auth/
│   │   │   │   └── loading.tsx
│   │   │   └── common/
│   │   │       ├── hint.tsx
│   │   │       ├── invite-button.tsx
│   │   │       ├── lazy-load-section.tsx
│   │   │       ├── collapse-trigger.tsx
│   │   │       └── expand-trigger.tsx
│   │   │
│   │   └── landing/                 # Landing page components
│   │       ├── _components/
│   │       │   └── [existing landing components]
│   │       └── landing-page.tsx
│   │
│   ├── lib/                         # Shared utilities and configurations
│   │   ├── types/
│   │   │   ├── evaluation.ts
│   │   │   └── pitch.ts
│   │   ├── utils/
│   │   │   ├── evaluation-utils.ts
│   │   │   └── resource-priority.ts
│   │   ├── config/
│   │   │   └── database.ts         # Database config if needed
│   │   ├── validations/            # Zod schemas
│   │   ├── constants.ts            # App constants
│   │   ├── rate-limit.ts
│   │   └── utils.ts
│   │
│   ├── hooks/                       # Shared custom hooks
│   │   ├── use-api-mutation.ts
│   │   ├── use-debounced-search.ts
│   │   ├── use-intersection-observer.tsx
│   │   ├── use-mobile.tsx
│   │   ├── use-optimized-animations.tsx
│   │   └── use-prefetch-pitches.ts
│   │
│   ├── store/                       # State management (Zustand/etc)
│   │   ├── use-pitch-progress.tsx
│   │   └── use-rename-modal.ts
│   │
│   └── providers/                   # React providers
│       ├── convex-client-provider.tsx
│       ├── modal-provider.tsx
│       └── theme-provider.tsx
│
├── convex/                          # Convex backend
│   ├── _generated/
│   ├── auth.config.ts
│   ├── pitches.ts
│   └── schema.ts
│
├── public/                          # Static assets
│   └── [all existing assets]
│
├── __tests__/                       # Test files
│   └── [existing test structure]
│
├── .claude/                         # Claude configuration
├── .env.local                       # Environment variables
├── .gitignore
├── components.json                  # shadcn/ui config
├── middleware.ts
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔄 **Migration Steps**

### Phase 1: Setup src folder and move app directory
1. Create `src/` folder
2. Move `app/` directory inside `src/`
3. Update import paths in components

### Phase 2: Organize route groups
1. Create `(dashboard)` route group
2. Create `(pitch)` route group  
3. Keep `(auth)` route group as is

### Phase 3: Implement private folders
1. Move component folders to `_components/`
2. Move hooks to `_hooks/`
3. Move utilities to `_lib/`

### Phase 4: Reorganize shared components
1. Create `components/shared/` structure
2. Move navigation components
3. Organize by feature/function

### Phase 5: Update imports and paths
1. Update all import statements
2. Update TypeScript paths in `tsconfig.json`
3. Test all functionality

## ✅ **Benefits of This Structure**

1. **Route Groups**: Organize related routes without affecting URLs
2. **Private Folders**: Keep implementation details separate from public API
3. **src Folder**: Clean separation of source code from config files
4. **Feature-Based Organization**: Related code lives together
5. **Consistent Naming**: Clear conventions throughout
6. **Better Developer Experience**: Easier to find and maintain code
7. **Next.js 15 Ready**: Follows latest App Router conventions

## 🚀 **Next Steps**

Would you like me to start implementing this restructure? I can:

1. **Start with Phase 1** (src folder setup)
2. **Create a specific migration plan** for your most critical routes first
3. **Implement gradually** to avoid breaking the app
4. **Update configurations** as we go

Let me know which approach you prefer!