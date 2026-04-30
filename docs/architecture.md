# Vidora Admin 架构设计 & 数据请求流说明

## 一、整体架构概览

```
src/
├── app/[locale]/           # 路由 + 页面私有代码 (_components/, types.ts, data.ts)
├── components/             # 全局共享 UI 组件
├── hooks/                  # 跨页面共享 hooks (auth.ts, tag.ts, profile.ts)
├── types/                  # 跨页面共享类型 (auth.ts, tag.ts, video.ts)
├── lib/                    # 核心工具 (api.ts, route-utils.ts, env.ts)
├── i18n/                   # next-intl 配置 + 翻译文件
│   ├── messages/           #   zh/*.json, en/*.json
│   ├── request.ts          #   i18n 请求配置
│   └── routing.ts          #   i18n 路由配置
├── stores/                 # Zustand 状态 (theme, locale, auth)
├── index.css               # 全局样式 + CSS 变量
└── proxy.ts                # Next.js middleware (i18n + auth guard)
```

## 二、数据请求流

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          浏览器 (Client)                               │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  Server Component (page.tsx async)                              │    │
│  │                                                                 │    │
│  │  ① getTranslations('namespace')  ──→ next-intl 服务端翻译       │    │
│  │  ② fetchApi.get(url, cookies())  ──→ 直连后端 (少一跳)          │    │
│  │                                                                 │    │
│  │  返回 props 给 Client Component ─────────────────┐              │    │
│  └─────────────────────────────────────────────────┘              │    │
│                                                     ↓              │    │
│  ┌──────────────────────────────────────────────────────────────┐  │    │
│  │  Client Component ('use client')                             │  │    │
│  │                                                              │  │    │
│  │  模式 A: 接收 Server Component 的 props                       │  │    │
│  │    → DashboardClient (纯展示 + useTranslations)              │  │    │
│  │                                                              │  │    │
│  │  模式 B: TanStack Query hooks + bff                          │  │    │
│  │    → useUser()    ─┐                                         │  │    │
│  │    → useTags()    ─┤                                         │  │    │
│  │    → useUpdateProfile() ─┼─→ bff.get/post/put/patch/delete  │  │    │
│  │    → useChangePassword()─┤    ↓                               │  │    │
│  │    → useLogout()   ─┘      fetch('/api/xxx')                  │  │    │
│  │                                   │                           │  │    │
│  └───────────────────────────────────┼───────────────────────────┘  │    │
│                                      │ 浏览器自动携带 cookie        │    │
└──────────────────────────────────────┼──────────────────────────────┘     │
                                       ↓
┌──────────────────────────────────────────────────────────────────────┐
│                  Next.js API Routes (BFF 层)                         │
│                                                                      │
│  /api/auth/login    POST → 后端登录 → 设置 accessToken/refreshToken   │
│                      ↓ (httpOnly, secure, sameSite=lax)              │
│  /api/auth/logout   POST → 后端撤销 → 清除 cookie                    │
│  /api/auth/refresh  POST → 后端刷新 → 更新 cookie                    │
│  /api/auth/me       GET  → 读取 cookie → Authorization header       │
│  /api/dashboard/stats GET → 读取 cookie → Authorization header      │
│  /api/tags/*        CRUD → 读取 cookie → Authorization header        │
│  /api/[...path]     ALL → 条件性 Authorization header              │
│                                                                      │
│  公共逻辑 (lib/route-utils.ts):                                      │
│    getAccessToken(request)  → 从 cookie 提取 token                    │
│    authHeaders(token)       → Content-Type + Bearer header          │
│    unauthorizedResponse()   → 401 标准响应                           │
│    errorResponse(msg, code) → 错误标准响应                             │
│    cookieOptions(isDev)     → httpOnly + secure + sameSite 配置      │
│    clearCookieOptions()     → maxAge=0 清除配置                      │
│                                                                      │
└──────────────────────────────────────┬───────────────────────────────┘
                                       │ Authorization: Bearer <token>
                                       ↓
┌──────────────────────────────────────────────────────────────────────┐
│                     后端 API Server                                   │
│                   (BACKEND_API_URL)                                   │
│                                                                      │
│  /auth/login    /auth/logout    /auth/refresh    /auth/me            │
│  /dashboard/stats   /tags   /tags/:id                              │
│  /profile   /profile/password    ...其他路由                        │
└──────────────────────────────────────────────────────────────────────┘
```

## 三、各页面数据流详解

### 页面 1: `/dashboard` — Server Component 模式 (最佳实践)

```
page.tsx (Server, async)
  │
  ├─ getTranslations('dashboard') ──→ next-intl 服务端翻译
  ├─ getTranslations('common')     ──→ next-intl 服务端翻译
  ├─ getDashboardData()            ──→ data.ts
  │    └─ fetchApi.get('dashboard/stats', await cookies())
  │         └─ fetch(BACKEND_URL/dashboard/stats, { headers: Authorization })
  │              → 直连后端, 无需经过 BFF
  │
  ├─ ICON_MAP 映射: icon string → Lucide 组件 (Server 端完成)
  │
  └─ <DashboardClient stats={} tasks={} translations={} />
       └─ 'use client': 纯展示, useTranslations() 获取 chart/tabs/labels
           零数据请求, 所有数据来自 props
```

### 页面 2: `/tags` — Client Component + TanStack Query

```
page.tsx ('use client')
  │
  └─ useTags()          ──→ TanStack Query ──→ bff.get('tags')
       │                                          │
       │                              fetch('/api/tags') ← 浏览器自动带 cookie
       │                                          │
       │                              Route Handler 提取 accessToken
       │                              → Authorization header → 后端
       │
  └─ useCreateTag()    ──→ bff.post('tags', data) ──→ /api/tags POST
  └─ useUpdateTag()    ──→ bff.put('tags/:id', data) ──→ /api/tags/:id PUT
  └─ useDeleteTag()   ──→ bff.delete('tags/:id') ──→ /api/tags/:id DELETE
                                                     ↓
                                              成功后 invalidateQueries(['tags'])
```

### 页面 3: `/login` — 认证流程

```
page.tsx (Server) → getTranslations('common') → 翻译品牌区域
  │
  └─ <LoginForm /> ('use client')
       └─ bff.post('auth/login', { email, password })
            │
            → fetch('/api/auth/login', { method: 'POST', body })
            │
            → Route Handler:
               生产: fetch(BACKEND_URL/auth/login, ...) → 设置 httpOnly cookie
               开发: mock 返回 → 设置 httpOnly cookie
            │
            → 成功: router.push('/dashboard')
            → 失败: toast.error(t('login.failed'))
```

### 页面 4: `/profile` — Client Component + TanStack Query

```
page.tsx ('use client')
  │
  └─ <General />
       ├─ useUser()          ──→ bff.get('auth/me') ──→ GET /api/auth/me
       ├─ useUpdateProfile() ──→ bff.patch('profile', data)
       │                        成功后 → invalidateQueries(['auth', 'user'])
       └─ useDeleteAccount() ──→ bff.delete('profile')
                                  成功后 → queryClient.clear()
  │
  └─ <Security />
       └─ useChangePassword() ──→ bff.post('profile/password', data)
```

### 页面 5-7: `/system/*` — Mock 数据 (待接入)

```
page.tsx ('use client')
  │
  └─ MOCK_USERS / mockRoles / mockPermissions (直接 import)
  └─ console.log('Save') 提交
  └─ hooks/ 为空 export {}
```

## 四、认证守卫流程

```
浏览器请求 /dashboard
  ↓
Middleware (proxy.ts)
  ├─ /api/* → NextResponse.next() (跳过)
  ├─ next-intl locale detection
  ├─ protectedPaths 检查 accessToken cookie
  │    ├─ 无 token → redirect('/login')
  │    └─ 有 token → NextResponse.next()
  └─ authPaths 检查 accessToken cookie
       ├─ 有 token → redirect('/dashboard')
       └─ 无 token → NextResponse.next()
```

## 五、Token 生命周期

```
登录:
  POST /api/auth/login
  → Route Handler 转发到后端
  → 后端返回 { accessToken, refreshToken, user }
  → Route Handler 设置 httpOnly cookie:
      accessToken  (maxAge: 15min, secure: !dev, sameSite: lax)
      refreshToken (maxAge: 7d,    secure: !dev, sameSite: lax)

刷新:
  POST /api/auth/refresh
  → Route Handler 从 cookie 取 refreshToken
  → 转发到后端 /auth/refresh
  → 成功: 更新两个 cookie
  → 失败: 清除两个 cookie (maxAge: 0)

登出:
  POST /api/auth/logout
  → Route Handler 从 cookie 取 accessToken
  → 调用后端 /auth/logout 撤销 token (best-effort)
  → 清除两个 cookie (maxAge: 0)

鉴权:
  middleware (proxy.ts) 检查 accessToken cookie 存在性
  → 存在: 放行请求
  → 不存在且访问受保护路径: 重定向到 /login
```

## 六、客户端数据层

### TanStack Query Query Keys

```ts
authKeys = { all: ['auth'], user: ['auth', 'user'] }
tagKeys  = { all: ['tags'], list: ['tags', 'list'] }
```

### Zustand Stores

| Store | 状态 | 持久化 | 用途 |
|-------|------|--------|------|
| auth | `user: User \| null` | localStorage (`vidora-auth`) | 缓存用户信息 |
| theme | `themeMode: 'light' \| 'dark'` | localStorage (`vidora-theme`) | 主题切换 |
| locale | `language: 'zh' \| 'en'` | localStorage (`vidora-locale`) | 语言偏好 |

> **注意**: Token 不存储在 Zustand 或 localStorage 中，仅存于 httpOnly cookie。

## 七、i18n 数据流

```
Server Component:
  const t = await getTranslations('namespace')
  → 返回 t() 函数，仅服务端可用，不可序列化传给 Client

Client Component:
  const t = useTranslations('namespace')
  → 通过 NextIntlClientProvider 获取翻译，客户端可用

翻译文件位置: src/i18n/messages/{zh,en}/*.json
命名空间: common, auth, dashboard, sidebar, tags, users, roles, permissions, profile
```