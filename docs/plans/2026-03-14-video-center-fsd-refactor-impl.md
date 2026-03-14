# Video Center FSD 重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 feature/video-center 分支合并到 main，并按照 Feature-Sliced Design 架构重构代码结构。

**Architecture:** 采用 FSD 分层架构：app（应用层）→ pages（页面层）→ features（功能层）→ shared（共享层）。视频功能统一放在 features/video/ 下，按子功能（library、transcoding、upload）分目录组织。

**Tech Stack:** React 19, TypeScript, Vite 7, TanStack Query, React Router v7, shadcn/ui

---

## Task 1: 切换分支并合并 main

**Goal:** 切换到 feature/video-center 分支，合并 main 分支的 FSD 架构变更。

### Step 1: 切换到 feature/video-center 分支

```bash
git checkout feature/video-center
```

Expected: 成功切换到 feature/video-center 分支

### Step 2: 合并 main 分支

```bash
git merge main
```

Expected: 可能会有冲突，需要解决后继续

### Step 3: 如有冲突，查看冲突文件

```bash
git status
```

Expected: 列出有冲突的文件

### Step 4: 解决冲突后提交

如果存在冲突，解决后：
```bash
git add .
git commit -m "merge: merge main branch with FSD architecture"
```

Expected: 合并成功

---

## Task 2: 创建目标目录结构

**Goal:** 创建 FSD 架构所需的目录结构。

**Files:**
- Create: `src/features/video/`
- Create: `src/features/video/library/components/`
- Create: `src/features/video/transcoding/components/`
- Create: `src/features/video/upload/components/`
- Create: `src/features/video/upload/hooks/`
- Create: `src/features/video/hooks/`
- Create: `src/features/video/components/`

### Step 1: 创建视频功能目录结构

```bash
mkdir -p src/features/video/{library/components,transcoding/components,upload/{components,hooks},hooks,components}
```

Expected: 目录创建成功

### Step 2: 验证目录结构

```bash
find src/features/video -type d
```

Expected:
```
src/features/video
src/features/video/components
src/features/video/hooks
src/features/video/library
src/features/video/library/components
src/features/video/transcoding
src/features/video/transcoding/components
src/features/video/upload
src/features/video/upload/components
src/features/video/upload/hooks
```

---

## Task 3: 迁移视频 API 和类型定义

**Goal:** 将视频相关的 API 和类型定义迁移到 features/video/。

**Files:**
- Move: `src/api/video.ts` → `src/features/video/api.ts`
- Move: `src/types/video.ts` → `src/features/video/types.ts`
- Create: `src/features/video/index.ts`

### Step 1: 迁移视频类型定义

```bash
mv src/types/video.ts src/features/video/types.ts
```

### Step 2: 迁移视频 API

先读取当前文件内容，然后移动并更新导入路径：

```bash
cat src/api/video.ts
```

### Step 3: 创建 features/video/api.ts

复制 API 文件内容，更新导入路径（types 从 `@/types/video` 改为 `./types`）：

```typescript
// src/features/video/api.ts
import type { TranscodingConfig, TranscodingTask, Video, VideoStatus } from './types'
import api from '@/lib/api'

// ... 其余代码保持不变
```

### Step 4: 删除旧的 API 文件

```bash
rm src/api/video.ts
```

### Step 5: 创建 features/video/index.ts 统一导出

```typescript
// src/features/video/index.ts
export * from './types'
export * from './api'
export * from './hooks'
```

---

## Task 4: 迁移视频 Hooks

**Goal:** 将视频相关的 hooks 迁移到 features/video/hooks/。

**Files:**
- Move: `src/hooks/video/useVideo.ts` → `src/features/video/hooks/useVideo.ts`
- Move: `src/hooks/video/useTranscodingTasks.ts` → `src/features/video/hooks/useTranscodingTasks.ts`
- Move: `src/hooks/video/useVideoSelection.ts` → `src/features/video/hooks/useVideoSelection.ts`
- Create: `src/features/video/hooks/index.ts`

### Step 1: 迁移 useVideo hook

```bash
mv src/hooks/video/useVideo.ts src/features/video/hooks/
```

更新导入路径（api 从 `@/api/video` 改为 `../api`）

### Step 2: 迁移 useTranscodingTasks hook

```bash
mv src/hooks/video/useTranscodingTasks.ts src/features/video/hooks/
```

### Step 3: 迁移 useVideoSelection hook

```bash
mv src/hooks/video/useVideoSelection.ts src/features/video/hooks/
```

### Step 4: 创建 hooks/index.ts

```typescript
// src/features/video/hooks/index.ts
export * from './useVideo'
export * from './useTranscodingTasks'
export * from './useVideoSelection'
```

### Step 5: 清理旧目录

```bash
rm -rf src/hooks/video
```

---

## Task 5: 迁移上传相关 Hooks

**Goal:** 将上传相关的 hooks 迁移到 features/video/upload/hooks/。

**Files:**
- Move: `src/pages/video/upload/hooks/useChunkUpload.ts` → `src/features/video/upload/hooks/`
- Move: `src/pages/video/upload/hooks/useUploadScheduler.ts` → `src/features/video/upload/hooks/`

### Step 1: 迁移 useChunkUpload

```bash
mv src/pages/video/upload/hooks/useChunkUpload.ts src/features/video/upload/hooks/
```

### Step 2: 迁移 useUploadScheduler

```bash
mv src/pages/video/upload/hooks/useUploadScheduler.ts src/features/video/upload/hooks/
```

### Step 3: 创建 upload/hooks/index.ts

```typescript
// src/features/video/upload/hooks/index.ts
export * from './useChunkUpload'
export * from './useUploadScheduler'
```

---

## Task 6: 迁移视频库组件

**Goal:** 将视频库相关组件迁移到 features/video/library/components/。

**Files:**
- Move: `src/pages/video/library/components/*` → `src/features/video/library/components/`
- Move: `src/pages/video/components/VideoStatusBadge.tsx` → `src/features/video/components/`
- Create: `src/features/video/library/index.ts`

### Step 1: 迁移视频库组件

```bash
mv src/pages/video/library/components/* src/features/video/library/components/
```

### Step 2: 迁移共享组件 VideoStatusBadge

```bash
mv src/pages/video/components/VideoStatusBadge.tsx src/features/video/components/
```

### Step 3: 更新组件中的导入路径

更新所有组件中的导入路径：
- `@/api/video` → `@/features/video/api`
- `@/hooks/video/*` → `@/features/video/hooks`
- `@/types/video` → `@/features/video/types`

### Step 4: 创建 library/index.ts

```typescript
// src/features/video/library/index.ts
export * from './components/VideoCard'
export * from './components/VideoToolbar'
export * from './components/VideoDetailSheet'
export * from './components/BatchActionsBar'
export * from './components/TranscodingPanel'
```

---

## Task 7: 迁移转码组件

**Goal:** 将转码相关组件迁移到 features/video/transcoding/components/。

**Files:**
- Move: `src/pages/video/transcoding/components/*` → `src/features/video/transcoding/components/`
- Create: `src/features/video/transcoding/index.ts`

### Step 1: 迁移转码组件

```bash
mv src/pages/video/transcoding/components/* src/features/video/transcoding/components/
```

### Step 2: 更新组件中的导入路径

同 Task 6，更新导入路径。

### Step 3: 创建 transcoding/index.ts

```typescript
// src/features/video/transcoding/index.ts
export * from './components/TaskCard'
```

---

## Task 8: 迁移上传组件

**Goal:** 将上传相关组件迁移到 features/video/upload/components/。

**Files:**
- Move: `src/pages/video/upload/components/*` → `src/features/video/upload/components/`
- Create: `src/features/video/upload/index.ts`

### Step 1: 迁移上传组件

```bash
mv src/pages/video/upload/components/* src/features/video/upload/components/
```

### Step 2: 更新组件中的导入路径

同 Task 6，更新导入路径。

### Step 3: 创建 upload/index.ts

```typescript
// src/features/video/upload/index.ts
export * from './components/UploadDropzone'
export * from './components/UploadItem'
export * from './components/UploadQueue'
export * from './hooks'
```

---

## Task 9: 创建视频页面组件

**Goal:** 在 pages/video/ 创建页面组件，引用 features/video/ 中的功能。

**Files:**
- Create: `src/pages/video/Library.tsx`
- Create: `src/pages/video/Transcoding.tsx`
- Create: `src/pages/video/Upload.tsx`

### Step 1: 创建视频库页面

```typescript
// src/pages/video/Library.tsx
import { VideoLibrary } from '@/features/video/library'

export default function Library() {
  return <VideoLibrary />
}
```

实际上应该直接使用原有页面代码，放在 pages 中：

```typescript
// src/pages/video/Library.tsx
// 将 src/pages/video/library/index.tsx 的内容移到这里
// 更新所有导入路径指向 @/features/video/
```

### Step 2: 创建转码页面

```typescript
// src/pages/video/Transcoding.tsx
// 将 src/pages/video/transcoding/index.tsx 的内容移到这里
```

### Step 3: 创建上传页面

```typescript
// src/pages/video/Upload.tsx
// 将 src/pages/video/upload/index.tsx 的内容移到这里
```

### Step 4: 清理旧页面目录

```bash
rm -rf src/pages/video/library
rm -rf src/pages/video/transcoding
rm -rf src/pages/video/upload
rm -rf src/pages/video/components
```

---

## Task 10: 迁移其他功能模块

**Goal:** 将 auth、tags、profile 等功能迁移到 features/。

**Files:**
- Reorganize: `src/pages/auth/*` → `src/features/auth/`
- Reorganize: `src/pages/tags/*` → `src/features/tags/`
- Reorganize: `src/pages/profile/*` → `src/features/profile/`

### Step 1: 检查 main 分支已有的 features 结构

```bash
ls -la src/features/
```

如果 main 分支已经有这些功能，跳过此步骤。

### Step 2: 按 main 分支结构整理

确保 features 结构与 main 分支一致。

---

## Task 11: 迁移共享组件和工具

**Goal:** 将共享组件、hooks、stores 迁移到 shared/。

**Files:**
- Move: `src/components/common/*` → `src/shared/components/common/`
- Move: `src/components/layout/*` → `src/shared/components/layout/`
- Move: `src/components/chart/*` → `src/shared/components/chart/`
- Move: `src/components/ui/*` → `src/shared/components/ui/`
- Move: `src/hooks/*.ts` → `src/shared/hooks/`
- Move: `src/stores/*` → `src/shared/stores/`
- Move: `src/locales/*` → `src/shared/locales/`

### Step 1: 迁移共享组件

```bash
# 确保目标目录存在
mkdir -p src/shared/components/{common,layout,chart,ui}

# 移动组件
mv src/components/common/* src/shared/components/common/
mv src/components/layout/* src/shared/components/layout/
mv src/components/chart/* src/shared/components/chart/
mv src/components/ui/* src/shared/components/ui/
```

### Step 2: 迁移共享 hooks

```bash
mkdir -p src/shared/hooks
mv src/hooks/* src/shared/hooks/
```

### Step 3: 迁移 stores

```bash
mkdir -p src/shared/stores
mv src/stores/* src/shared/stores/
```

### Step 4: 迁移 locales

```bash
mkdir -p src/shared/locales
mv src/locales/* src/shared/locales/
```

### Step 5: 清理旧目录

```bash
rm -rf src/components src/hooks src/stores src/locales
```

---

## Task 12: 更新所有导入路径

**Goal:** 全局更新所有文件中的导入路径。

### Step 1: 查找所有需要更新的文件

```bash
grep -r "@/api/" src/ --include="*.ts" --include="*.tsx" -l
grep -r "@/hooks/" src/ --include="*.ts" --include="*.tsx" -l
grep -r "@/types/" src/ --include="*.ts" --include="*.tsx" -l
grep -r "@/components/" src/ --include="*.ts" --include="*.tsx" -l
grep -r "@/stores/" src/ --include="*.ts" --include="*.tsx" -l
grep -r "@/locales/" src/ --include="*.ts" --include="*.tsx" -l
```

### Step 2: 批量替换导入路径

```bash
# API 路径更新
# @/api/video → @/features/video/api
# @/api/auth → @/features/auth/api
# @/api/tag → @/features/tags/api

# Hooks 路径更新
# @/hooks/video/* → @/features/video/hooks
# @/hooks/useAuth → @/features/auth/hooks
# @/hooks/* → @/shared/hooks/*

# Types 路径更新
# @/types/video → @/features/video/types

# Components 路径更新
# @/components/common/* → @/shared/components/common
# @/components/layout/* → @/shared/components/layout
# @/components/ui/* → @/shared/components/ui
# @/components/chart/* → @/shared/components/chart

# Stores 路径更新
# @/stores/* → @/shared/stores/*

# Locales 路径更新
# @/locales/* → @/shared/locales/*
```

---

## Task 13: 更新路由配置

**Goal:** 更新路由配置以匹配新的页面结构。

**Files:**
- Modify: `src/app/router/index.tsx`

### Step 1: 检查当前路由配置

```bash
cat src/app/router/index.tsx
```

### Step 2: 更新视频相关路由

```typescript
// 更新视频页面路由
{
  path: '/video',
  children: [
    { index: true, element: <Navigate to="library" replace /> },
    { path: 'library', element: <Library /> },
    { path: 'transcoding', element: <Transcoding /> },
    { path: 'upload', element: <Upload /> },
  ],
}
```

---

## Task 14: 运行 lint 和类型检查

**Goal:** 验证重构后代码没有错误。

### Step 1: 运行 lint 检查

```bash
pnpm lint
```

Expected: 没有错误，或者有明确的修复提示

### Step 2: 运行类型检查

```bash
pnpm build
```

Expected: 构建成功，没有类型错误

### Step 3: 如果有错误，修复

根据错误信息逐个修复导入路径或类型问题。

---

## Task 15: 验证功能

**Goal:** 确保所有功能正常工作。

### Step 1: 启动开发服务器

```bash
pnpm dev
```

Expected: 服务器启动成功

### Step 2: 验证主要功能

- [ ] 登录功能正常
- [ ] 视频库页面正常显示
- [ ] 视频转码页面正常显示
- [ ] 视频上传功能正常
- [ ] 标签管理功能正常
- [ ] 系统管理功能正常

---

## Task 16: 清理和提交

**Goal:** 清理无用文件，提交重构代码。

### Step 1: 删除空目录

```bash
find src -type d -empty -delete
```

### Step 2: 检查最终结构

```bash
find src -type d | sort
```

### Step 3: 提交重构

```bash
git add .
git commit -m "refactor: migrate video-center to FSD architecture

- Move video functionality to features/video/
- Organize by sub-features: library, transcoding, upload
- Move shared components to shared/components/
- Move shared hooks to shared/hooks/
- Update all import paths
- Ensure clean FSD layer separation"
```

---

## 验证清单

- [ ] 所有页面正常加载
- [ ] 视频库功能完整（列表、搜索、筛选、批量操作）
- [ ] 视频转码功能正常
- [ ] 视频上传功能正常
- [ ] 认证功能正常
- [ ] 标签管理功能正常
- [ ] 系统管理功能正常
- [ ] 无 lint 错误
- [ ] 无类型错误
- [ ] 构建成功