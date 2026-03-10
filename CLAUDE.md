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
- **Routing**: React Router v7
- **Forms**: react-hook-form + zod + @hookform/resolvers
- **Linting**: Biome (not ESLint/Prettier)

## Architecture

Path alias: `@/` → `./src/`

### Layered API Pattern

```
API Layer (src/api/*.ts) → Hooks Layer (src/hooks/*.ts) → Components
```

- **API Layer**: ky instance with hooks (auth token injection, 401 refresh, response unwrapping). Exports API object with typed methods.
- **Hooks Layer**: TanStack Query wrappers (`useQuery`, `useMutation`) with caching and error handling.
- **Stores Layer**: Zustand stores for global state (auth, etc.) with persist middleware.

### API Call Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         调用链路                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Page/Component                                                  │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────┐    封装请求逻辑     ┌─────────────┐             │
│  │   Hooks     │ ◄────────────────── │    API      │             │
│  │ (useQuery)  │                     │  (ky实例)   │             │
│  └─────────────┘                     └─────────────┘             │
│       │                                     │                    │
│       │ 自动处理                            │ hooks：             │
│       │ - 缓存                              │ - 添加Token         │
│       │ - 加载状态                          │ - 401刷新Token      │
│       │ - 错误处理                          │ - 响应解包          │
│       ▼                                     ▼                    │
│  ┌─────────────┐                     ┌─────────────┐             │
│  │   Store     │                     │  Backend    │             │
│  │ (Zustand)   │                     │   Server    │             │
│  └─────────────┘                     └─────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

| 层级 | 文件位置 | 职责 |
|------|----------|------|
| **API 层** | `src/api/*.ts` | 定义接口地址、请求参数类型、返回类型 |
| **Hooks 层** | `src/hooks/*.ts` | 封装 TanStack Query，处理缓存、状态、错误 |
| **Store 层** | `src/stores/*.ts` | 管理全局状态（如用户登录态） |

### Component Organization

- `src/components/ui/` - shadcn/ui primitives (do not edit directly - use `npx shadcn@latest add <component>`)
- `src/components/common/` - Reusable components (ConfirmDialog, StatusBadge, AppBreadcrumb, etc.)
- `src/components/layout/` - Layout components (Header, Sidebar, Main)

### Adding UI Components

```bash
npx shadcn@latest add <component>   # Add a new shadcn component
npx shadcn@latest add <component> --overwrite  # Overwrite existing component
```

Note: shadcn v4 uses the unified `radix-ui` package with "radix-lyra" style. Components import from `'radix-ui'` rather than individual `@radix-ui/react-*` packages.

### Key Files

- `src/api/index.ts` - ky instance with request/response hooks (token injection, 401 refresh with singleFlight)
- `src/stores/auth.ts` - Auth state with persist middleware (localStorage key: `vidora-auth`)
- `src/lib/query.ts` - TanStack Query client config (5min staleTime)
- `src/mocks/` - MSW handlers for development API mocking

## Environment Variables

```bash
VITE_API_BASE_URL=/api       # Backend API base URL
VITE_ENABLE_PROXY=true       # Enable Vite proxy to localhost:8080
```

## Adding New API Endpoints

1. Define types in `src/types/`
2. Create API object in `src/api/` (e.g., `export const fooApi = { list: () => api.get(...) }`)
3. Create hook in `src/hooks/` using `useQuery` or `useMutation`
4. Use hook in component

## Notes

- MSW starts automatically in dev mode (`src/mocks/browser.ts`)
- Auth tokens stored in Zustand with localStorage persistence
- 401 responses trigger automatic token refresh with singleFlight pattern; refresh failure triggers logout