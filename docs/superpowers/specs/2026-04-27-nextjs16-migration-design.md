# Vidora Admin: Vite → Next.js 16 Migration Design

## Overview

Migrate the existing Vite + React 19 SPA to Next.js 16 App Router with BFF layer, following Next.js best practices.

## Architecture

```
Browser
  │
  ├─▶ Next.js 16 Server
  │     ├─▶ proxy.ts            (route guard + i18n locale detection)
  │     ├─▶ app/[locale]/       (Server Components + Client Components)
  │     └─▶ app/api/             (BFF Route Handlers)
  │           │
  │           └─▶ Backend API   (Java/Go)
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Next.js version | 16.2.2 | Latest stable |
| BFF layer | Route Handlers (`app/api/`) | Native Next.js pattern, httpOnly cookie management |
| Authentication | httpOnly cookie + proxy.ts | Security best practice, no JS access to tokens |
| i18n | next-intl (3.x) | SSR-native, replaces i18next entirely |
| Data fetching | Server Components + TanStack Query | Mix: initial data via SC, mutations via RQ |
| State management | Zustand (theme only) | Auth/locale removed — handled by cookie + next-intl |
| Dev mocking | BFF inline mock | Removes MSW dependency, consistent with BFF pattern |
| Routing | file-system App Router | Replaces react-router-dom entirely |
| UI framework | shadcn/ui v4 (radix-ui) | Unchanged, pure UI components |
| Styling | Tailwind CSS v4 | Unchanged, minor config migration |
| Linting | Biome | Unchanged |

## Directory Structure

```
vidora-admin/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx           # RootLayout (html, providers)
│   │   │   ├── not-found.tsx         # 404
│   │   │   ├── error.tsx             # 500 error boundary
│   │   │   ├── (auth)/
│   │   │   │   └── login/
│   │   │   │       ├── page.tsx
│   │   │   │       └── _components/login-form.tsx
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx        # Sidebar + Header layout
│   │   │       ├── page.tsx          # / → /dashboard redirect
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── profile/page.tsx
│   │   │       ├── tags/page.tsx
│   │   │       └── system/
│   │   │           ├── users/page.tsx
│   │   │           ├── roles/page.tsx
│   │   │           └── permissions/page.tsx
│   │   └── api/                      # BFF Route Handlers
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   └── me/route.ts
│   │       ├── tags/
│   │       │   ├── route.ts
│   │       │   └── [id]/route.ts
│   │       ├── profile/
│   │       │   ├── route.ts
│   │       │   └── password/route.ts
│   │       └── [...path]/route.ts     # Generic BFF proxy
│   ├── proxy.ts                       # Route guard + i18n detection
│   ├── i18n/
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── messages/                      # Translation JSON files
│   ├── components/                    # Shared UI components
│   │   ├── ui/                        # shadcn/ui primitives
│   │   ├── layout/                    # Sidebar, Header
│   │   └── ...                        # ThemeToggle, Breadcrumb, etc.
│   ├── features/                      # Feature modules (unchanged pattern)
│   │   ├── auth/                      # Types only (hooks → useAuth store removed)
│   │   ├── tag/
│   │   ├── profile/
│   │   ├── video/
│   │   └── system/
│   │       ├── users/
│   │       ├── roles/
│   │       └── permissions/
│   ├── hooks/                         # Shared hooks (from shared/hooks)
│   ├── stores/                        # Zustand: theme only
│   ├── lib/
│   │   ├── bff.ts                     # Client-side BFF fetch wrapper
│   │   ├── utils.ts                   # cn() — unchanged
│   │   └── constants.ts
│   └── index.css                      # Tailwind v4 + CSS variables
├── next.config.ts
├── package.json
├── biome.json
└── tsconfig.json
```

## Component Mapping

### Routing & Layout
| Current (Vite) | Next.js 16 Replacement |
|---------------|----------------------|
| `src/main.tsx` | Deleted — Next.js handles entry |
| `index.html` | Deleted |
| `src/App.tsx` | `app/[locale]/layout.tsx` |
| `src/app/router/index.tsx` | File-system routes |
| `src/app/router/guard.tsx` | `src/proxy.ts` |
| `src/pages/base/ErrorPage.tsx` | `not-found.tsx`, `error.tsx` |
| `src/pages/base/SkeletonPage.tsx` | `components/SkeletonPage.tsx` |
| `src/shared/components/layout/index.tsx` | `app/[locale]/(dashboard)/layout.tsx` |
| `src/shared/components/layout/Main.tsx` | Merged into layout (`{children}`) |
| `react-router-dom` Link/useNavigate | `next/link`, `next/navigation` useRouter |

### Auth & Data
| Current | Replacement |
|---------|-------------|
| `src/lib/api.ts` (ky) | `lib/bff.ts` (native fetch) |
| `src/shared/stores/auth.ts` | Deleted — httpOnly cookie + proxy.ts |
| Zustand auth store | Replaced by BFF session management |
| `features/*/api.ts` (ky calls) | Deleted — replaced by BFF Route Handlers |
| `features/*/hooks/index.ts` | Retained — TanStack Query targets BFF endpoints |
| `src/shared/stores/locale.ts` | Deleted — next-intl manages locale |

### i18n
| Current | Replacement |
|---------|-------------|
| `i18next` + `react-i18next` + `i18next-browser-languagedetector` | `next-intl` |
| `src/app/providers/i18n.ts` | `i18n/request.ts` + `i18n/routing.ts` |
| `src/shared/locales/` | `messages/{locale}/` |
| `useTranslation('ns')` | `useTranslations('ns')` |
| `t('key')` | Same API, unchanged component code |

### Client State & UI
| Current | Replacement |
|---------|-------------|
| `src/shared/stores/theme.ts` | `stores/theme.ts` (unchanged) |
| shadcn/ui components | Unchanged |
| Chart components | Unchanged |
| `cn()` utility | Unchanged |
| `LanguageSwitcher.tsx` | Rewritten with next-intl API |
| `UserDropdown.tsx` | Updated for cookie-based auth, next/navigation |

## Dependency Changes

### Added (2)
```json
{
  "next": "^16.2.2",
  "next-intl": "^4.0.0"
}
```

### Removed (15)
```json
{
  "react-router-dom": "",
  "vite": "",
  "@vitejs/plugin-react": "",
  "@tailwindcss/vite": "",
  "ky": "",
  "i18next": "",
  "react-i18next": "",
  "i18next-browser-languagedetector": "",
  "msw": "",
  "@types/node": "",
  "tw-animate-css": "",
  "react-dropzone": ""
}
```

### Retained (18)
```json
{
  "react": "^19", "@types/react": "",
  "react-dom": "^19", "@types/react-dom": "",
  "typescript": "~5.9",
  "@tanstack/react-query": "",
  "zustand": "",
  "react-hook-form": "",
  "@hookform/resolvers": "",
  "zod": "^4",
  "radix-ui": "",
  "lucide-react": "",
  "sonner": "",
  "clsx": "",
  "tailwind-merge": "",
  "class-variance-authority": "",
  "apexcharts": "",
  "react-apexcharts": "",
  "@biomejs/biome": ""
}
```

## BFF Design

### Core Architecture
- All API calls from frontend go through `app/api/` Route Handlers
- Generic `[...path]/route.ts` catches unmatched paths and proxies to backend
- Auth-specific handlers manage cookie-based token lifecycle
- Token stored in httpOnly, secure, sameSite cookies — JS cannot access

### BFF Responsibilities
1. Token injection: read from request cookie, attach to backend calls
2. 401 refresh: intercept 401 from backend, refresh token, retry
3. Data aggregation: combine multiple backend calls if needed
4. Error normalization: standardize error format
5. Dev mocking: in development, return mock data directly

### Authentication Flow
```
Login:  Client → POST /api/auth/login → BFF → Backend
        Backend → BFF → set httpOnly cookie → Client

Page:   Browser → proxy.ts → check cookie
        Valid   → render page
        Expired → BFF auto-refresh → render
        Missing → redirect /login

Logout: Client → POST /api/auth/logout → BFF → clear cookie
```

## i18n Design

### Configuration
- `next-intl` with `localePrefix: 'as-needed'` (zh/dashboard, en/dashboard)
- Default locale: `zh`
- Locale detection via `proxy.ts` (next-intl middleware)
- Translation files split by namespace (common, auth, dashboard, etc.)

### Migration from i18next
- JSON file keys stay identical — only the import mechanism changes
- `useTranslation('ns')` → `useTranslations('ns')` — identical t() usage
- Namespace merging happens in `i18n/request.ts`

## Mock Strategy

Development environment: BFF Route Handlers return mock data directly based on `NODE_ENV`.
Production: BFF proxies to real backend.

This removes MSW dependency entirely while keeping all existing mock data reusable.

## What Gets Removed (Summary)

| Category | Items |
|----------|-------|
| **Build tools** | Vite, @vitejs/plugin-react, @tailwindcss/vite, vite.config.ts, index.html, vite-env.d.ts |
| **Routing** | react-router-dom, router/index.tsx, guard.tsx, useLocation, useNavigate, useMatches, Outlet |
| **HTTP** | ky, lib/api.ts, features/*/api.ts |
| **i18n** | i18next, react-i18next, i18next-browser-languagedetector, providers/i18n.ts, stores/locale.ts |
| **Auth** | stores/auth.ts (Zustand), client-side token management |
| **Layout** | Main.tsx (children replaces Outlet) |
| **Mock** | msw, browser.ts, db.ts, handlers/, mockServiceWorker.js |
| **Config** | tsconfig.app.json, tsconfig.node.json |
