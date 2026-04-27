# Vidora Admin: Vite → Next.js 16 Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Migrate the existing Vite + React 19 SPA to Next.js 16 App Router with BFF layer.

**Architecture:** Next.js 16 App Router + `app/api/` BFF Route Handlers + next-intl i18n + httpOnly cookie auth. Pages use Server Components for initial render, Client Components for interactivity. Feature modules keep TanStack Query hitting BFF endpoints.

**Tech Stack:** Next.js 16.2.2, React 19, TypeScript 5.9, next-intl 4.x, Tailwind CSS v4, shadcn/ui, TanStack Query, Zustand (theme only), Zod, Biome.

---

### Task 1: Create branch and install Next.js 16

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Create branch**

```bash
git checkout -b feat/nextjs16-migration
```

- [ ] **Step 2: Install Next.js 16 and next-intl**

```bash
pnpm add next@^16.2.2 next-intl@^4.0.0
```

Expected: packages installed successfully, no peer dependency conflicts.

- [ ] **Step 3: Update package.json scripts**

Replace current scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check src/",
    "lint:fix": "biome check --write src/",
    "format": "biome format --write src/"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "build: add next 16 and next-intl dependencies"
```

---

### Task 2: Create Next.js config and update TypeScript config

**Files:**
- Create: `next.config.ts`
- Modify: `tsconfig.json`
- Delete: `tsconfig.app.json`, `tsconfig.node.json`

- [ ] **Step 1: Create next.config.ts**

```typescript
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {}

export default withNextIntl(nextConfig)
```

- [ ] **Step 2: Update tsconfig.json**

Replace contents with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "erasableSyntaxOnly": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [{ "name": "next" }],
    "incremental": true
  },
  "include": ["src", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Delete old tsconfig files**

```bash
git rm tsconfig.app.json tsconfig.node.json
```

- [ ] **Step 4: Commit**

```bash
git add next.config.ts tsconfig.json
git commit -m "config: add next config, update tsconfig for app router"
```

---

### Task 3: Update index.css for Next.js

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Update CSS import**

The current file uses `@import "tailwindcss"` which works in Next.js with Tailwind v4. Remove `tw-animate-css` import. Remove the `@custom-variant dark` (Tailwind v4 handles this via `@variant dark` or `@custom-variant`). The CSS variables and theme inline block stay the same.

No changes needed to the actual CSS content — the file structure is already Tailwind v4 compatible. Just ensure the file is clean.

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "style: cleanup CSS for Next.js compatibility"
```

---

### Task 4: Set up next-intl i18n (routing, request, messages)

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/messages/zh/common.json`
- Create: `src/messages/zh/auth.json`
- Create: `src/messages/zh/dashboard.json`
- Create: `src/messages/zh/sidebar.json`
- Create: `src/messages/zh/tags.json`
- Create: `src/messages/zh/users.json`
- Create: `src/messages/zh/roles.json`
- Create: `src/messages/zh/permissions.json`
- Create: `src/messages/zh/profile.json`
- Create: `src/messages/en/common.json`
- Create: `src/messages/en/auth.json`
- Create: `src/messages/en/dashboard.json`
- Create: `src/messages/en/sidebar.json`
- Create: `src/messages/en/tags.json`
- Create: `src/messages/en/users.json`
- Create: `src/messages/en/roles.json`
- Create: `src/messages/en/permissions.json`
- Create: `src/messages/en/profile.json`
- Delete: `src/shared/locales/` (entire directory)

- [ ] **Step 1: Create i18n/routing.ts**

```typescript
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  localePrefix: 'as-needed',
  localeDetection: true,
})
```

- [ ] **Step 2: Create i18n/request.ts**

```typescript
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  const messages = {
    common: (await import(`@/messages/${locale}/common.json`)).default,
    auth: (await import(`@/messages/${locale}/auth.json`)).default,
    dashboard: (await import(`@/messages/${locale}/dashboard.json`)).default,
    sidebar: (await import(`@/messages/${locale}/sidebar.json`)).default,
    tags: (await import(`@/messages/${locale}/tags.json`)).default,
    users: (await import(`@/messages/${locale}/users.json`)).default,
    roles: (await import(`@/messages/${locale}/roles.json`)).default,
    permissions: (await import(`@/messages/${locale}/permissions.json`)).default,
    profile: (await import(`@/messages/${locale}/profile.json`)).default,
  }

  return { locale, messages }
})
```

- [ ] **Step 3: Copy locale JSON files to messages/**

```bash
mkdir -p src/messages/zh src/messages/en
cp src/shared/locales/zh/*.json src/messages/zh/
cp src/shared/locales/en/*.json src/messages/en/
```

- [ ] **Step 4: Remove old i18n init file**

```bash
rm -f src/app/providers/i18n.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/i18n/ src/messages/
git rm src/app/providers/i18n.ts
git rm -r src/shared/locales/
git commit -m "feat: set up next-intl i18n with multi-namespace messages"
```

---

### Task 5: Create proxy.ts (Next.js 16 route guard + i18n detection)

**Files:**
- Create: `src/proxy.ts`
- Delete: `src/app/router/guard.tsx`

- [ ] **Step 1: Create src/proxy.ts**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const protectedPaths = ['/dashboard', '/profile', '/tags', '/system']
const authPaths = ['/login']

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip i18n middleware for /api routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Handle next-intl locale detection + redirect
  const response = intlMiddleware(request)
  if (response.redirected) return response

  // Check authentication from httpOnly cookie
  const accessToken = request.cookies.get('accessToken')?.value
  const isProtected = protectedPaths.some(p => pathname.includes(p))
  const isAuthPage = authPaths.some(p => pathname.includes(p))

  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && accessToken) {
    const dashUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!_next|_vercel|.*\\..*).*)',
}
```

- [ ] **Step 2: Delete old AuthGuard**

```bash
rm -f src/app/router/guard.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/proxy.ts
git commit -m "feat: add proxy.ts with route guard and i18n locale detection"
```

---

### Task 6: Create BFF client (lib/bff.ts)

**Files:**
- Create: `src/lib/bff.ts`
- Delete: `src/lib/api.ts`

- [ ] **Step 1: Create lib/bff.ts**

```typescript
export class ApiError extends Error {
  public code: number
  public response?: unknown

  constructor(code: number, message: string, response?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.response = response
  }
}

async function unwrap<T>(res: Response): Promise<T> {
  const data = await res.json()

  if (data.code !== 0) {
    throw new ApiError(data.code, data.message, data)
  }

  return data.data as T
}

export const bff = {
  get: <T>(url: string) => fetch(`/api/${url}`).then(unwrap<T>),

  post: <T, D = unknown>(url: string, body?: D) =>
    fetch(`/api/${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    }).then(unwrap<T>),

  put: <T, D = unknown>(url: string, body?: D) =>
    fetch(`/api/${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(unwrap<T>),

  patch: <T, D = unknown>(url: string, body?: D) =>
    fetch(`/api/${url}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(unwrap<T>),

  delete: <T>(url: string) =>
    fetch(`/api/${url}`, { method: 'DELETE' }).then(unwrap<T>),
}
```

- [ ] **Step 2: Delete old api.ts**

```bash
rm -f src/lib/api.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/bff.ts
git commit -m "feat: add BFF client (lib/bff.ts) replacing ky-based api.ts"
```

---

### Task 7: Create BFF auth route handlers

**Files:**
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/auth/me/route.ts`

- [ ] **Step 1: Create login route handler**

`src/app/api/auth/login/route.ts`:

```typescript
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:8080'

export async function POST(request: Request) {
  const body = await request.json()

  if (process.env.NODE_ENV === 'development') {
    // Dev mock: simulate successful login
    const { email, password } = body
    if (email === 'admin@vidora.com' && password === 'admin123') {
      const response = Response.json({
        code: 0,
        message: 'success',
        data: {
          user: {
            id: 1,
            username: '管理员',
            email: 'admin@vidora.com',
            role: 'admin',
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      })
      response.cookies.set({
        name: 'accessToken',
        value: 'mock-access-token',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15,
      })
      response.cookies.set({
        name: 'refreshToken',
        value: 'mock-refresh-token',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      return response
    }
    return Response.json({ code: 401, message: '邮箱或密码错误' }, { status: 401 })
  }

  // Production: proxy to real backend
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  const data = await res.json()

  if (data.code !== 0) {
    return Response.json(data, { status: res.status })
  }

  const response = Response.json(data)
  response.cookies.set({
    name: 'accessToken',
    value: data.data.accessToken,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  })
  response.cookies.set({
    name: 'refreshToken',
    value: data.data.refreshToken,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
```

- [ ] **Step 2: Create logout route handler**

`src/app/api/auth/logout/route.ts`:

```typescript
export async function POST() {
  const response = Response.json({ code: 0, message: 'success' })

  response.cookies.set({
    name: 'accessToken',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })
  response.cookies.set({
    name: 'refreshToken',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })

  return response
}
```

- [ ] **Step 3: Create me route handler**

`src/app/api/auth/me/route.ts`:

```typescript
const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:8080'

export async function GET(request: Request) {
  const accessToken = request.cookies.get('accessToken')?.value

  if (!accessToken) {
    return Response.json({ code: 401, message: '未授权' }, { status: 401 })
  }

  if (process.env.NODE_ENV === 'development') {
    return Response.json({
      code: 0,
      message: 'success',
      data: {
        id: 1,
        username: '管理员',
        email: 'admin@vidora.com',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      },
    })
  }

  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await res.json()
  return Response.json(data, { status: res.status })
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/auth/
git commit -m "feat: add BFF auth route handlers (login/logout/me)"
```

---

### Task 8: Create generic BFF proxy and feature route handlers

**Files:**
- Create: `src/app/api/[...path]/route.ts`
- Create: `src/app/api/tags/route.ts`
- Create: `src/app/api/tags/[id]/route.ts`
- Note: Profile/password routes are handled by the generic `[...path]/route.ts`

- [ ] **Step 1: Create generic BFF proxy**

`src/app/api/[...path]/route.ts`:

```typescript
const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:8080'

async function handleProxy(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  const pathname = path.join('/')

  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: null })
  }

  const accessToken = request.cookies.get('accessToken')?.value

  const res = await fetch(`${BACKEND_URL}/${pathname}`, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: request.method !== 'GET' && request.method !== 'DELETE' ? await request.text() : undefined,
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}

export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const PATCH = handleProxy
export const DELETE = handleProxy
```

- [ ] **Step 2: Create tags BFF handlers**

`src/app/api/tags/route.ts`:

```typescript
const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:8080'

const MOCK_TAGS = [
  { id: '1', name: '动作', color: '#ef4444', usageCount: 120, createdAt: '2024-01-15' },
  { id: '2', name: '喜剧', color: '#22c55e', usageCount: 85, createdAt: '2024-01-16' },
  { id: '3', name: '科幻', color: '#3b82f6', usageCount: 64, createdAt: '2024-02-10' },
]

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: MOCK_TAGS })
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const res = await fetch(`${BACKEND_URL}/tags`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return Response.json(await res.json(), { status: res.status })
}

export async function POST(request: Request) {
  const body = await request.json()

  if (process.env.NODE_ENV === 'development') {
    const newTag = { id: String(Date.now()), ...body, usageCount: 0, createdAt: new Date().toISOString().split('T')[0] }
    return Response.json({ code: 0, message: 'success', data: newTag })
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const res = await fetch(`${BACKEND_URL}/tags`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
  })
  return Response.json(await res.json(), { status: res.status })
}
```

`src/app/api/tags/[id]/route.ts`:

```typescript
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: { id, ...body } })
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const res = await fetch(`${BACKEND_URL}/tags/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
  })
  return Response.json(await res.json(), { status: res.status })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: null })
  }

  const accessToken = request.cookies.get('accessToken')?.value
  const res = await fetch(`${BACKEND_URL}/tags/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return Response.json(await res.json(), { status: res.status })
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/[...path]/ src/app/api/tags/
git commit -m "feat: add generic BFF proxy and tags route handlers"
```

---

### Task 9: Create RootLayout and QueryClientProvider

**Files:**
- Create: `src/app/[locale]/layout.tsx`
- Modify: `src/app/providers/queryClient.ts` (move to `src/lib/query-client.tsx`)

- [ ] **Step 1: Move and wrap QueryClientProvider**

`src/lib/query-client.tsx`:

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

- [ ] **Step 2: Create RootLayout**

`src/app/[locale]/layout.tsx`:

```tsx
import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Providers } from '@/lib/query-client'
import { Toaster } from 'sonner'
import '@/index.css'

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
            <Toaster richColors position="top-right" />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/query-client.tsx src/app/[locale]/layout.tsx
git rm src/app/providers/queryClient.ts
git commit -m "feat: add RootLayout with providers (next-intl, QueryClient, Toaster)"
```

---

### Task 10: Create dashboard layout (Sidebar + Header)

**Files:**
- Create: `src/app/[locale]/(dashboard)/layout.tsx`
- Create: `src/app/[locale]/(dashboard)/page.tsx`

- [ ] **Step 1: Create dashboard layout**

`src/app/[locale]/(dashboard)/layout.tsx`:

```tsx
import type { ReactNode } from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Header } from '@/components/layout/Header'
import { AppSidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-auto w-full flex flex-col px-4 sm:px-6 py-4 sm:py-6 md:px-8 mx-auto xl:max-w-7xl overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

- [ ] **Step 2: Create dashboard redirect page**

`src/app/[locale]/(dashboard)/page.tsx`:

```tsx
import { redirect } from 'next/navigation'

export default function DashboardRedirect() {
  redirect('/dashboard')
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/(dashboard)/
git commit -m "feat: add dashboard layout and redirect page"
```

---

### Task 11: Move layout components and update routing imports

**Files:**
- Move: `src/shared/components/layout/Sidebar.tsx` → `src/components/layout/Sidebar.tsx`
- Move: `src/shared/components/layout/Header.tsx` → `src/components/layout/Header.tsx`
- Delete: `src/shared/components/layout/Main.tsx`
- Delete: `src/shared/components/layout/index.tsx`

- [ ] **Step 1: Create directories and move files**

```bash
mkdir -p src/components/layout
cp src/shared/components/layout/Sidebar.tsx src/components/layout/Sidebar.tsx
cp src/shared/components/layout/Header.tsx src/components/layout/Header.tsx
```

- [ ] **Step 2: Update Sidebar.tsx imports**

Replace `react-router-dom` imports with Next.js equivalents:

```typescript
// Before
import { Link, useLocation } from 'react-router-dom'

// After
import Link from 'next/link'
import { usePathname } from 'next/navigation'
```

Replace `useLocation()` usage:

```typescript
// In AppSidebar component
const pathname = usePathname()
// Remove: const location = useLocation()
// Pass pathname instead of location to NavItemComponent
```

Update NavItemComponent calls: change `location={location}` to `pathname={pathname}` and update the component prop type accordingly.

- [ ] **Step 3: Update Header.tsx imports**

Replace `react-router-dom` imports with Next.js equivalents (Header doesn't use direct routing imports currently, so verify it stays clean).

- [ ] **Step 4: Delete old layout files**

```bash
rm -f src/shared/components/layout/Main.tsx
rm -f src/shared/components/layout/index.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/
git rm -r src/shared/components/layout/
git commit -m "refactor: move layout components, update routing to next/navigation"
```

---

### Task 12: Move and update shared components

**Files:**
- Move: `src/shared/components/UserDropdown.tsx` → `src/components/UserDropdown.tsx`
- Move: `src/shared/components/ThemeToggle.tsx` → `src/components/ThemeToggle.tsx`
- Move: `src/shared/components/LanguageSwitcher.tsx` → `src/components/LanguageSwitcher.tsx`
- Move: `src/shared/components/NavBreadcrumb.tsx` → `src/components/NavBreadcrumb.tsx`
- Move: `src/shared/components/ConfirmDialog.tsx` → `src/components/ConfirmDialog.tsx`
- Move: `src/shared/components/chart/` → `src/components/chart/`
- Move: `src/shared/components/ui/` → `src/components/ui/`

- [ ] **Step 1: Move all shared component directories**

```bash
mkdir -p src/components
cp -r src/shared/components/ui src/components/ui
cp -r src/shared/components/chart src/components/chart
cp src/shared/components/UserDropdown.tsx src/components/UserDropdown.tsx
cp src/shared/components/ThemeToggle.tsx src/components/ThemeToggle.tsx
cp src/shared/components/LanguageSwitcher.tsx src/components/LanguageSwitcher.tsx
cp src/shared/components/NavBreadcrumb.tsx src/components/NavBreadcrumb.tsx
cp src/shared/components/ConfirmDialog.tsx src/components/ConfirmDialog.tsx
```

- [ ] **Step 2: Update UserDropdown.tsx**

Replace `react-router-dom` with `next/navigation`:

```typescript
// Before
import { useNavigate } from 'react-router-dom'

// After
import { useRouter } from 'next/navigation'
```

Replace `useNavigate()` usage:

```typescript
// Before
const navigate = useNavigate()
navigate('/login')

// After
const router = useRouter()
router.push('/login')
```

Replace logout logic: instead of clearing Zustand auth store, call the BFF logout endpoint:

```typescript
// Before
const handleLogout = () => {
  logout()
  navigate('/login')
}

// After
const handleLogout = async () => {
  await fetch('/api/auth/logout', { method: 'POST' })
  router.push('/login')
}
```

Remove the `useAuthStore` import; get user info from a cookie or from server component props. For now, since this is a client component that needs the user info for display, we'll use a simple approach — store user info in a non-sensitive way:

For the UserDropdown, we can pass `user` as a prop from a parent server component, or use a lightweight client store that syncs on login. Simplest approach: read from a non-httpOnly cookie set alongside the httpOnly one.

Actually, the simplest approach for MVP: keep a minimal user store that gets set on login. Add a simple `useUserStore` that stores only non-sensitive user display info (username, email, role):

`src/stores/user.ts`:

```typescript
import { create } from 'zustand'

interface UserInfo {
  id: number
  username: string
  email: string
  role: string
  avatar?: string
}

interface UserState {
  user: UserInfo | null
  setUser: (user: UserInfo | null) => void
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user }),
}))
```

Then in the login form, after a successful login, also store user info:

```typescript
const data = await res.json()
useUserStore.getState().setUser(data.data.user)
```

In the `me` route handler, in login flow. Actually this is getting complex. Let me simplify:

For the initial migration, the UserDropdown will use a simpler approach — fetch user from `/api/auth/me` on mount:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserDropdown() {
  const t = useTranslations('common')
  const router = useRouter()
  const [user, setUser] = useState<{ username: string; email: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => { if (data.code === 0) setUser(data.data) })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const userInitial = user?.username?.charAt(0).toUpperCase() || null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-7 w-7'>
            <AvatarFallback className='bg-emerald-500 text-white font-medium'>
              {userInitial || <User size={14} />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-48' align='end'>
        <div className='flex items-center gap-2 p-2'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='bg-emerald-500 text-white font-medium'>
              {userInitial || <User size={14} />}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col items-start'>
            <div className='text-sm font-medium'>{user?.username || t('user.defaultName')}</div>
            <div className='text-xs text-gray-500'>{user?.email || ''}</div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <Settings size={16} className='mr-2' />
          {t('user.settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className='text-red-500'>
          <LogOut size={16} className='mr-2' />
          {t('user.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 3: Update NavBreadcrumb.tsx**

Replace `react-router-dom` imports:

```typescript
// Before
import { Link, useMatches } from 'react-router-dom'

// After
import Link from 'next/link'
import { usePathname } from 'next/navigation'
```

Replace `useMatches()` with `usePathname()` and build breadcrumb data from pathname:

```typescript
// Before
const matches = useMatches()
// ... filter matches to build breadcrumbs

// After
const pathname = usePathname()
// Build breadcrumbs from pathname segments
```

The `NavBreadcrumb` component needs significant rework since it depends on `useMatches()` which provides route handle data. Replace with pathname-based breadcrumb generation:

```typescript
'use client'

import { ChevronDown } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NAVIGATION_CONFIG } from '@/components/layout/Sidebar'

// Walk nav config to find breadcrumb path given current pathname
function findBreadcrumbPath(pathname: string): Array<{ key: string; title: string }> {
  for (const group of NAVIGATION_CONFIG) {
    for (const item of group.items) {
      if (item.path === pathname) return [{ key: item.path, title: item.title }]
      if (item.children) {
        const child = item.children.find(c => pathname === c.path)
        if (child) return [{ key: item.path, title: item.title }, { key: child.path, title: child.title }]
      }
    }
  }
  return []
}

export function NavBreadcrumb() {
  const t = useTranslations('sidebar')
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    // Remove locale prefix from pathname for matching
    const pathParts = pathname.split('/').filter(Boolean)
    const cleanPath = pathParts.length > 1 ? '/' + pathParts.slice(1).join('/') : '/'
    return findBreadcrumbPath(cleanPath)
  }, [pathname])

  if (breadcrumbs.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <span key={item.key} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{t(item.title)}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.key}>{t(item.title)}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

- [ ] **Step 4: Update LanguageSwitcher.tsx**

Replace `react-i18next` with `next-intl`:

```typescript
'use client'

import { Globe } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const supportedLanguages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleLanguageChange = (lang: string) => {
    startTransition(() => {
      // Replace locale prefix in pathname
      const newPath = pathname.replace(`/${locale}`, `/${lang}`)
      router.replace(newPath)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full' disabled={isPending}>
          <Globe size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center'>
        {supportedLanguages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={locale === lang.code ? 'bg-accent' : ''}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 5: Update ThemeToggle imports**

```typescript
// Before
import { useThemeMode, useToggleTheme } from '@/shared/stores/theme'

// After
import { useThemeMode, useToggleTheme } from '@/stores/theme'
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ src/stores/
git rm -r src/shared/components/
git commit -m "refactor: move and update shared components for Next.js"
```

---

### Task 13: Create error pages

**Files:**
- Create: `src/app/[locale]/not-found.tsx`
- Create: `src/app/[locale]/error.tsx`

- [ ] **Step 1: Create not-found.tsx**

```tsx
import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className='min-h-svh flex items-center justify-center bg-background p-4'>
      <div className='relative w-full max-w-md'>
        <div className='absolute inset-0 -z-10 overflow-hidden'>
          <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl' />
          <div className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl' />
        </div>
        <div className='text-center space-y-8'>
          <div className='relative'>
            <span className='text-[10rem] font-bold leading-none select-none bg-linear-to-br from-primary/30 via-primary/20 to-transparent bg-clip-text text-transparent dark:from-primary/20 dark:via-primary/10'>
              404
            </span>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='p-4 rounded-full bg-primary/10 text-primary dark:bg-primary/20'>
                <SearchX size={48} strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            <h1 className='text-2xl font-semibold text-foreground'>页面不存在</h1>
            <p className='text-muted-foreground max-w-sm mx-auto'>
              抱歉，您访问的页面不存在或已被移除。请检查网址是否正确。
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Link href='/dashboard'>
              <Button size='lg'>返回首页</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create error.tsx**

```tsx
'use client'

import { ServerCrash } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='min-h-svh flex items-center justify-center bg-background p-4'>
      <div className='relative w-full max-w-md'>
        <div className='absolute inset-0 -z-10 overflow-hidden'>
          <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-destructive/10 blur-3xl' />
          <div className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-destructive/5 blur-3xl' />
        </div>
        <div className='text-center space-y-8'>
          <div className='relative'>
            <span className='text-[10rem] font-bold leading-none select-none bg-linear-to-br from-destructive/30 via-destructive/20 to-transparent bg-clip-text text-transparent dark:from-destructive/20 dark:via-destructive/10'>
              500
            </span>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='p-4 rounded-full bg-destructive/10 text-destructive dark:bg-destructive/20'>
                <ServerCrash size={48} strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            <h1 className='text-2xl font-semibold text-foreground'>服务器错误</h1>
            <p className='text-muted-foreground max-w-sm mx-auto'>
              抱歉，服务器遇到了问题。请稍后重试或联系管理员。
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Button onClick={reset} size='lg'>刷新页面</Button>
            <Link href='/dashboard'>
              <Button variant='outline' size='lg'>返回首页</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/not-found.tsx src/app/[locale]/error.tsx
git commit -m "feat: add error pages (404 not-found, 500 error boundary)"
```

---

### Task 14: Create login page

**Files:**
- Create: `src/app/[locale]/(auth)/login/page.tsx`
- Create: `src/app/[locale]/(auth)/login/_components/login-form.tsx`
- Delete: `src/features/auth/components/LoginProvider.tsx` (merge state into form)

- [ ] **Step 1: Create login page (Server Component)**

`src/app/[locale]/(auth)/login/page.tsx`:

```tsx
import { ThemeToggle } from '@/components/ThemeToggle'
import { LoginForm } from './_components/login-form'

export default function LoginPage() {
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
            <LoginForm />
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
```

- [ ] **Step 2: Create login form (Client Component)**

`src/app/[locale]/(auth)/login/_components/login-form.tsx`:

```typescript
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export function LoginForm() {
  const t = useTranslations('auth')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const loginSchema = z.object({
    email: z.string().min(1, t('login.emailRequired')),
    password: z.string().min(1, t('login.passwordRequired')),
  })

  type LoginFormValues = z.infer<typeof loginSchema>

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (data.code !== 0) {
        toast.error(data.message || t('login.failed'))
        return
      }
      router.push('/dashboard')
      toast.success(t('login.success'))
    } catch {
      toast.error(t('login.failed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <h1 className='text-2xl font-bold'>{t('login.title')}</h1>
            <p className='text-balance text-sm text-muted-foreground'>{t('login.subtitle')}</p>
          </div>

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('login.email')}</FormLabel>
                <FormControl>
                  <Input type='email' placeholder={t('login.emailPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('login.password')}</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('login.passwordPlaceholder')}
                      {...field}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4 text-muted-foreground' />
                      ) : (
                        <Eye className='h-4 w-4 text-muted-foreground' />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading && <Loader2 className='animate-spin mr-2' />}
            {t('login.submit')}
          </Button>
        </form>
      </Form>
    </div>
  )
}
```

Note: the RegisterForm and ResetForm are removed for MVP since they are not core to the admin panel migration. They can be re-added later if needed.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/(auth)/
git commit -m "feat: add login page with BFF-based authentication"
```

---

### Task 15: Migrate feature hooks from ky/api to BFF fetch

**Files:**
- Modify: `src/features/auth/hooks/index.ts`
- Modify: `src/features/tag/hooks/index.ts` and `useTag.ts`
- Modify: `src/features/profile/hooks/index.ts`
- Delete: `src/features/auth/api.ts`
- Delete: `src/features/tag/api.ts`
- Delete: `src/features/profile/api.ts`

- [ ] **Step 1: Update auth hooks**

`src/features/auth/hooks/index.ts`:

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bff } from '@/lib/bff'
import type { User } from '@/features/auth/types'

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

export function useUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => bff.get<User>('auth/me'),
    retry: false,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => fetch('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
```

- [ ] **Step 2: Update tag hooks**

Merge `src/features/tag/hooks/useTag.ts` into `src/features/tag/hooks/index.ts`:

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bff } from '@/lib/bff'
import type { Tag, TagType } from '@/features/tag/types'

export const tagKeys = {
  all: ['tags'] as const,
  list: (type?: TagType) => [...tagKeys.all, 'list', type] as const,
}

export function useTags(type?: TagType) {
  return useQuery({
    queryKey: tagKeys.list(type),
    queryFn: () => bff.get<Tag[]>('tags'),
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Tag>) => bff.post<Tag>('tags', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tagKeys.all }),
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tag> }) =>
      bff.put<Tag>(`tags/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tagKeys.all }),
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bff.delete(`tags/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tagKeys.all }),
  })
}
```

Delete `src/features/tag/hooks/useTag.ts`.

- [ ] **Step 3: Update profile hooks**

```typescript
import { useMutation } from '@tanstack/react-query'
import { bff } from '@/lib/bff'
import type { User } from '@/features/auth/types'

export interface UpdateProfileReq {
  username: string
  about?: string
}

export interface ChangePasswordReq {
  oldPassword: string
  newPassword: string
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: UpdateProfileReq) => bff.patch<User>('profile', data),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordReq) => bff.post<void>('profile/password', data),
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => bff.delete<void>('profile'),
  })
}
```

- [ ] **Step 4: Delete old API files**

```bash
rm -f src/features/auth/api.ts
rm -f src/features/tag/api.ts
rm -f src/features/profile/api.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/features/
git commit -m "refactor: update feature hooks to use BFF, remove old API files"
```

---

### Task 16: Migrate Dashboard page

**Files:**
- Create: `src/app/[locale]/(dashboard)/dashboard/page.tsx` (copied from `src/pages/Dashboard.tsx`)

- [ ] **Step 1: Copy and adapt Dashboard page**

```bash
cp src/pages/Dashboard.tsx src/app/[locale]/(dashboard)/dashboard/page.tsx
```

- [ ] **Step 2: Update Dashboard page**

Add `'use client'` directive at top (since it uses useState, useTranslation, chart components):

```typescript
'use client'
```

Replace imports:

```typescript
// Before
import { useTranslation } from 'react-i18next'
import { Chart, useChart } from '@/shared/components/chart'
// ... other imports

// After
import { useTranslations } from 'next-intl'
import { Chart, useChart } from '@/components/chart'
```

Replace `useTranslation('dashboard')` with `useTranslations('dashboard')`:

```typescript
// Before
const { t } = useTranslation('dashboard')

// After
const t = useTranslations('dashboard')
```

Update imports for chart and other moved components:

```typescript
// Before
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Progress } from '@/shared/components/ui/progress'

// After
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/(dashboard)/dashboard/page.tsx
git commit -m "feat: migrate Dashboard page to Next.js"
```

---

### Task 17: Migrate remaining pages and remove old pages

**Files:**
- Create: `src/app/[locale]/(dashboard)/profile/page.tsx`
- Create: `src/app/[locale]/(dashboard)/tags/page.tsx`
- Create: `src/app/[locale]/(dashboard)/system/users/page.tsx`
- Create: `src/app/[locale]/(dashboard)/system/roles/page.tsx`
- Create: `src/app/[locale]/(dashboard)/system/permissions/page.tsx`
- Delete: `src/pages/` (entire directory)

- [ ] **Step 1: Copy and adapt Tags page**

```bash
cp src/pages/Tags.tsx src/app/[locale]/(dashboard)/tags/page.tsx
```

Update imports in Tags page:

```typescript
'use client'  // Add at top

// Replace:
import { useTranslation } from 'react-i18next'
import { TagFormSheet, TagSearchBar, TagTable } from '@/features/tag'
import { useCreateTag, useDeleteTag, useTags, useUpdateTag } from '@/features/tag/hooks/useTag'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

// With:
import { useTranslations } from 'next-intl'
import { TagFormSheet, TagSearchBar, TagTable } from '@/features/tag'
import { useCreateTag, useDeleteTag, useTags, useUpdateTag } from '@/features/tag/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
```

Replace `useTranslation('tags')` with `useTranslations('tags')`.

- [ ] **Step 2: Copy and adapt Profile page**

```bash
cp src/pages/Profile.tsx src/app/[locale]/(dashboard)/profile/page.tsx
```

Update imports:

```typescript
'use client'

// Replace:
import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'

// With:
import { useTranslations } from 'next-intl'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
```

Replace `useTranslation('profile')` with `useTranslations('profile')`.

- [ ] **Step 3: Copy and adapt system pages**

```bash
cp src/pages/system/Users.tsx src/app/[locale]/(dashboard)/system/users/page.tsx
cp src/pages/system/Roles.tsx src/app/[locale]/(dashboard)/system/roles/page.tsx
cp src/pages/system/Permissions.tsx src/app/[locale]/(dashboard)/system/permissions/page.tsx
```

For each page:
1. Add `'use client'` at top
2. Replace `useTranslation('ns')` with `useTranslations('ns')`
3. Replace `@/shared/components/` imports with `@/components/`

- [ ] **Step 4: Remove old pages directory**

```bash
rm -rf src/pages/
```

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/(dashboard)/profile/ src/app/[locale]/(dashboard)/tags/ src/app/[locale]/(dashboard)/system/
git commit -m "feat: migrate profile, tags, system pages to Next.js"
```

---

### Task 18: Move shared utilities (hooks, stores, utils)

**Files:**
- Move: `src/shared/hooks/` → `src/hooks/`
- Move: `src/shared/stores/` → `src/stores/`
- Move: `src/shared/utils/` → `src/lib/`
- Delete: `src/shared/` (remaining)

- [ ] **Step 1: Move shared directories**

```bash
mkdir -p src/hooks src/stores
cp -r src/shared/hooks/* src/hooks/
cp -r src/shared/stores/* src/stores/
cp -r src/shared/utils/* src/lib/
```

- [ ] **Step 2: Clean up and remove old shared directory**

```bash
rm -rf src/shared/
```

- [ ] **Step 3: Update all remaining import paths**

Files that still reference `@/shared/` need updating. Find them:

```bash
grep -r "from '@/shared/" src/ --include="*.ts" --include="*.tsx"
```

Expected remaining references (from profile components):

```typescript
// Update these imports to use @/hooks/ and @/stores/ and @/components/
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/ src/stores/ src/lib/
git commit -m "refactor: move shared utilities to top-level directories"
```

---

### Task 19: Remove old entry files and verify build

**Files:**
- Delete: `src/main.tsx`
- Delete: `src/App.tsx`
- Delete: `src/app/App.tsx` (if exists)
- Delete: `src/app/router/index.tsx`
- Delete: `src/vite-env.d.ts`
- Delete: `src/mocks/` (entire directory)
- Delete: `src/shared/`
- Delete: `index.html`
- Delete: `vite.config.ts`
- Delete: `components.json` (shadcn config for old setup — keep if shadcn still references it)

- [ ] **Step 1: Remove all old entry and config files**

```bash
rm -f src/main.tsx src/App.tsx src/app/App.tsx src/app/router/index.tsx src/vite-env.d.ts
rm -f index.html vite.config.ts
rm -rf src/mocks/
```

- [ ] **Step 2: Run dev server and check for errors**

```bash
pnpm dev
```

Expected: Next.js starts, pages render. Fix any import path issues found.

Common issues to fix:
- `@/shared/components/` → `@/components/` in any remaining imports
- `@/shared/hooks/` → `@/hooks/`
- `@/shared/stores/` → `@/stores/`
- `@/lib/api` → `@/lib/bff`
- `react-router-dom` → `next/navigation` or `next/link`

- [ ] **Step 3: Run build to verify**

```bash
pnpm build
```

Expected: successful build with no TypeScript or import errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "cleanup: remove legacy Vite/routing/i18n code, verify build"
```

---

### Task 20: Final cleanup and linting

**Files:**
- Modify: `biome.json` (verify config for Next.js)

- [ ] **Step 1: Remove unused dependencies from package.json**

```bash
pnpm remove react-router-dom vite @vitejs/plugin-react @tailwindcss/vite ky i18next react-i18next i18next-browser-languagedetector msw tw-animate-css react-dropzone
```

- [ ] **Step 2: Run lint and fix**

```bash
pnpm lint:fix
```

- [ ] **Step 3: Run format**

```bash
pnpm format
```

- [ ] **Step 4: Final build verification**

```bash
pnpm build
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove unused deps, run lint and format"
```

---

## Spec Coverage Check

- ✅ **Next.js 16 App Router**: Tasks 1-2 (config), Task 14-17 (pages)
- ✅ **BFF Layer (Route Handlers)**: Tasks 7-8
- ✅ **httpOnly cookie auth**: Tasks 5, 7
- ✅ **next-intl i18n**: Task 4
- ✅ **Mixed Server/Client Components**: Tasks 9, 14, 16-17
- ✅ **Proxy.ts route guard**: Task 5
- ✅ **Dev mocking in BFF**: Tasks 7-8
- ✅ **Remove MSW**: Task 19
- ✅ **Remove Zustand auth/locale stores**: Task 12, 18
- ✅ **shadcn/ui unchanged**: Tasks 12, 16-17 (import path updates only)
- ✅ **Biome lint retained**: Task 20
- ✅ **Remove old Vite/router/i18n code**: Tasks 19
