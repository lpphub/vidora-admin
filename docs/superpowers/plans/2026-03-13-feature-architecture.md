# Feature-Based Architecture Refactoring Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor vidora-admin from layered architecture to feature-based architecture.

**Architecture:** Move API/types/hooks/stores into feature directories. Each feature exports its public API via `index.ts`. Pages become `page.tsx` with re-export via `index.ts` for lazy loading. Shared components remain centralized.

**Tech Stack:** React 19, TypeScript, Vite 7, TanStack Query, Zustand, shadcn/ui

---

## Chunk 1: Core Infrastructure

### Task 1: Move API Client to lib

**Files:**
- Create: `src/lib/api.ts`
- Modify: `src/hooks/useUpload.ts:3`
- Delete: `src/api/index.ts`, `src/api/auth.ts` (moved in Task 2)

- [ ] **Step 1: Move api/index.ts to lib/api.ts**

Run: `mv src/api/index.ts src/lib/api.ts`

**Note:** Keep the existing `import { useAuthStore } from '@/stores/auth'` for now. This will be updated in Task 9 after auth store is moved.

- [ ] **Step 2: Update import in useUpload.ts**

File: `src/hooks/useUpload.ts`

```typescript
// Change this line:
import { apiClient } from '@/api'
// To:
import { apiClient } from '@/lib/api'
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `pnpm build`
Expected: Build succeeds (may have errors for auth imports - that's OK for now)

- [ ] **Step 4: Commit**

```bash
git add src/lib/api.ts src/hooks/useUpload.ts
git rm src/api/index.ts
git commit -m "refactor: move API client to lib/api.ts

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Create features directory structure

**Files:**
- Create: `src/features/` directory

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p src/features/{auth/{components,hooks},dashboard,profile/components,users,roles,permissions,categories,tags,video}
```

- [ ] **Step 2: Commit**

```bash
git add src/features
git commit -m "refactor: create features directory structure

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Chunk 2: Auth Feature Migration

### Task 3: Move auth types

**Files:**
- Create: `src/features/auth/types.ts`
- Delete: `src/types/auth.ts`

- [ ] **Step 1: Create features/auth/types.ts**

Copy content from `src/types/auth.ts` to `src/features/auth/types.ts`:

```typescript
// src/features/auth/types.ts
// 用户类型
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt?: string
}

// 登录请求
export interface LoginRequest {
  email: string
  password: string
}

// 认证数据
export interface AuthData {
  user: User
  accessToken: string
  refreshToken: string
}
```

- [ ] **Step 2: Update MSW db.ts import**

File: `src/mocks/db.ts:1`

```typescript
// Change:
import type { User } from '@/types/auth'
// To:
import type { User } from '@/features/auth/types'
```

- [ ] **Step 3: Update MSW handlers/auth.ts import**

File: `src/mocks/handlers/auth.ts:3`

```typescript
// Change:
import type { AuthData, LoginRequest, User } from '@/types/auth'
// To:
import type { AuthData, LoginRequest, User } from '@/features/auth/types'
```

- [ ] **Step 4: Delete old types file**

Run: `rm src/types/auth.ts`

- [ ] **Step 5: Commit**

```bash
git add src/features/auth/types.ts src/mocks/db.ts src/mocks/handlers/auth.ts
git rm src/types/auth.ts
git commit -m "refactor(auth): move auth types to features/auth/types.ts

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Move auth store

**Files:**
- Create: `src/features/auth/store.ts`
- Modify: `src/lib/api.ts:3` (update import to use new store location)
- Delete: `src/stores/auth.ts`

- [ ] **Step 1: Create features/auth/store.ts**

Copy content from `src/stores/auth.ts` with updated import:

```typescript
// src/features/auth/store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StorageKey } from '@/lib/constants'
import type { User } from './types'

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setTokens: (accessToken: string | null, refreshToken?: string | null) => void
  login: (user: User, accessToken: string, refreshToken?: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setUser: user => set({ user, isAuthenticated: !!user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken: refreshToken ?? null }),
      login: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken: refreshToken ?? null, isAuthenticated: true }),
      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: StorageKey.Auth,
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
```

- [ ] **Step 2: Update lib/api.ts import (CRITICAL)**

**IMPORTANT:** This must be done BEFORE deleting the old store to prevent build failures.

File: `src/lib/api.ts`

```typescript
// Change:
import { useAuthStore } from '@/stores/auth'
// To:
import { useAuthStore } from '@/features/auth/store'
```

- [ ] **Step 3: Delete old store file**

Run: `rm src/stores/auth.ts`

- [ ] **Step 4: Commit**

```bash
git add src/features/auth/store.ts src/lib/api.ts
git rm src/stores/auth.ts
git commit -m "refactor(auth): move auth store to features/auth/store.ts

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Move auth API

**Files:**
- Create: `src/features/auth/api.ts`
- Delete: `src/api/auth.ts`

- [ ] **Step 1: Create features/auth/api.ts**

**Note:** `@/lib/api` is available because Task 1 moved the API client.

```typescript
// src/features/auth/api.ts
import type { AuthData, LoginRequest, User } from './types'
import api from '@/lib/api'

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthData>('auth/login', data),
  logout: () => api.post<void>('auth/logout'),
  me: () => api.get<User>('auth/me'),
}
```

- [ ] **Step 2: Delete old API file**

Run: `rm src/api/auth.ts`

- [ ] **Step 3: Commit**

```bash
git add src/features/auth/api.ts
git rm src/api/auth.ts
git commit -m "refactor(auth): move auth API to features/auth/api.ts

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Move auth hooks

**Files:**
- Create: `src/features/auth/hooks/index.ts`
- Delete: `src/hooks/useAuth.ts`

- [ ] **Step 1: Create features/auth/hooks/index.ts**

```typescript
// src/features/auth/hooks/index.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api'
import { useAuthStore } from '../store'
import type { LoginRequest, User } from '../types'

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

// 核心 hook
export function useAuth() {
  const user = useAuthStore(s => s.user)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const storeLogin = useAuthStore(s => s.login)
  const storeLogout = useAuthStore(s => s.logout)

  return {
    user,
    isAuthenticated,
    login: (data: { user: User; accessToken: string; refreshToken: string }) => {
      storeLogin(data.user, data.accessToken, data.refreshToken)
    },
    logout: storeLogout,
  }
}

// 登录 hook
export function useLogin() {
  const { login } = useAuth()
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: data => login(data),
  })
}

// 登出 hook
export function useLogout() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
  })
}

// 获取当前用户 hook
export function useUser() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authApi.me(),
    enabled: isAuthenticated,
  })
}
```

- [ ] **Step 2: Delete old hooks file**

Run: `rm src/hooks/useAuth.ts`

- [ ] **Step 3: Commit**

```bash
git add src/features/auth/hooks/index.ts
git rm src/hooks/useAuth.ts
git commit -m "refactor(auth): move auth hooks to features/auth/hooks/

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 7: Move auth components

**Files:**
- Create: `src/features/auth/components/LoginForm.tsx`
- Create: `src/features/auth/components/RegisterForm.tsx`
- Create: `src/features/auth/components/ResetForm.tsx`
- Create: `src/features/auth/components/ReturnButton.tsx`
- Create: `src/features/auth/components/LoginProvider.tsx`
- Delete: `src/pages/auth/LoginForm.tsx`
- Delete: `src/pages/auth/RegisterForm.tsx`
- Delete: `src/pages/auth/ResetForm.tsx`
- Delete: `src/pages/auth/components/ReturnButton.tsx`
- Delete: `src/pages/auth/providers/LoginProvider.tsx`

- [ ] **Step 1: Move LoginForm.tsx with updated imports**

Read `src/pages/auth/LoginForm.tsx`, update the import:

```typescript
// Change:
import { useLogin } from '@/hooks/useAuth'
// To:
import { useLogin } from '../hooks'
```

Write to `src/features/auth/components/LoginForm.tsx`.

- [ ] **Step 2: Move RegisterForm.tsx (no auth imports)**

Copy `src/pages/auth/RegisterForm.tsx` to `src/features/auth/components/RegisterForm.tsx` (no changes needed).

- [ ] **Step 3: Move ResetForm.tsx (no auth imports)**

Copy `src/pages/auth/ResetForm.tsx` to `src/features/auth/components/ResetForm.tsx` (no changes needed).

- [ ] **Step 4: Move ReturnButton.tsx (no auth imports)**

Copy `src/pages/auth/components/ReturnButton.tsx` to `src/features/auth/components/ReturnButton.tsx` (no changes needed).

- [ ] **Step 5: Move LoginProvider.tsx (no auth imports)**

Copy `src/pages/auth/providers/LoginProvider.tsx` to `src/features/auth/components/LoginProvider.tsx` (no changes needed).

- [ ] **Step 6: Delete old component files**

```bash
rm src/pages/auth/LoginForm.tsx
rm src/pages/auth/RegisterForm.tsx
rm src/pages/auth/ResetForm.tsx
rm src/pages/auth/components/ReturnButton.tsx
rm src/pages/auth/providers/LoginProvider.tsx
rmdir src/pages/auth/components src/pages/auth/providers 2>/dev/null || true
```

- [ ] **Step 7: Commit**

```bash
git add src/features/auth/components/
git rm -r src/pages/auth/LoginForm.tsx src/pages/auth/RegisterForm.tsx src/pages/auth/ResetForm.tsx src/pages/auth/components/ src/pages/auth/providers/
git commit -m "refactor(auth): move auth components to features/auth/components/

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 8: Create auth page and index

**Files:**
- Create: `src/features/auth/page.tsx`
- Create: `src/features/auth/index.ts`
- Delete: `src/pages/auth/index.tsx`

- [ ] **Step 1: Create features/auth/page.tsx**

Read `src/pages/auth/index.tsx`, update imports:

```typescript
// src/features/auth/page.tsx
import { Navigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { useAuthStore } from './store'
import LoginForm from './components/LoginForm'
import { LoginProvider } from './components/LoginProvider'
import RegisterForm from './components/RegisterForm'
import ResetForm from './components/ResetForm'

function LoginPage() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />
  }

  return (
    <div className='relative grid min-h-svh lg:grid-cols-2 bg-background'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-between gap-2'>
          <div className='flex items-center gap-2 font-medium cursor-pointer'>
            <span className='text-xl font-bold text-primary'>Vidora Admin</span>
          </div>
          <ThemeToggle />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <LoginProvider>
              <LoginForm />
              <RegisterForm />
              <ResetForm />
            </LoginProvider>
          </div>
        </div>
      </div>

      <div className='relative hidden bg-linear-to-br from-primary/20 to-primary/5 lg:flex items-center justify-center'>
        <div className='text-center space-y-4 p-8'>
          <h2 className='text-3xl font-bold text-foreground'>视频管理</h2>
          <p className='text-muted-foreground'>高效管理您的视频内容、分类和用户</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
```

- [ ] **Step 2: Create features/auth/index.ts**

```typescript
// src/features/auth/index.ts
// Default export for lazy loading
export { default } from './page'

// Named exports
export { useAuthStore } from './store'
export { authApi } from './api'
export { useAuth, useLogin, useLogout, useUser } from './hooks'
export type { User, LoginRequest, AuthData } from './types'
```

- [ ] **Step 3: Delete old page**

Run: `rm src/pages/auth/index.tsx && rmdir src/pages/auth 2>/dev/null || true`

- [ ] **Step 4: Commit**

```bash
git add src/features/auth/page.tsx src/features/auth/index.ts
git rm src/pages/auth/index.tsx
git commit -m "refactor(auth): create auth feature page and index exports

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 9: Update external auth consumers

**Files:**
- Modify: `src/router/guard.tsx:2`
- Modify: `src/components/common/UserDropdown.tsx:13`
- Modify: `src/pages/profile/General.tsx:11`

**Note:** `src/lib/api.ts` was already updated in Task 4.

- [ ] **Step 1: Update router/guard.tsx import**

```typescript
// Change:
import { useAuth } from '@/hooks/useAuth'
// To:
import { useAuth } from '@/features/auth'
```

- [ ] **Step 2: Update components/common/UserDropdown.tsx import**

```typescript
// Change:
import { useAuthStore } from '@/stores/auth'
// To:
import { useAuthStore } from '@/features/auth'
```

- [ ] **Step 3: Update pages/profile/General.tsx import**

```typescript
// Change:
import { useAuthStore } from '@/stores/auth'
// To:
import { useAuthStore } from '@/features/auth'
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/router/guard.tsx src/components/common/UserDropdown.tsx src/pages/profile/General.tsx
git commit -m "refactor: update auth imports to use features/auth

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 10: Update router imports (CRITICAL - do before deleting pages)

**Files:**
- Modify: `src/router/index.tsx`

**IMPORTANT:** This task MUST be completed BEFORE any page deletions (Tasks 11+). Router uses lazy loading, so old page paths must remain valid until router is updated.

- [ ] **Step 1: Update all lazy imports**

File: `src/router/index.tsx`

```typescript
// Change all lazy imports:
// Before:
const Auth = lazy(() => import('@/pages/auth'))
const Categories = lazy(() => import('@/pages/categories'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const Profile = lazy(() => import('@/pages/profile'))
const Permissions = lazy(() => import('@/pages/system/permissions'))
const Roles = lazy(() => import('@/pages/system/roles'))
const Users = lazy(() => import('@/pages/system/users'))
const Tags = lazy(() => import('@/pages/tags'))

// After:
const Auth = lazy(() => import('@/features/auth'))
const Categories = lazy(() => import('@/features/categories'))
const Dashboard = lazy(() => import('@/features/dashboard'))
const Profile = lazy(() => import('@/features/profile'))
const Permissions = lazy(() => import('@/features/permissions'))
const Roles = lazy(() => import('@/features/roles'))
const Users = lazy(() => import('@/features/users'))
const Tags = lazy(() => import('@/features/tags'))
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm build`
Expected: Build succeeds (both old pages and new features exist)

- [ ] **Step 3: Commit**

```bash
git add src/router/index.tsx
git commit -m "refactor(router): update imports to use features directory

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Chunk 3: System Features (Users, Roles, Permissions)

### Task 11: Migrate users feature

**Files:**
- Create: `src/features/users/page.tsx`
- Create: `src/features/users/index.ts`
- Delete: `src/pages/system/users/index.tsx`

- [ ] **Step 1: Create features/users/page.tsx**

Copy content from `src/pages/system/users/index.tsx` to `src/features/users/page.tsx` (no import changes needed).

- [ ] **Step 2: Create features/users/index.ts**

```typescript
// src/features/users/index.ts
export { default } from './page'
```

- [ ] **Step 3: Delete old page**

Run: `rm -r src/pages/system/users`

- [ ] **Step 4: Commit**

```bash
git add src/features/users/
git rm -r src/pages/system/users
git commit -m "refactor(users): migrate users to features/users

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 12: Migrate roles feature

**Files:**
- Create: `src/features/roles/page.tsx`
- Create: `src/features/roles/index.ts`
- Delete: `src/pages/system/roles/index.tsx`

- [ ] **Step 1: Create features/roles/page.tsx**

Copy content from `src/pages/system/roles/index.tsx` to `src/features/roles/page.tsx` (no import changes needed).

- [ ] **Step 2: Create features/roles/index.ts**

```typescript
// src/features/roles/index.ts
export { default } from './page'
```

- [ ] **Step 3: Delete old page**

Run: `rm -r src/pages/system/roles`

- [ ] **Step 4: Commit**

```bash
git add src/features/roles/
git rm -r src/pages/system/roles
git commit -m "refactor(roles): migrate roles to features/roles

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 13: Migrate permissions feature

**Files:**
- Create: `src/features/permissions/page.tsx`
- Create: `src/features/permissions/index.ts`
- Delete: `src/pages/system/permissions/index.tsx`

- [ ] **Step 1: Create features/permissions/page.tsx**

Copy content from `src/pages/system/permissions/index.tsx` to `src/features/permissions/page.tsx` (no import changes needed).

- [ ] **Step 2: Create features/permissions/index.ts**

```typescript
// src/features/permissions/index.ts
export { default } from './page'
```

- [ ] **Step 3: Delete old page and system directory**

Run: `rm -r src/pages/system/permissions && rmdir src/pages/system`

- [ ] **Step 4: Commit**

```bash
git add src/features/permissions/
git rm -r src/pages/system
git commit -m "refactor(permissions): migrate permissions to features/permissions

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Chunk 4: Other Features (Dashboard, Profile, Categories, Tags, Video)

### Task 14: Migrate dashboard feature

**Files:**
- Create: `src/features/dashboard/page.tsx`
- Create: `src/features/dashboard/index.ts`
- Delete: `src/pages/dashboard/index.tsx`

- [ ] **Step 1: Create features/dashboard/page.tsx**

Copy content from `src/pages/dashboard/index.tsx` to `src/features/dashboard/page.tsx` (no import changes needed).

- [ ] **Step 2: Create features/dashboard/index.ts**

```typescript
// src/features/dashboard/index.ts
export { default } from './page'
```

- [ ] **Step 3: Delete old page**

Run: `rm -r src/pages/dashboard`

- [ ] **Step 4: Commit**

```bash
git add src/features/dashboard/
git rm -r src/pages/dashboard
git commit -m "refactor(dashboard): migrate dashboard to features/dashboard

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 15: Migrate profile feature

**Files:**
- Create: `src/features/profile/page.tsx`
- Create: `src/features/profile/index.ts`
- Create: `src/features/profile/components/General.tsx`
- Create: `src/features/profile/components/Security.tsx`
- Delete: `src/pages/profile/`

- [ ] **Step 1: Create features/profile/page.tsx**

Copy content from `src/pages/profile/index.tsx` to `src/features/profile/page.tsx` (no import changes needed).

- [ ] **Step 2: Copy General.tsx**

Copy `src/pages/profile/General.tsx` to `src/features/profile/components/General.tsx` (import already updated in Task 9, no changes needed).

- [ ] **Step 3: Copy Security.tsx**

Copy `src/pages/profile/Security.tsx` to `src/features/profile/components/Security.tsx` (no import changes needed).

- [ ] **Step 4: Create features/profile/index.ts**

```typescript
// src/features/profile/index.ts
export { default } from './page'
```

- [ ] **Step 5: Delete old profile directory**

Run: `rm -r src/pages/profile`

- [ ] **Step 6: Commit**

```bash
git add src/features/profile/
git rm -r src/pages/profile
git commit -m "refactor(profile): migrate profile to features/profile

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 16: Migrate categories feature

**Files:**
- Create: `src/features/categories/page.tsx`
- Create: `src/features/categories/index.ts`
- Delete: `src/pages/categories/index.tsx`

- [ ] **Step 1: Create features/categories/page.tsx**

Copy content from `src/pages/categories/index.tsx` to `src/features/categories/page.tsx` (no import changes needed).

- [ ] **Step 2: Create features/categories/index.ts**

```typescript
// src/features/categories/index.ts
export { default } from './page'
```

- [ ] **Step 3: Delete old page**

Run: `rm -r src/pages/categories`

- [ ] **Step 4: Commit**

```bash
git add src/features/categories/
git rm -r src/pages/categories
git commit -m "refactor(categories): migrate categories to features/categories

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 17: Migrate tags feature

**Files:**
- Create: `src/features/tags/page.tsx`
- Create: `src/features/tags/index.ts`
- Delete: `src/pages/tags/index.tsx`

- [ ] **Step 1: Create features/tags/page.tsx**

Copy content from `src/pages/tags/index.tsx` to `src/features/tags/page.tsx` (no import changes needed).

- [ ] **Step 2: Create features/tags/index.ts**

```typescript
// src/features/tags/index.ts
export { default } from './page'
```

- [ ] **Step 3: Delete old page**

Run: `rm -r src/pages/tags`

- [ ] **Step 4: Commit**

```bash
git add src/features/tags/
git rm -r src/pages/tags
git commit -m "refactor(tags): migrate tags to features/tags

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 18: Migrate video types

**Files:**
- Create: `src/features/video/types.ts`
- Create: `src/features/video/index.ts`
- Delete: `src/pages/video/types.ts`

- [ ] **Step 1: Create features/video/types.ts**

Copy content from `src/pages/video/types.ts` to `src/features/video/types.ts` (no import changes needed).

- [ ] **Step 2: Create features/video/index.ts**

```typescript
// src/features/video/index.ts
export type { Video, Season, Episode, TranscodingTask, UploadFile, VideoType, VideoStatus } from './types'
```

- [ ] **Step 3: Delete old video directory**

Run: `rm -r src/pages/video && rmdir src/pages 2>/dev/null || true`

- [ ] **Step 4: Commit**

```bash
git add src/features/video/
git rm -r src/pages/video
git commit -m "refactor(video): migrate video types to features/video

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Chunk 5: Cleanup and Verification

### Task 19: Remove empty directories and files

**Files:**
- Delete: `src/api/` directory
- Delete: `src/pages/` directory (if still exists)

- [ ] **Step 1: Remove empty api directory**

```bash
rmdir src/api 2>/dev/null || rm -rf src/api
```

- [ ] **Step 2: Remove empty pages directory**

```bash
rmdir src/pages 2>/dev/null || rm -rf src/pages
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor: remove empty pages and api directories

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 20: Final verification

- [ ] **Step 1: Run lint check**

Run: `pnpm lint`
Expected: No errors

- [ ] **Step 2: Run build**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Start dev server**

Run: `pnpm dev`
Expected: Server starts without errors

- [ ] **Step 4: Manual verification**

Open browser to `http://localhost:5173` and verify:
- Login page loads
- Can log in with test credentials
- Dashboard loads after login
- Navigation between pages works
- Logout works

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "refactor: complete feature-based architecture migration

- Move auth module to features/auth
- Move users/roles/permissions to features
- Move dashboard/profile/categories/tags to features
- Move video types to features/video
- Update all imports to use features directory
- Remove empty pages and api directories

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Chunk 1 | 1-2 | Core infrastructure (API client, features directory) |
| Chunk 2 | 3-10 | Auth feature migration + router update |
| Chunk 3 | 11-13 | System features (users, roles, permissions) |
| Chunk 4 | 14-18 | Other features (dashboard, profile, categories, tags, video) |
| Chunk 5 | 19-20 | Cleanup and verification |

**Total Tasks:** 20
**Estimated Time:** 1-2 hours