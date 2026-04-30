# CLAUDE.md

## Overview

Vidora Admin — 视频内容管理后台，基于 Next.js 16 App Router + TypeScript。

## Commands

```bash
pnpm dev        # 开发服务
pnpm build      # 生产构建
pnpm start      # 启动生产服务
pnpm lint       # Biome 检查
pnpm lint:fix   # Biome 自动修复
pnpm format     # Biome 格式化
```

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript 5.9
- **UI**: React 19, shadcn/ui v4 (radix-lyra), Tailwind CSS 4
- **Radix**: 统一 `radix-ui` 包（非 `@radix-ui/react-*`）
- **Data**: TanStack Query, Zustand
- **i18n**: next-intl（Server + Client 统一）
- **Forms**: react-hook-form + zod + @hookform/resolvers
- **Charts**: ApexCharts + react-apexcharts
- **Lint**: Biome（非 ESLint/Prettier）

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   └── [locale]/                 # i18n 动态路由
│       ├── (auth)/login/          # 登录（route group）
│       │   └── _components/     # 页面私有组件
│       ├── (dashboard)/           # 后台页面（route group）
│       │   ├── dashboard/
│       │   │   ├── page.tsx       # Server Component（数据获取 + 翻译）
│       │   │   ├── DashboardClient.tsx  # Client Component（交互）
│       │   │   ├── data.ts       # 服务端数据获取函数
│       │   │   └── types.ts      # 页面类型 + Mock 数据
│       │   ├── tags/
│       │   │   ├── page.tsx
│       │   │   └── _components/  # 页面私有组件（TagTable 等）
│       │   ├── profile/
│       │   │   ├── page.tsx
│       │   │   └── _components/  # General, Security
│       │   └── system/
│       │       ├── users/        # types.ts, api.ts, _components/
│       │       ├── roles/        # types.ts, api.ts, _components/
│       │       └── permissions/  # types.ts, api.ts, _components/
│       ├── layout.tsx            # 根 layout（providers）
│       ├── error.tsx
│       └── not-found.tsx
├── api/                          # BFF Route Handlers
│   ├── auth/                     # 登录、登出、刷新 token、获取用户
│   ├── dashboard/stats/          # Dashboard 统计数据
│   ├── tags/                     # 标签 CRUD
│   └── [...path]/                # 全量代理（fallback）
├── components/                   # 全局共享组件
│   ├── ui/                       # shadcn/ui 原子组件（勿手动编辑）
│   ├── layout/                   # 布局组件（Header, Sidebar）
│   ├── chart/                    # 图表组件
│   └── *.tsx                     # 通用组件（ConfirmDialog, ThemeToggle 等）
├── hooks/                        # 全局共享 hooks
│   ├── auth.ts                   # useUser, useLogout
│   ├── tag.ts                    # useTags, useCreateTag, useUpdateTag, useDeleteTag
│   ├── profile.ts                # useUpdateProfile, useChangePassword, useDeleteAccount
│   ├── useMediaQuery.ts
│   ├── usePagination.ts
│   └── useUpload.ts
├── types/                        # 全局共享类型
│   ├── auth.ts                   # User, LoginReq, AuthResp
│   ├── tag.ts                    # Tag, PRESET_COLORS
│   └── video.ts                  # Video, Season, Episode 等
├── i18n/                         # next-intl 配置
│   ├── messages/                # 翻译文件（zh/, en/）
│   ├── request.ts               # i18n 请求配置
│   └── routing.ts               # i18n 路由配置
├── lib/                          # 核心工具
│   ├── api.ts                    # bff（客户端）+ fetchApi（服务端）
│   ├── route-utils.ts            # Route Handler 公共工具（token 提取、错误处理、cookie 配置）
│   ├── constants.ts              # 常量
│   ├── env.ts                    # 环境变量 + BACKEND_URL
│   ├── logger.ts                 # 日志
│   ├── query-client.tsx          # TanStack Query Provider
│   ├── storage.ts                # localStorage 封装
│   └── utils.ts                  # cn() 工具
├── stores/                       # Zustand 状态（theme, locale, auth）
├── index.css                     # 全局样式 + CSS 变量
└── proxy.ts                      # Next.js middleware（i18n + auth guard）
```

Path alias: `@/` → `./src/`

## File Colocation Principle

Next.js App Router 遵循**路由同位**原则：

- 页面私有代码（components、data、types、mock）放在路由目录下
- 跨页面共享的代码放在 `hooks/`、`types/`、`components/`、`lib/`

```
✅ app/[locale]/(dashboard)/tags/
   ├── page.tsx                      # 页面入口
   ├── _components/                 # 页面私有组件
   │   ├── TagTable.tsx
   │   ├── TagFormSheet.tsx
   │   └── TagSearchBar.tsx
   └── (types.ts 如需要)

✅ hooks/tag.ts                     # 跨页面共享的 hooks
✅ types/tag.ts                     # 跨页面共享的类型
✅ components/ui/                   # 全局共享 UI 组件

❌ 不要创建 features/ 目录放页面私有代码
```

## Server & Client Components

遵循 Next.js App Router 最佳实践：

| 场景 | 方案 |
|------|------|
| 数据获取 + 翻译 | **Server Component**（`page.tsx`，默认） |
| 交互（useState, useEffect, 事件） | **Client Component**（`'use client'`） |
| API 调用（TanStack Query） | **Client Component** 中的 hooks |

### 页面组成模式

```tsx
// page.tsx — Server Component（async）
export default async function DashboardPage() {
  const data = await getDashboardData()          // 服务端数据获取
  const t = await getTranslations('dashboard')   // 服务端翻译
  return <DashboardClient data={data} t={t} />   // 传给 Client Component
}
```

## API Layer

`src/lib/api.ts` 提供两个 HTTP 客户端：

### bff — 客户端调用

浏览器端使用，通过 `/api/*` 代理，cookie 自动携带。

```tsx
// Client Component hooks
import { bff } from '@/lib/api'
bff.get<Tag[]>('tags')
bff.post<Tag>('tags', { name: 'xxx' })
```

### fetchApi — 服务端调用

Server Component / Route Handler 使用，直连后端，从 cookies 提取 token 放入 `Authorization` header。

```tsx
// Server Component
import { fetchApi } from '@/lib/api'
import { cookies } from 'next/headers'
const data = await fetchApi.get('/dashboard/stats', await cookies())
```

### 数据流

```
浏览器 ──(cookie 自动带)──→ /api/* ──(从 cookie 取 token → Auth header)──→ 后端
                                                               ↑
Server Component ──fetchApi(cookies())──→ 后端（直连，少一跳）
```

### Route Handler 公共工具

`src/lib/route-utils.ts` 提供统一工具：

```tsx
import { getAccessToken, authHeaders, unauthorizedResponse, errorResponse, cookieOptions, clearCookieOptions } from '@/lib/route-utils'
```

## Auth

- **登录**: POST `/api/auth/login` → 后端返回 token → API Route 设置 httpOnly cookie
- **刷新**: POST `/api/auth/refresh` → 用 httpOnly `refreshToken` cookie 换新 `accessToken` cookie
- **登出**: POST `/api/auth/logout` → 调用后端撤销 token + 清除 cookie
- **鉴权**: middleware (`src/proxy.ts`) 检查 `accessToken` cookie
- **Zustand auth store**: 仅缓存 `user` 信息，不存 token（token 只存在于 httpOnly cookie）

## i18n

- 统一使用 **next-intl**
- Server Component: `getTranslations('namespace')` (from `next-intl/server`)
- Client Component: `useTranslations('namespace')`
- 翻译文件: `src/i18n/messages/{locale}/*.json`
- **禁止**硬编码中文字符串，**禁止**使用 `react-i18next` 或 `i18next`

## Code Style (Biome)

- 单引号，无分号，尾逗号 (ES5)
- 2 空格缩进，100 字符行宽
- `noUnusedImports` 和 `noUnusedVariables` 为 error
- 提交前运行 `pnpm lint:fix`

## Environment Variables

```bash
NEXT_PUBLIC_APP_TITLE=Vidora        # 客户端可见
BACKEND_API_URL=http://localhost:8080 # 仅服务端（无 NEXT_PUBLIC_ 前缀）
```

`BACKEND_URL` 统一从 `@/lib/env` 导入，不在各 Route Handler 中重复声明。

## Deployment (Docker)

```bash
docker compose up -d          # 启动
docker compose build --no-cache  # 重新构建
```

环境变量通过 `docker-compose.yml` 或 `.env` 配置：

- `BACKEND_API_URL`：服务端 BFF 代理后端地址
- `NEXT_PUBLIC_APP_TITLE`：客户端可见标题（构建时注入）

## Adding New Pages

1. 创建路由目录 `src/app/[locale]/(dashboard)/xxx/`
2. 创建 `page.tsx`（Server Component）+ `_components/XxxClient.tsx`（Client Component）
3. 如需服务端数据获取，创建 `data.ts`
4. 页面私有类型和 Mock 数据放路由目录下的 `types.ts`
5. 需要代理的后端接口创建 `src/app/api/xxx/route.ts`（使用 `route-utils.ts` 的公共工具）
6. 跨页面共享的 hooks 放 `src/hooks/xxx.ts`
7. 跨页面共享的类型放 `src/types/xxx.ts`
8. 导航项添加到 `src/components/layout/Sidebar.tsx`
9. 翻译添加到 `src/i18n/messages/zh/` 和 `src/i18n/messages/en/`

## Adding New API Routes

```typescript
// src/app/api/xxx/route.ts
import type { NextRequest } from 'next/server'
import { BACKEND_URL } from '@/lib/env'
import { authHeaders, errorResponse, getAccessToken, unauthorizedResponse } from '@/lib/route-utils'

export async function GET(request: NextRequest) {
  const accessToken = getAccessToken(request)
  if (!accessToken) return unauthorizedResponse()

  if (process.env.NODE_ENV === 'development') {
    return Response.json({ code: 0, message: 'success', data: [] })
  }

  try {
    const res = await fetch(`${BACKEND_URL}/xxx`, {
      headers: authHeaders(accessToken),
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return errorResponse('Internal server error', 500)
  }
}
```

## Component Guidelines

### shadcn/ui

```bash
npx shadcn@latest add <component>
npx shadcn@latest add <component> --overwrite
```

Imports from `'radix-ui'`（非 `@radix-ui/react-*`），勿手动编辑 `src/components/ui/`。

### 样式

```tsx
import { cn } from '@/lib/utils'
<div className={cn('base', condition && 'conditional', className)} />

// 用语义色（theme-aware）
<span className="text-muted-foreground">
// 避免硬编码颜色
<span className="text-gray-500">  ❌
```

### CVA 变体

```tsx
const variants = cva('base-classes', {
  variants: { variant: { default: '...', outline: '...' } },
  defaultVariants: { variant: 'default' },
})
```