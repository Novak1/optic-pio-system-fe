# Frontend Structure

This document describes the folder structure and organization of the frontend application.

## Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base/atomic components (buttons, inputs, cards)
│   ├── forms/          # Form components
│   ├── layout/         # Layout components (header, sidebar, etc.)
│   └── features/       # Feature-specific components
│       ├── customers/  # Customer-related components
│       └── payments/   # Payment-related components
│
├── pages/              # Route/page components
├── hooks/              # TanStack Query hooks for server state
├── stores/             # Zustand stores for client state
├── lib/                # Configured utilities (API client, validators)
├── utils/              # Pure utility functions
├── types/              # TypeScript type definitions
├── routes/             # Routing configuration
├── config/             # App configuration
├── assets/             # Static assets
└── styles/             # Global styles

## Path Aliases

The project uses path aliases for cleaner imports:

- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@hooks/*` → `src/hooks/*`
- `@stores/*` → `src/stores/*`
- `@lib/*` → `src/lib/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`
- `@routes/*` → `src/routes/*`
- `@config/*` → `src/config/*`
- `@assets/*` → `src/assets/*`

## Key Principles

1. **Components are organized by purpose**:
   - `ui/` - Pure, reusable UI components
   - `layout/` - Page structure components
   - `features/` - Domain-specific components

2. **State management**:
   - TanStack Query for server state (hooks/)
   - Zustand for client state (stores/)

3. **Routing**:
   - React Router for navigation
   - Protected routes for authentication
   - Route constants in routes/routes.ts

4. **Configuration**:
   - Environment variables in config/env.ts
   - Query client config in config/queryClient.ts

For more details, see STATE_MANAGEMENT.md
```
