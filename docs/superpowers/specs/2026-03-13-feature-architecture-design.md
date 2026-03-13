# Feature-Based Architecture Refactoring

**Date**: 2026-03-13
**Status**: Draft

## Objective

Refactor vidora-admin from a layered architecture to a feature-based architecture, improving code organization, maintainability, and developer experience.

## Current Structure

```
src/
├── api/                   # Centralized API layer
│   ├── index.ts           # ky instance
│   └── auth.ts            # auth API
├── hooks/                 # Global hooks
├── stores/                # All Zustand stores
├── components/            # All components
│   ├── ui/                # shadcn/ui primitives
│   ├── common/            # Shared components
│   ├── layout/            # Layout components
│   └── chart/             # Chart components
├── pages/                 # Page components
│   ├── auth/
│   ├── dashboard/
│   ├── profile/
│   ├── system/
│   ├── categories/
│   └── tags/
├── types/                 # Shared types
├── lib/                   # Utilities
├── locales/               # i18n files
├── router/                # Router config
└── mocks/                 # MSW handlers
```

## Target Structure

```
src/
├── components/                # Shared components (unchanged)
│   ├── ui/                    # shadcn/ui primitives
│   ├── common/                # Shared business components
│   ├── layout/                # Layout components
│   └── chart/                 # Chart components
│
├── features/                  # Feature modules
│   ├── auth/
│   │   ├── components/        # LoginForm, RegisterForm, ResetForm, ReturnButton, LoginProvider
│   │   ├── hooks/             # useAuth, useLogin, useLogout, useUser
│   │   ├── api.ts             # authApi
│   │   ├── store.ts           # useAuthStore
│   │   ├── types.ts           # User, LoginRequest, AuthData
│   │   └── index.ts           # Public exports
│   │
│   ├── dashboard/
│   │   ├── components/        # Extracted from index.tsx
│   │   └── index.tsx
│   │
│   ├── profile/
│   │   ├── components/        # General, Security
│   │   └── index.tsx
│   │
│   ├── users/
│   │   ├── api.ts
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── index.tsx
│   │
│   ├── roles/
│   │   ├── api.ts
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── index.tsx
│   │
│   ├── permissions/
│   │   ├── api.ts
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── index.tsx
│   │
│   ├── categories/
│   │   └── index.tsx
│   │
│   └── tags/
│       └── index.tsx
│
├── hooks/                     # Global hooks (usePagination, useMediaQuery, useUpload)
├── stores/                    # Global stores (theme, locale only)
├── lib/                       # Utilities (unchanged)
├── locales/                   # i18n files (unchanged)
├── router/                    # Router config (updated imports)
├── mocks/                     # MSW handlers (unchanged)
├── types/                     # Global types (ApiResponse only)
│
├── App.tsx
└── main.tsx
```

## Design Decisions

### 1. Shared Components Stay Centralized

**Decision**: `src/components/ui/`, `src/components/common/`, `src/components/layout/`, and `src/components/chart/` remain in place.

**Rationale**: shadcn/ui components are library primitives, not business logic. They should be centrally managed and imported by features as needed.

### 2. Auth Store Moves to Feature

**Decision**: `src/stores/auth.ts` → `src/features/auth/store.ts`

**Rationale**: Auth state is tightly coupled to the auth feature. Moving it into the feature directory keeps all auth-related code together. Theme and locale stores remain centralized as they are truly cross-cutting concerns.

### 3. Feature APIs

**Decision**: Each feature gets its own `api.ts` file for feature-specific API calls.

**Rationale**: Co-locating API definitions with their features improves discoverability. The shared ky instance in `src/api/index.ts` (renamed to `src/lib/api.ts`) remains available for all features to use.

### 4. Public API via index.ts

**Decision**: Each feature exports its public API through an `index.ts` file.

**Pattern**:
```typescript
// features/auth/index.ts
export { useAuthStore } from './store'
export { authApi } from './api'
export { useAuth, useLogin, useLogout, useUser } from './hooks'
export type { User, LoginRequest, AuthData } from './types'
export { default as LoginPage } from './components/LoginPage'
```

### 5. Router Updates

**Decision**: Router imports pages from features instead of pages directory.

**Before**:
```typescript
const Auth = lazy(() => import('@/pages/auth'))
```

**After**:
```typescript
const Auth = lazy(() => import('@/features/auth'))
```

### 6. Global vs Feature Hooks

**Decision**:
- Global hooks (`usePagination`, `useMediaQuery`, `useUpload`) stay in `src/hooks/`
- Feature-specific hooks move to `features/*/hooks/`

**Rationale**: Hooks that are genuinely reusable across features belong globally. Feature-specific hooks should be co-located with their feature.

### 7. Types Organization

**Decision**:
- `src/types/api.ts` (ApiResponse) stays global
- Feature types move to `features/*/types.ts`

### 8. API Client Location

**Decision**: Move `src/api/index.ts` to `src/lib/api.ts` and keep the ky instance as a shared utility.

**Rationale**: The ky instance with interceptors is infrastructure, not a feature. It belongs in `lib/` alongside other utilities.

## Migration Strategy

### Phase 1: Core Infrastructure
1. Move `src/api/index.ts` → `src/lib/api.ts`
2. Create `src/features/` directory structure

### Phase 2: Auth Feature (Most Complex)
1. Create `features/auth/` directory
2. Move auth types → `features/auth/types.ts`
3. Move auth store → `features/auth/store.ts`
4. Move auth API → `features/auth/api.ts`
5. Move auth hooks → `features/auth/hooks/`
6. Move auth components → `features/auth/components/`
7. Create `features/auth/index.ts` with public exports
8. Update all imports

### Phase 3: System Features
1. Create `features/users/`, `features/roles/`, `features/permissions/`
2. Move corresponding pages and create API/hooks/types as needed

### Phase 4: Other Features
1. Create `features/dashboard/`, `features/profile/`, `features/categories/`, `features/tags/`
2. Move corresponding pages

### Phase 5: Cleanup
1. Remove empty `src/pages/` directory
2. Remove empty `src/api/` directory
3. Update router imports
4. Run full test/lint suite

## File Mapping

### Auth Feature

| Current Location | New Location |
|-----------------|--------------|
| `src/stores/auth.ts` | `src/features/auth/store.ts` |
| `src/api/auth.ts` | `src/features/auth/api.ts` |
| `src/hooks/useAuth.ts` | `src/features/auth/hooks/index.ts` |
| `src/types/auth.ts` | `src/features/auth/types.ts` |
| `src/pages/auth/index.tsx` | `src/features/auth/index.tsx` |
| `src/pages/auth/LoginForm.tsx` | `src/features/auth/components/LoginForm.tsx` |
| `src/pages/auth/RegisterForm.tsx` | `src/features/auth/components/RegisterForm.tsx` |
| `src/pages/auth/ResetForm.tsx` | `src/features/auth/components/ResetForm.tsx` |
| `src/pages/auth/components/ReturnButton.tsx` | `src/features/auth/components/ReturnButton.tsx` |
| `src/pages/auth/providers/LoginProvider.tsx` | `src/features/auth/components/LoginProvider.tsx` |

### Other Features

| Current Location | New Location |
|-----------------|--------------|
| `src/pages/dashboard/index.tsx` | `src/features/dashboard/index.tsx` |
| `src/pages/profile/index.tsx` | `src/features/profile/index.tsx` |
| `src/pages/profile/General.tsx` | `src/features/profile/components/General.tsx` |
| `src/pages/profile/Security.tsx` | `src/features/profile/components/Security.tsx` |
| `src/pages/system/users/index.tsx` | `src/features/users/index.tsx` |
| `src/pages/system/roles/index.tsx` | `src/features/roles/index.tsx` |
| `src/pages/system/permissions/index.tsx` | `src/features/permissions/index.tsx` |
| `src/pages/categories/index.tsx` | `src/features/categories/index.tsx` |
| `src/pages/tags/index.tsx` | `src/features/tags/index.tsx` |

### Shared Infrastructure

| Current Location | New Location |
|-----------------|--------------|
| `src/api/index.ts` | `src/lib/api.ts` |

## Import Changes

### Before
```typescript
// In any component
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { useLogin, useLogout } from '@/hooks/useAuth'
import type { User, LoginRequest } from '@/types/auth'

// In router
const Auth = lazy(() => import('@/pages/auth'))
```

### After
```typescript
// In any component
import { useAuthStore, authApi, useLogin, useLogout } from '@/features/auth'
import type { User, LoginRequest } from '@/features/auth'

// In router
const Auth = lazy(() => import('@/features/auth'))
```

## Files to Remove After Migration

- `src/pages/` (entire directory)
- `src/api/` (entire directory)
- `src/types/auth.ts`
- `src/hooks/useAuth.ts`

## Verification Checklist

- [ ] All imports resolve correctly
- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] Dev server starts without errors
- [ ] Auth flow works (login, logout, token refresh)
- [ ] All pages render correctly
- [ ] Router navigation works

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Import path breakage | Update imports systematically, verify with TypeScript |
| Circular dependencies | Use `index.ts` barrel exports carefully |
| Missed references | Search codebase for old paths before deleting |