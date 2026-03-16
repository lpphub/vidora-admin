# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Vidora Admin is a video content management admin panel built with React 19 + TypeScript.

## Development Commands

```bash
pnpm dev        # Start dev server (port 5173)
pnpm build      # Build for production (tsc + vite build)
pnpm lint       # Biome lint check
pnpm lint:fix   # Biome lint with auto-fix
pnpm format     # Biome format
```

## Tech Stack

- **Build**: Vite 7 (Rolldown) + TypeScript 5.9
- **UI**: React 19, shadcn/ui v4 (radix-lyra style), Tailwind CSS 4
- **Radix**: Unified `radix-ui` package (not individual `@radix-ui/react-*`)
- **Data**: TanStack Query (react-query), Zustand
- **HTTP**: ky (lightweight fetch wrapper)
- **Routing**: React Router v7 (lazy loading)
- **Forms**: react-hook-form + zod + @hookform/resolvers
- **i18n**: i18next + react-i18next
- **Linting**: Biome (not ESLint/Prettier)

## Project Structure

```
src/
├── app/                    # Application
│   ├── router/             # Route config with lazy loading
│   └── providers/          # React Providers
├── pages/                  # Page components (route entries)
├── features/               # Feature modules (see below)
├── shared/                 # Cross-feature shared resources
│   ├── components/         # UI components
│   │   ├── ui/            # shadcn/ui primitives
│   │   └── layout/        # Header, Sidebar, Main
│   ├── hooks/             # usePagination, useMediaQuery, useUpload
│   ├── stores/            # auth, theme, locale (Zustand)
│   ├── locales/           # i18n: zh/, en/
│   └── utils/             # constants, env
├── lib/                   # Core library wrappers
│   ├── api.ts             # ky HTTP client with auth
│   └── storage.ts         # localStorage wrapper
└── mocks/                 # MSW mock handlers
```

Path alias: `@/` → `./src/`

## Feature-Based Architecture

Each feature is self-contained with its own API, types, hooks, and components:

```
src/features/<feature>/
├── api.ts                 # API endpoint definitions
├── types.ts               # TypeScript types
├── hooks/                 # TanStack Query hooks
│   └── index.ts
├── components/            # Feature-specific components
└── index.ts               # Public exports
```

### Adding New API Endpoints

1. **Define types** in `src/features/<feature>/types.ts`
2. **Create API object** in `src/features/<feature>/api.ts`:

```typescript
import api from '@/lib/api'
import type { XxxResp, CreateXxxReq } from './types'

export const xxxApi = {
  list: () => api.get<XxxResp[]>('xxx'),
  get: (id: string) => api.get<XxxResp>(`xxx/${id}`),
  create: (data: CreateXxxReq) => api.post<XxxResp>('xxx', data),
  update: (id: string, data: Partial<CreateXxxReq>) => api.put<XxxResp>(`xxx/${id}`, data),
  delete: (id: string) => api.delete(`xxx/${id}`),
}
```

3. **Create hooks** in `src/features/<feature>/hooks/index.ts`:

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { xxxApi } from '../api'

export const xxxKeys = {
  all: ['xxx'] as const,
  list: () => [...xxxKeys.all, 'list'] as const,
  detail: (id: string) => [...xxxKeys.all, 'detail', id] as const,
}

export function useXxxList() {
  return useQuery({
    queryKey: xxxKeys.list(),
    queryFn: () => xxxApi.list(),
  })
}

export function useXxx(id: string) {
  return useQuery({
    queryKey: xxxKeys.detail(id),
    queryFn: () => xxxApi.get(id),
    enabled: !!id,
  })
}

export function useCreateXxx() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: xxxApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: xxxKeys.all }),
  })
}
```

4. **Use in components**:

```typescript
function XxxPage() {
  const { data, isLoading } = useXxxList()
  const createXxx = useCreateXxx()
}
```

## API Layer

The ky client in `src/lib/api.ts` handles:

- **Token injection**: Auto-attaches Bearer token from auth store
- **401 refresh**: Automatic token refresh with singleFlight pattern
- **Response unwrapping**: Extracts `data` from `{ code, message, data }` response
- **Error handling**: Throws `ApiError` with code and message

```typescript
// Response format from backend
interface ApiResponse<T> {
  code: number      // 0 = success
  message: string
  data?: T
}
```

## Routing

- Uses React Router v7 with lazy loading
- All routes defined in `src/app/router/index.tsx`
- Auth guard via `<AuthGuard requireAuth>` wrapper
- Pages in `src/pages/` are lazy-loaded

## Component Organization

| Path | Purpose |
|------|---------|
| `src/shared/components/ui/` | shadcn/ui primitives - do NOT edit directly |
| `src/shared/components/layout/` | Layout components (Header, Sidebar, Main) |
| `src/shared/components/*.tsx` | Reusable components (ConfirmDialog, ThemeToggle) |
| `src/features/*/components/` | Feature-specific components |

### Adding shadcn Components

```bash
npx shadcn@latest add <component>              # Add new component
npx shadcn@latest add <component> --overwrite  # Overwrite existing
```

Note: shadcn v4 uses unified `radix-ui` package with "radix-lyra" style. Components import from `'radix-ui'` not `@radix-ui/react-*`.

## State Management

- **Zustand** for global state in `src/shared/stores/`
- **TanStack Query** for server state (preferred for API data)
- **Zustand persist** middleware for auth tokens (localStorage key: `vidora-auth`)

## Code Style (Biome)

- Single quotes, no semicolons, trailing commas (ES5)
- 2-space indent, 100 char line width
- `noUnusedImports` and `noUnusedVariables` are errors
- Run `pnpm lint:fix` before committing

## Environment Variables

```bash
VITE_API_BASE_URL=/api       # Backend API base URL
VITE_ENABLE_PROXY=true       # Enable Vite proxy to localhost:8080
```

## Notes

- MSW starts automatically in dev mode (`src/mocks/browser.ts`)
- 401 responses trigger automatic token refresh; refresh failure triggers logout
- Use `sonner` for toast notifications
- Forms use react-hook-form with zod schemas for validation

## Adding New Pages

1. Create page component `src/pages/XxxPage.tsx`
2. Add lazy-loaded route in router config:
   ```typescript
   // src/app/router/index.tsx
   const XxxPage = lazy(() => import('@/pages/XxxPage'))
   // Add to children array
   { path: 'xxx', element: <XxxPage /> }
   ```
3. Add navigation item in sidebar config:
   ```typescript
   // src/shared/components/layout/Sidebar.tsx
   // Add to NAVIGATION_CONFIG
   { title: 'items.xxx', path: '/xxx', icon: <Icon size={18} /> }
   ```
4. Add i18n translations in `src/shared/locales/zh/` and `en/`

## Modifying Theme Styles

### Global Color Variables
Edit CSS variables in `src/index.css`:
- `:root` - Light theme colors
- `.dark` - Dark theme colors

```css
:root {
  --primary: oklch(0.60 0.13 163);        /* Primary color */
  --background: oklch(1 0 0);              /* Background */
  --foreground: oklch(0.141 0.005 285.823); /* Foreground */
  /* ... */
}
```

### Border Radius
```css
--radius: 0;  /* Change to 0.5rem etc. to enable rounded corners */
```

### Dark Mode Toggle
- Store: `useThemeStore` (`src/shared/stores/theme.ts`)
- Component: `ThemeToggle` (`src/shared/components/ThemeToggle.tsx`)
- Toggle method: `document.documentElement.classList.toggle('dark')`

## Component Styling Guidelines

### Using cn() to Merge Classes
```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-classes', condition && 'conditional', className)} />
```

### Using Semantic Color Classes
```typescript
// Recommended - theme-aware
<span className="text-muted-foreground">
<div className="bg-primary text-primary-foreground">

// Avoid - hardcoded colors
<span className="text-gray-500">
```

### Adding Component Variants
Use CVA (class-variance-authority), see `src/shared/components/ui/button.tsx`:
```typescript
const componentVariants = cva('base-classes', {
  variants: {
    variant: { default: '...', outline: '...' },
    size: { sm: '...', lg: '...' }
  },
  defaultVariants: { variant: 'default', size: 'sm' }
})
```