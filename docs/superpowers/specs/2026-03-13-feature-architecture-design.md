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
│   ├── video/             # Video types only
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
│   │   ├── page.tsx           # LoginPage component
│   │   └── index.ts           # Public exports (includes default export for lazy loading)
│   │
│   ├── dashboard/
│   │   ├── components/        # Optional: extracted components if needed later
│   │   ├── page.tsx
│   │   └── index.ts
│   │
│   ├── profile/
│   │   ├── components/        # General, Security
│   │   ├── page.tsx
│   │   └── index.ts
│   │
│   ├── users/
│   │   ├── api.ts
│   │   ├── hooks/
│   │   ├── types.ts
│   │   ├── page.tsx
│   │   └── index.ts
│   │
│   ├── roles/
│   │   ├── api.ts
│   │   ├── hooks/
│   │   ├── types.ts
│   │   ├── page.tsx
│   │   └── index.ts
│   │
│   ├── permissions/
│   │   ├── api.ts
│   │   ├── hooks/
│   │   ├── types.ts
│   │   ├── page.tsx
│   │   └── index.ts
│   │
│   ├── categories/
│   │   ├── page.tsx
│   │   └── index.ts
│   │
│   ├── tags/
│   │   ├── page.tsx
│   │   └── index.ts
│   │
│   └── video/
│       ├── types.ts           # Video, Season, Episode, TranscodingTask, UploadFile
│       └── index.ts
│
├── hooks/                     # Global hooks (usePagination, useMediaQuery, useUpload)
├── stores/                    # Global stores (theme, locale only)
├── lib/                       # Utilities (unchanged)
├── locales/                   # i18n files (unchanged)
├── router/                    # Router config (updated imports)
├── mocks/                     # MSW handlers (updated imports)
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

### 4. Feature Index Pattern

**Decision**: Each feature uses a consistent pattern with `page.tsx` and `index.ts`:

```
feature/
├── page.tsx       # Default export: the page component
├── index.ts       # Re-exports page as default + other public API
├── components/    # Feature-specific components
├── hooks/         # Feature-specific hooks
├── api.ts         # Feature API functions
├── store.ts       # Feature store (if needed)
└── types.ts       # Feature types
```

**index.ts Pattern**:
```typescript
// features/auth/index.ts
export { default } from './page'           // Default export for lazy loading
export { useAuthStore } from './store'
export { authApi } from './api'
export { useAuth, useLogin, useLogout, useUser } from './hooks'
export type { User, LoginRequest, AuthData } from './types'
```

**Rationale**: This pattern allows:
1. Lazy loading via `lazy(() => import('@/features/auth'))` works correctly
2. Named exports for stores, hooks, types, and APIs
3. Clear separation between page component and public API

### 5. Simple vs Complex Features

**Decision**: All features follow the same base structure with `page.tsx` and `index.ts`. Additional directories (`components/`, `hooks/`, `api.ts`, `store.ts`, `types.ts`) are added only when needed.

**Pattern**:
- **Simple feature** (categories, tags): `page.tsx` + `index.ts` only
- **Medium feature** (dashboard, profile): Add `components/` if page has extractable components
- **Complex feature** (auth, users, roles, permissions): Full structure with `api.ts`, `hooks/`, `types.ts`, `store.ts` (as needed)

### 6. Router Updates

**Decision**: Router imports pages from features instead of pages directory.

**All Router Imports to Update**:
```typescript
// Before
const Auth = lazy(() => import('@/pages/auth'))
const Categories = lazy(() => import('@/pages/categories'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const Profile = lazy(() => import('@/pages/profile'))
const Permissions = lazy(() => import('@/pages/system/permissions'))
const Roles = lazy(() => import('@/pages/system/roles'))
const Users = lazy(() => import('@/pages/system/users'))
const Tags = lazy(() => import('@/pages/tags'))

// After
const Auth = lazy(() => import('@/features/auth'))
const Categories = lazy(() => import('@/features/categories'))
const Dashboard = lazy(() => import('@/features/dashboard'))
const Profile = lazy(() => import('@/features/profile'))
const Permissions = lazy(() => import('@/features/permissions'))
const Roles = lazy(() => import('@/features/roles'))
const Users = lazy(() => import('@/features/users'))
const Tags = lazy(() => import('@/features/tags'))
```

### 7. Global vs Feature Hooks

**Decision**:
- Global hooks (`usePagination`, `useMediaQuery`, `useUpload`) stay in `src/hooks/`
- Feature-specific hooks move to `features/*/hooks/`

**Rationale**: Hooks that are genuinely reusable across features belong globally. Feature-specific hooks should be co-located with their feature.

### 8. Types Organization

**Decision**:
- `src/types/api.ts` (ApiResponse) stays global
- Feature types move to `features/*/types.ts`
- Video types (`src/pages/video/types.ts`) move to `features/video/types.ts`

### 9. API Client Location

**Decision**: Move `src/api/index.ts` to `src/lib/api.ts` and keep the ky instance as a shared utility.

**Rationale**: The ky instance with interceptors is infrastructure, not a feature. It belongs in `lib/` alongside other utilities.

### 10. MSW Handler Import Updates

**Decision**: MSW handlers must update their type imports during auth feature migration.

**Files Requiring Updates**:
- `src/mocks/handlers/auth.ts`: Change `@/types/auth` → `@/features/auth`
- `src/mocks/db.ts`: Change `@/types/auth` → `@/features/auth`

**Rationale**: MSW handlers import types that are moving to features. These imports must be updated to prevent build failures.

## Migration Strategy

### Phase 1: Core Infrastructure
1. Move `src/api/index.ts` → `src/lib/api.ts`
2. Create `src/features/` directory structure

### Phase 2: Auth Feature (Most Complex)
1. Create `features/auth/` directory
2. Move auth types → `features/auth/types.ts`
3. Move auth store → `features/auth/store.ts`
4. Move auth API → `features/auth/api.ts`
5. Move auth hooks → `features/auth/hooks/index.ts`
6. Move auth components → `features/auth/components/`
7. Rename `pages/auth/index.tsx` → `features/auth/page.tsx`
8. Create `features/auth/index.ts` with public exports
9. **Update MSW imports**: `src/mocks/handlers/auth.ts` and `src/mocks/db.ts`
10. Update all other imports referencing auth

### Phase 3: System Features
1. Create `features/users/`, `features/roles/`, `features/permissions/`
2. Move corresponding pages and create API/hooks/types as needed
3. Create `page.tsx` and `index.ts` for each

### Phase 4: Other Features
1. Create `features/dashboard/`, `features/profile/`, `features/categories/`, `features/tags/`
2. Move corresponding pages with `page.tsx` + `index.ts` pattern
3. Move `src/pages/video/types.ts` → `features/video/types.ts`

### Phase 5: Cleanup
1. Remove empty `src/pages/` directory
2. Remove empty `src/api/` directory
3. Update router imports
4. Run lint and build verification

## File Mapping

### Auth Feature

| Current Location | New Location |
|-----------------|--------------|
| `src/stores/auth.ts` | `src/features/auth/store.ts` |
| `src/api/auth.ts` | `src/features/auth/api.ts` |
| `src/hooks/useAuth.ts` | `src/features/auth/hooks/index.ts` |
| `src/types/auth.ts` | `src/features/auth/types.ts` |
| `src/pages/auth/index.tsx` | `src/features/auth/page.tsx` |
| `src/pages/auth/LoginForm.tsx` | `src/features/auth/components/LoginForm.tsx` |
| `src/pages/auth/RegisterForm.tsx` | `src/features/auth/components/RegisterForm.tsx` |
| `src/pages/auth/ResetForm.tsx` | `src/features/auth/components/ResetForm.tsx` |
| `src/pages/auth/components/ReturnButton.tsx` | `src/features/auth/components/ReturnButton.tsx` |
| `src/pages/auth/providers/LoginProvider.tsx` | `src/features/auth/components/LoginProvider.tsx` |

### Video Feature (Types Only)

| Current Location | New Location |
|-----------------|--------------|
| `src/pages/video/types.ts` | `src/features/video/types.ts` |

### Other Features

| Current Location | New Location |
|-----------------|--------------|
| `src/pages/dashboard/index.tsx` | `src/features/dashboard/page.tsx` |
| `src/pages/profile/index.tsx` | `src/features/profile/page.tsx` |
| `src/pages/profile/General.tsx` | `src/features/profile/components/General.tsx` |
| `src/pages/profile/Security.tsx` | `src/features/profile/components/Security.tsx` |
| `src/pages/system/users/index.tsx` | `src/features/users/page.tsx` |
| `src/pages/system/roles/index.tsx` | `src/features/roles/page.tsx` |
| `src/pages/system/permissions/index.tsx` | `src/features/permissions/page.tsx` |
| `src/pages/categories/index.tsx` | `src/features/categories/page.tsx` |
| `src/pages/tags/index.tsx` | `src/features/tags/page.tsx` |

### Shared Infrastructure

| Current Location | New Location |
|-----------------|--------------|
| `src/api/index.ts` | `src/lib/api.ts` |

### MSW Updates (No Move, Just Import Changes)

| File | Import Change |
|------|---------------|
| `src/mocks/handlers/auth.ts` | `@/types/auth` → `@/features/auth` |
| `src/mocks/db.ts` | `@/types/auth` → `@/features/auth` |

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

// In MSW handlers
import type { AuthData, LoginRequest, User } from '@/types/auth'
```

### After
```typescript
// In any component
import { useAuthStore, authApi, useLogin, useLogout } from '@/features/auth'
import type { User, LoginRequest } from '@/features/auth'

// In router
const Auth = lazy(() => import('@/features/auth'))

// In MSW handlers
import type { AuthData, LoginRequest, User } from '@/features/auth'
```

## Files to Remove After Migration

- `src/pages/` (entire directory)
- `src/api/` (entire directory)
- `src/types/auth.ts`
- `src/hooks/useAuth.ts`

## Verification Checklist

- [ ] All imports resolve correctly (TypeScript compiles)
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
| MSW type imports | Explicitly listed in migration steps; update immediately after auth types move |