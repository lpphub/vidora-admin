# Vidora Admin

视频管理后台系统

## 技术栈

- React 19 + TypeScript
- Vite 7 (Rolldown)
- TanStack Query (数据请求)
- Zustand (状态管理)
- shadcn/ui + Tailwind CSS 4 (UI组件)
- React Router v7 (路由)
- Biome (代码检查和格式化)

## 项目结构

```
src/
├── api/                 # API 层：ky 实例 + 接口定义
│   ├── index.ts         # ky 实例配置（hooks、token刷新等）
│   └── auth.ts          # 认证接口
├── components/          # UI 组件
│   ├── ui/              # 基础组件 (shadcn/ui)
│   ├── common/          # 通用业务组件
│   └── layout/          # 布局组件
├── hooks/               # 自定义 Hooks
│   ├── useAuth.ts       # 认证相关 hooks
│   ├── useUpload.ts     # 文件上传 hook
│   └── usePagination.ts # 分页 hook
├── pages/               # 页面组件
├── stores/              # Zustand 状态管理
├── types/               # TypeScript 类型定义
└── lib/                 # 工具函数
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

### 分层职责

| 层级 | 文件位置 | 职责 |
|------|----------|------|
| **API 层** | `src/api/*.ts` | 定义接口地址、请求参数类型、返回类型 |
| **Hooks 层** | `src/hooks/*.ts` | 封装 TanStack Query，处理缓存、状态、错误 |
| **Store 层** | `src/stores/*.ts` | 管理全局状态（如用户登录态） |

### 示例：登录流程

```typescript
// 1. API 层 - 定义接口
export const authApi = {
  login: (data: LoginRequest) => api.post<AuthData>('auth/login', data),
}

// 2. Hooks 层 - 封装请求逻辑
export function useLogin() {
  const { login } = useAuth()
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => login(data),
  })
}

// 3. 组件中使用
function LoginPage() {
  const { mutate: login, isPending } = useLogin()
  const handleSubmit = (data: LoginRequest) => login(data)
}
```

### 添加新接口的步骤

1. **定义类型** - 在 `src/types/` 下添加请求/响应类型
2. **创建 API** - 在 `src/api/` 下新建文件，导出 API 对象
3. **封装 Hook** - 在 `src/hooks/` 下创建对应的 hook
4. **组件调用** - 页面组件中 import hook 使用

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
