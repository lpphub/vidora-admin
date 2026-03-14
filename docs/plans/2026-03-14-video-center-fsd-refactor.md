# Video Center FSD 架构重构设计

## 背景

feature/video-center 分支包含完整的视频中心功能（视频库、转码、上传），但使用的是旧的目录结构。main 分支已经迁移到 Feature-Sliced Design (FSD) 架构。需要将 feature/video-center 的功能合并到 main 分支，并按照 FSD 架构重构。

## 目标

1. 将 feature/video-center 分支合并到 main
2. 按照 FSD 架构重构代码结构
3. 保持功能完整性
4. 确保代码简洁清晰、可读性好

## 目标目录结构

```
src/
├── app/                          # 应用层
│   ├── router/                   # 路由配置
│   └── providers/                # 全局 Provider
├── features/                     # 功能层
│   ├── auth/                     # 认证功能
│   ├── profile/                  # 个人资料
│   ├── tags/                     # 标签管理
│   ├── system/                   # 系统管理
│   │   ├── users/
│   │   ├── roles/
│   │   └── permissions/
│   └── video/                    # 视频功能
│       ├── library/               # 视频库子功能
│       │   ├── components/
│       │   │   ├── VideoCard.tsx
│       │   │   ├── VideoToolbar.tsx
│       │   │   ├── VideoDetailSheet.tsx
│       │   │   ├── BatchActionsBar.tsx
│       │   │   └── TranscodingPanel.tsx
│       │   └── index.ts
│       ├── transcoding/           # 转码子功能
│       │   ├── components/
│       │   │   └── TaskCard.tsx
│       │   └── index.ts
│       ├── upload/                # 上传子功能
│       │   ├── components/
│       │   │   ├── UploadDropzone.tsx
│       │   │   ├── UploadItem.tsx
│       │   │   └── UploadQueue.tsx
│       │   ├── hooks/
│       │   │   ├── useChunkUpload.ts
│       │   │   └── useUploadScheduler.ts
│       │   └── index.ts
│       ├── api.ts                 # 视频 API
│       ├── types.ts               # 视频类型
│       ├── hooks/                 # 共享 hooks
│       │   ├── useVideo.ts
│       │   ├── useTranscodingTasks.ts
│       │   └── useVideoSelection.ts
│       └── index.ts
├── pages/                        # 页面层
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── Tags.tsx
│   ├── video/
│   │   ├── Library.tsx
│   │   ├── Transcoding.tsx
│   │   └── Upload.tsx
│   └── system/
│       ├── Users.tsx
│       ├── Roles.tsx
│       └── Permissions.tsx
├── shared/                       # 共享层
│   ├── components/
│   │   ├── ui/
│   │   ├── chart/
│   │   ├── layout/
│   │   └── common/
│   ├── hooks/
│   ├── stores/
│   ├── locales/
│   └── utils/
├── mocks/
└── lib/
```

## 迁移映射

### API 层

| 旧路径 | 新路径 |
|--------|--------|
| `src/api/video.ts` | `src/features/video/api.ts` |
| `src/api/auth.ts` | `src/features/auth/api.ts` |
| `src/api/tag.ts` | `src/features/tags/api.ts` |

### 类型定义

| 旧路径 | 新路径 |
|--------|--------|
| `src/types/video.ts` | `src/features/video/types.ts` |

### Hooks

| 旧路径 | 新路径 |
|--------|--------|
| `src/hooks/video/useVideo.ts` | `src/features/video/hooks/useVideo.ts` |
| `src/hooks/video/useTranscodingTasks.ts` | `src/features/video/hooks/useTranscodingTasks.ts` |
| `src/hooks/video/useVideoSelection.ts` | `src/features/video/hooks/useVideoSelection.ts` |
| `src/hooks/video/useChunkUpload.ts` | `src/features/video/upload/hooks/useChunkUpload.ts` |
| `src/hooks/video/useUploadScheduler.ts` | `src/features/video/upload/hooks/useUploadScheduler.ts` |
| `src/hooks/useAuth.ts` | `src/features/auth/hooks/useAuth.ts` |
| `src/hooks/usePagination.ts` | `src/shared/hooks/usePagination.ts` |
| `src/hooks/useMediaQuery.ts` | `src/shared/hooks/useMediaQuery.ts` |

### 组件

| 旧路径 | 新路径 |
|--------|--------|
| `src/pages/video/library/components/*` | `src/features/video/library/components/*` |
| `src/pages/video/transcoding/components/*` | `src/features/video/transcoding/components/*` |
| `src/pages/video/upload/components/*` | `src/features/video/upload/components/*` |
| `src/pages/video/components/VideoStatusBadge.tsx` | `src/features/video/components/VideoStatusBadge.tsx` |
| `src/components/common/*` | `src/shared/components/common/*` |
| `src/components/layout/*` | `src/shared/components/layout/*` |
| `src/components/chart/*` | `src/shared/components/chart/*` |
| `src/components/ui/*` | `src/shared/components/ui/*` |

### 页面

| 旧路径 | 新路径 |
|--------|--------|
| `src/pages/video/library/index.tsx` | `src/pages/video/Library.tsx` |
| `src/pages/video/transcoding/index.tsx` | `src/pages/video/Transcoding.tsx` |
| `src/pages/video/upload/index.tsx` | `src/pages/video/Upload.tsx` |
| `src/pages/auth/*` | `src/features/auth/components/*` + `src/pages/Auth.tsx` |
| `src/pages/tags/*` | `src/features/tags/components/*` + `src/pages/Tags.tsx` |

### 其他

| 旧路径 | 新路径 |
|--------|--------|
| `src/stores/*` | `src/shared/stores/*` |
| `src/locales/*` | `src/shared/locales/*` |
| `src/router/*` | `src/app/router/*` |

## 实施步骤

1. **切换分支并合并**
   - 切换到 feature/video-center 分支
   - 合并 main 分支

2. **创建目标目录结构**
   - 创建 `src/features/video/` 及子目录
   - 创建 `src/pages/video/` 目录

3. **迁移视频功能代码**
   - 迁移 API 和类型定义
   - 迁移 hooks
   - 迁移组件到对应子功能目录
   - 创建页面组件

4. **迁移其他功能代码**
   - 迁移 auth、tags 等功能到 features/
   - 迁移共享组件到 shared/
   - 迁移 hooks 和 stores

5. **更新导入路径**
   - 更新所有文件中的 import 语句
   - 更新路由配置

6. **清理旧目录**
   - 删除已迁移的旧目录
   - 更新 tsconfig 路径别名

7. **验证功能**
   - 运行 lint 检查
   - 运行类型检查
   - 启动开发服务器验证功能

## 注意事项

1. 保持功能完整性，不修改业务逻辑
2. 确保所有导入路径正确更新
3. 遵循 FSD 架构的分层原则
4. 每个子功能模块提供统一的 index.ts 导出