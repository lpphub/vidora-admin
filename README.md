# Vidora Admin

视频内容管理后台系统

## 技术栈

- **框架**: Next.js 16 (App Router) + TypeScript 5.9
- **UI**: React 19, shadcn/ui v4 (radix-lyra), Tailwind CSS 4
- **数据**: TanStack Query, Zustand
- **国际化**: next-intl（cookie-based，URL 无 locale 前缀）
- **表单**: react-hook-form + zod + @hookform/resolvers
- **图表**: ApexCharts + react-apexcharts
- **代码规范**: Biome

## 项目结构

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根 layout（透传）
│   └── [locale]/                 # i18n 动态路由
│       ├── layout.tsx            # RootLayout: <html> + providers
│       ├── (auth)/login/         # 登录页（无 sidebar）
│       └── (app)/                # 后台页面（Sidebar + Header）
│           ├── layout.tsx        # AppLayout: Sidebar + Header
│           ├── dashboard/        # 仪表盘
│           ├── tags/             # 标签管理
│           ├── profile/          # 个人设置
│           └── system/           # 系统管理
│               ├── users/
│               ├── roles/
│               └── permissions/
├── api/                          # BFF Route Handlers（代理后端 API）
├── components/                   # 全局共享组件（ui/, layout/, chart/）
├── hooks/                        # 全局共享 hooks（auth, tag, profile）
├── types/                        # 全局共享类型
├── i18n/                         # next-intl 配置 + 翻译文件
├── lib/                          # 核心工具（api, env, utils）
├── stores/                       # Zustand 状态（theme, locale, auth）
└── proxy.ts                      # Proxy（locale rewrite + auth guard）
```

路径别名: `@/` → `./src/`

## 架构设计

### 路由与多语言

URL 不带 locale 前缀，用户看到的是干净的路径：

```
/login          ← 无 sidebar
/dashboard      ← 有 sidebar
/tags           ← 有 sidebar
/profile        ← 有 sidebar
/system/users   ← 有 sidebar
```

locale 通过 cookie 存储，proxy 内部 rewrite 注入 `[locale]` 段：

```
用户访问 /dashboard
  → proxy 读 cookie → locale=zh
  → rewrite → /zh/dashboard（内部，用户不可见）
  → [locale]/layout.tsx → (app)/layout.tsx → dashboard/page.tsx
```

### 数据获取

```
┌─────────────────────────────────────────────────────────────────┐
│  Server Component (page.tsx)                                     │
│  fetchApi.get('dashboard/stats', cookies()) → 直连后端            │
│  适用于: 首屏数据、翻译                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Client Component + TanStack Query                               │
│  useTags() → bff.get('tags') → /api/tags → BFF → 后端            │
│  适用于: 需要交互、缓存、自动刷新的列表                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Server 传初始值 + Client 接管                                     │
│  page.tsx 获取初始数据 → useUser() 接管缓存 → 更新后自动刷新         │
│  适用于: 需要首屏展示 + 后续可修改的数据                              │
└─────────────────────────────────────────────────────────────────┘
```

### API 调用链路

```
客户端:  bff.get('tags')  → /api/tags → route handler → 后端/api/tags
服务端:  fetchApi.get('tags') → 后端/api/tags（直连，少一跳）
```

## 开发命令

```bash
pnpm dev        # 启动开发服务器
pnpm build      # 生产构建
pnpm start      # 启动生产服务
pnpm lint       # Biome 代码检查
pnpm lint:fix   # Biome 自动修复
pnpm format     # Biome 格式化
```

## 环境变量

```bash
NEXT_PUBLIC_APP_TITLE=Vidora        # 客户端可见标题
BACKEND_API_URL=http://localhost:8080 # 后端 API 地址（仅服务端）
ENABLE_MOCKS=true                   # 启用 mock 数据（默认关闭）
```

## 部署 (Docker)

```bash
docker compose up -d                # 启动
docker compose build --no-cache     # 重新构建
```

## 添加新页面

1. 创建路由目录 `src/app/[locale]/(app)/xxx/`
2. 创建 `page.tsx`（Server Component）+ `_components/XxxClient.tsx`（Client Component）
3. 如需服务端数据获取，创建 `data.ts`
4. 需要代理的后端接口创建 `src/app/api/xxx/route.ts`
5. 导航项添加到 `src/components/layout/Sidebar.tsx`
6. 翻译添加到 `src/i18n/messages/zh/` 和 `src/i18n/messages/en/`

## 添加 UI 组件

```bash
npx shadcn@latest add <component>
npx shadcn@latest add <component> --overwrite
```

> 组件从 `radix-ui` 包导入，勿手动编辑 `src/components/ui/`。

## 代码规范

- 单引号，无分号，尾逗号 (ES5)
- 2 空格缩进，100 字符行宽
- `noUnusedImports` 和 `noUnusedVariables` 为 error
- 提交前运行 `pnpm lint:fix`
