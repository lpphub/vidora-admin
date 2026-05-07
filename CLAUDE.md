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
- **Data**: SWR, Zustand
- **i18n**: next-intl（cookie-based locale，URL 无 locale 前缀）
- **Forms**: react-hook-form + zod + @hookform/resolvers
- **Charts**: ApexCharts + react-apexcharts
- **Lint**: Biome（非 ESLint/Prettier）

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根 layout（透传，Next.js 强制要求）
│   └── [locale]/                 # i18n 动态路由（proxy rewrite 内部注入）
│       ├── layout.tsx            # RootLayout: <html lang={locale}> + providers
│       ├── page.tsx              # / → redirect /dashboard（兜底）
│       ├── error.tsx
│       ├── not-found.tsx
│       ├── (auth)/               # 路由组：无 sidebar
│       │   └── login/
│       │       ├── page.tsx
│       │       └── _components/
│       └── (app)/                # 路由组：Sidebar + Header 布局
│           ├── layout.tsx        # AppLayout: Sidebar + Header
│           ├── dashboard/
│           │   ├── page.tsx      # Server Component（数据获取 + 翻译）
│           │   ├── DashboardClient.tsx  # Client Component（交互）
│           │   ├── data.ts       # 服务端数据获取函数
│           │   └── types.ts      # 页面类型 + Mock 数据
│           ├── tags/
│           │   ├── page.tsx      # Server Component（只传翻译）
│           │   └── _components/  # TagsClient（useTags 管理数据）
│           ├── profile/
│           │   ├── page.tsx      # Server Component（传初始 user）
│           │   └── _components/  # ProfileClient（useUser 接管）
│           └── system/
│               ├── users/        # types.ts, api.ts, _components/
│               ├── roles/        # types.ts, api.ts, _components/
│               └── permissions/  # types.ts, api.ts, _components/
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
│   ├── messages/                 # 翻译文件（zh/, en/）
│   └── request.ts                # i18n 请求配置（从 cookie 读取 locale）
├── lib/                          # 核心工具
│   ├── http/                     # HTTP 客户端
│   │   ├── bff.ts                # 客户端 BFF（调 /api/*）
│   │   ├── fetch.ts              # 服务端 fetchApi（调 BACKEND_URL/*）
│   │   └── shared.ts             # ApiError + unwrap + CookieSource
│   ├── swr.tsx                   # SWRConfig Provider
│   ├── route-utils.ts            # Route Handler 公共工具
│   ├── constants.ts              # 常量
│   ├── env.ts                    # 环境变量 + BACKEND_URL
│   └── utils.ts                  # cn() 工具
├── stores/                       # Zustand 状态（theme, locale, auth）
├── proxy.ts                      # Proxy（i18n rewrite + auth guard）
└── index.css                     # 全局样式 + CSS 变量
```

Path alias: `@/` → `./src/`

## Routing & i18n

URL 不带 locale 前缀，locale 通过 cookie 存储，proxy 内部 rewrite 注入：

```
用户访问:  /dashboard
Proxy:     cookie locale=zh → rewrite → /zh/dashboard
渲染:      [locale]/layout.tsx → (app)/layout.tsx → dashboard/page.tsx
```

- **proxy.ts**: 读 cookie 获取 locale，rewrite 到 `[locale]` 段；同时处理 auth 鉴权
- **根路径 `/`**: proxy 直接判断 auth → 有 token 跳 `/dashboard`，无 token 跳 `/login`
- **路由组 `(auth)`**: 无 sidebar（登录页）
- **路由组 `(app)`**: 共享 Sidebar + Header 布局
- **LanguageSwitcher**: 设置 `locale` cookie → `window.location.reload()`

## File Colocation Principle

Next.js App Router 遵循**路由同位**原则：

- 页面私有代码（components、data、types）放在路由目录下
- 跨页面共享的代码放在 `hooks/`、`types/`、`components/`、`lib/`

```
✅ app/[locale]/(app)/tags/
   ├── page.tsx                      # 页面入口
   └── _components/                  # 页面私有组件
       ├── TagTable.tsx
       ├── TagFormSheet.tsx
       └── TagSearchBar.tsx

✅ hooks/tag.ts                      # 跨页面共享的 hooks
✅ types/tag.ts                      # 跨页面共享的类型
✅ components/ui/                    # 全局共享 UI 组件

❌ 不要创建 features/ 目录放页面私有代码
```

## Data Fetching Patterns

三种模式，按场景选择：

### 模式 A：Server Component 直接获取

适用于首屏数据 + 翻译，一次请求，无客户端 JS 开销。

```tsx
// page.tsx — Server Component
export default async function DashboardPage() {
  const t = await getTranslations('dashboard')
  const data = await getDashboardData()         // fetchApi 直连后端
  return <DashboardClient data={data} t={t} />
}
```

### 模式 B：Client Component + SWR

适用于需要交互、缓存、自动重新获取的场景。

```tsx
// page.tsx — 只传翻译，不传数据
export default async function TagsPage() {
  const t = await getTranslations('tags')
  return <TagsClient translations={t} />
}

// TagsClient.tsx — 客户端自行管理数据
const { data: tags = [] } = useTags()  // SWR
```

### 模式 C：Server 传初始值 + Client 接管

适用于需要首屏展示 + 后续可修改的数据。

```tsx
// page.tsx
const user = await fetchApi.get<User>('auth/me', await cookies())
return <ProfileClient initialUser={user} translations={t} />

// General.tsx
const { data: user = initialUser } = useUser()  // 用服务端数据初始化缓存
// updateProfile() 成功后 mutate(USER_KEY) → useUser 自动重新获取
```

## API Layer

`src/lib/http/` 提供两个 HTTP 客户端，共享 `shared.ts` 中的 `ApiError` + `unwrap`：

### bff — 客户端调用

浏览器端使用，通过 `/api/*` BFF 代理，cookie 自动携带。

```tsx
import { bff } from '@/lib/http/bff'
bff.get<Tag[]>('tags')
bff.post<Tag>('tags', { name: 'xxx' })
```

### fetchApi — 服务端调用

Server Component / Route Handler 使用，直连后端，从 cookies 提取 token。

```tsx
import { fetchApi } from '@/lib/http/fetch'
import { cookies } from 'next/headers'
const data = await fetchApi.get<DashboardData>('dashboard/stats', await cookies())
```

### 数据流

```
客户端:  bff.get('tags')  → /api/tags → route handler → BACKEND_URL/api/tags → 后端
服务端:  fetchApi.get('tags') → BACKEND_URL/api/tags → 后端（直连，少一跳）
```

## Auth

- **登录**: POST `/api/auth/login` → 后端返回 token → API Route 设置 httpOnly cookie
- **刷新**: POST `/api/auth/refresh` → 用 httpOnly `refreshToken` cookie 换新 `accessToken` cookie
- **登出**: POST `/api/auth/logout` → 调用后端撤销 token + 清除 cookie
- **鉴权**: proxy (`src/proxy.ts`) 检查 `accessToken` cookie，未登录重定向到 `/login`

## Code Style (Biome)

- 单引号，无分号，尾逗号 (ES5)
- 2 空格缩进，100 字符行宽
- `noUnusedImports` 和 `noUnusedVariables` 为 error
- 提交前运行 `pnpm lint:fix`

## Environment Variables

```bash
NEXT_PUBLIC_APP_TITLE=Vidora        # 客户端可见
BACKEND_API_URL=http://localhost:8080 # 仅服务端（无 NEXT_PUBLIC_ 前缀）
ENABLE_MOCKS=true                   # 启用 mock 数据（默认关闭）
```

`BACKEND_URL` 统一从 `@/lib/env` 导入，不在各 Route Handler 中重复声明。

## Adding New Pages

1. 创建路由目录 `src/app/[locale]/(app)/xxx/`
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

  try {
    const res = await fetch(`${BACKEND_URL}/api/xxx`, {
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
// 避免动态拼接 Tailwind 类名（JIT 无法检测）
<div className={`bg-${color}-50`}>  ❌
```
