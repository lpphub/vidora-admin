# Vidora Admin

管理后台系统

## 技术栈

- React 19 + TypeScript
- Vite 7 (Rolldown)
- TanStack Query (数据请求)
- Zustand (状态管理)
- shadcn/ui v4 + Tailwind CSS 4
- React Router v7 (路由)
- Biome (代码检查和格式化)

## 项目结构

```
src/
├── app/                    # 应用
│   ├── router/             # 路由配置
│   └── providers/          # React Providers
├── pages/                  # 页面组件（路由入口）
├── features/               # 业务功能模块
│   ├── auth/              # 认证
│   │   ├── api.ts        # API 接口定义
│   │   ├── types.ts      # 类型定义
│   │   ├── hooks/        # 业务 Hooks
│   │   └── components/   # 业务组件
│   ├── profile/           # 个人设置
│   └── video/            # 视频
├── shared/                 # 跨功能共享资源
│   ├── components/        # UI 组件
│   │   ├── ui/           # shadcn/ui：Button, Input, Table...
│   │   ├── layout/       # Header, Sidebar, Main
│   │   └── *.tsx        # ConfirmDialog, ThemeToggle...
│   ├── hooks/             # usePagination, useMediaQuery
│   ├── stores/            # auth, theme, locale
│   ├── locales/          # 国际化：zh/, en/
│   └── utils/             # constants, env
├── lib/                   # 核心库（三方库封装）
│   ├── api.ts            # ky HTTP 客户端
│   └── storage.ts        # localStorage 封装
├── mocks/                 # MSW 模拟接口
├── main.tsx              # 应用入口
└── index.css             # 全局样式
```

## 后端接口调用流程

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
import type { CreateXxxReq, XxxResp } from './types'
import api from '@/lib/api'

export const xxxApi = {
  list: () => api.get<XxxResp[]>('xxx'),
  create: (data: CreateXxxReq) => api.post<XxxResp>('xxx', data),
}

// 3. 封装 Hook - src/features/xxx/hooks/index.ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { xxxApi } from '../api'

export const xxxKeys = {
  all: ['xxx'] as const,
  list: () => [...xxxKeys.all, 'list'] as const,
}

export function useXxxList() {
  return useQuery({
    queryKey: xxxKeys.list(),
    queryFn: () => xxxApi.list(),
  })
}

export function useCreateXxx() {
  return useMutation({
    mutationFn: xxxApi.create,
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
pnpm build      # 构建生产版本
pnpm lint       # Biome 代码检查
pnpm lint:fix   # Biome 代码检查并自动修复
pnpm format     # Biome 代码格式化
```

## 添加 UI 组件

```bash
npx shadcn@latest add <component>           # 添加新组件
npx shadcn@latest add <component> --overwrite  # 覆盖现有组件
```

> 注意：项目使用 shadcn v4 的 radix-lyra 风格，组件从统一的 `radix-ui` 包导入，而非单独的 `@radix-ui/react-*` 包。
