# Vidora Admin

视频内容管理后台系统

## 技术栈

- **构建**: Vite 7 (Rolldown) + TypeScript 5.9
- **UI**: React 19, shadcn/ui v4 (radix-lyra 风格), Tailwind CSS 4
- **数据**: TanStack Query, Zustand
- **HTTP**: ky (轻量级 fetch 封装)
- **路由**: React Router v7 (懒加载)
- **表单**: react-hook-form + zod
- **国际化**: i18next + react-i18next
- **代码规范**: Biome

## 项目结构

```
src/
├── app/                    # 应用
│   ├── router/             # 路由配置（懒加载）
│   └── providers/          # React Providers
├── pages/                  # 页面组件（路由入口）
├── features/               # 业务功能模块
│   ├── auth/              # 认证
│   │   ├── api.ts        # API 接口
│   │   ├── types.ts      # 类型定义
│   │   ├── hooks/        # TanStack Query hooks
│   │   └── components/   # 业务组件
│   ├── video/            # 视频
│   ├── transcoding/      # 转码
│   ├── tag/              # 标签
│   ├── profile/          # 个人设置
│   └── system/           # 系统管理
│       ├── users/
│       ├── roles/
│       └── permissions/
├── shared/                 # 跨功能共享资源
│   ├── components/        # UI 组件
│   │   ├── ui/           # shadcn/ui 基础组件
│   │   └── layout/       # Header, Sidebar, Main
│   ├── hooks/             # usePagination, useMediaQuery
│   ├── stores/            # auth, theme, locale (Zustand)
│   ├── locales/           # 国际化：zh/, en/
│   └── utils/             # constants, env
├── lib/                   # 核心库封装
│   ├── api.ts             # ky HTTP 客户端
│   └── storage.ts         # localStorage 封装
├── mocks/                 # MSW 模拟接口
└── main.tsx               # 应用入口
```

路径别名: `@/` → `./src/`

## 功能模块架构

每个功能模块是自包含的，包含自己的 API、类型、hooks 和组件：

```
src/features/<feature>/
├── api.ts                 # API 接口定义
├── types.ts               # TypeScript 类型
├── hooks/                 # TanStack Query hooks
│   └── index.ts
├── components/            # 业务组件
└── index.ts               # 对外导出
```

### API 调用流程

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
│       │ 自动处理                            │ features：          │
│       │ - 缓存                              │ - api.ts           │
│       │ - 加载状态                          │ - hooks/           │
│       │ - 错误处理                          │ - types.ts         │
│       ▼                                     ▼                    │
│  ┌─────────────┐                     ┌─────────────┐             │
│  │   Store     │                     │  Backend    │             │
│  │ (Zustand)   │                     │   Server    │             │
│  └─────────────┘                     └─────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 分层职责

| 层级 | 文件位置 | 职责 |
|------|----------|------|
| **API 层** | `src/features/*/api.ts` | 定义接口地址、请求参数类型、返回类型 |
| **Hooks 层** | `src/features/*/hooks/*.ts` | 封装 TanStack Query，处理缓存、状态、错误 |
| **Store 层** | `src/shared/stores/*.ts` | 管理全局状态（如用户登录态） |

### 示例：添加新功能的 API

```typescript
// 1. 定义类型 - src/features/xxx/types.ts
export interface CreateXxxReq {
  name: string
}

export interface XxxResp {
  id: number
  name: string
}

// 2. 创建 API - src/features/xxx/api.ts
import api from '@/lib/api'
import type { CreateXxxReq, XxxResp } from './types'

export const xxxApi = {
  list: () => api.get<XxxResp[]>('xxx'),
  get: (id: string) => api.get<XxxResp>(`xxx/${id}`),
  create: (data: CreateXxxReq) => api.post<XxxResp>('xxx', data),
  update: (id: string, data: Partial<CreateXxxReq>) => api.put<XxxResp>(`xxx/${id}`, data),
  delete: (id: string) => api.delete(`xxx/${id}`),
}

// 3. 封装 Hook - src/features/xxx/hooks/index.ts
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

export function useCreateXxx() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: xxxApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: xxxKeys.all }),
  })
}

// 4. 组件中使用
function XxxPage() {
  const { data, isLoading } = useXxxList()
  const createXxx = useCreateXxx()
}
```

## 环境变量

```bash
VITE_API_BASE_URL=/api       # 后端 API 地址
VITE_ENABLE_PROXY=true       # 启用 Vite 代理到 localhost:8080
```

## 开发命令

```bash
pnpm dev        # 启动开发服务器 (端口 5173)
pnpm build      # 构建生产版本 (tsc + vite build)
pnpm lint       # Biome 代码检查
pnpm lint:fix   # Biome 代码检查并自动修复
pnpm format     # Biome 代码格式化
```

## 添加 UI 组件

```bash
npx shadcn@latest add <component>              # 添加新组件
npx shadcn@latest add <component> --overwrite  # 覆盖现有组件
```

> 注意：项目使用 shadcn v4 的 radix-lyra 风格，组件从统一的 `radix-ui` 包导入，而非单独的 `@radix-ui/react-*` 包。

## 代码规范

- 单引号，无分号，尾逗号 (ES5)
- 2 空格缩进，100 字符行宽
- `noUnusedImports` 和 `noUnusedVariables` 为 error 级别
- 提交前运行 `pnpm lint:fix`

## 注意事项

- 开发模式下 MSW 自动启动 (`src/mocks/browser.ts`)
- 401 响应自动触发 token 刷新，刷新失败则登出
- 使用 `sonner` 作为 toast 通知组件
- 表单使用 react-hook-form + zod 进行验证

## 添加新页面

1. 创建页面组件 `src/pages/XxxPage.tsx`
2. 在路由配置中添加懒加载路由：
   ```typescript
   // src/app/router/index.tsx
   const XxxPage = lazy(() => import('@/pages/XxxPage'))
   // 在 children 数组中添加
   { path: 'xxx', element: <XxxPage /> }
   ```
3. 在侧边栏配置中添加导航项：
   ```typescript
   // src/shared/components/layout/Sidebar.tsx
   // 在 NAVIGATION_CONFIG 中添加
   { title: 'items.xxx', path: '/xxx', icon: <Icon size={18} /> }
   ```
4. 添加国际化文案 `src/shared/locales/zh/` 和 `en/`

## 修改主题样式

### 全局颜色变量
编辑 `src/index.css` 中的 CSS 变量：
- `:root` - 亮色主题颜色
- `.dark` - 暗色主题颜色

```css
:root {
  --primary: oklch(0.60 0.13 163);        /* 主色 */
  --background: oklch(1 0 0);              /* 背景色 */
  --foreground: oklch(0.141 0.005 285.823); /* 前景色 */
  /* ... */
}
```

### 圆角设置
```css
--radius: 0;  /* 修改为 0.5rem 等值可启用圆角 */
```

### 暗色模式切换
- Store: `useThemeStore` (`src/shared/stores/theme.ts`)
- 组件: `ThemeToggle` (`src/shared/components/ThemeToggle.tsx`)
- 切换方式: `document.documentElement.classList.toggle('dark')`

## 组件样式规范

### 使用 cn() 合并类名
```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-classes', condition && 'conditional', className)} />
```

### 使用语义化颜色类名
```typescript
// 推荐 - 主题适配
<span className="text-muted-foreground">
<div className="bg-primary text-primary-foreground">

// 避免 - 硬编码颜色
<span className="text-gray-500">
```

### 添加组件变体
使用 CVA (class-variance-authority)，参考 `src/shared/components/ui/button.tsx`：
```typescript
const componentVariants = cva('base-classes', {
  variants: {
    variant: { default: '...', outline: '...' },
    size: { sm: '...', lg: '...' }
  },
  defaultVariants: { variant: 'default', size: 'sm' }
})
```