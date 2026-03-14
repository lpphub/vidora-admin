# 影视库与转码任务功能设计

## 概述

在左侧导航增加「影视库」和「转码任务」两个菜单，实现视频内容管理和转码任务管理功能。

## 目录结构

```
src/
├── features/
│   └── video/
│       ├── index.ts
│       ├── types.ts                    # 已有完整类型
│       ├── api.ts                      # 影视CRUD API
│       ├── upload/                     # 已有，直接复用
│       │   ├── hooks/
│       │   │   ├── useChunkUpload.ts   # 分片上传、秒传、续传
│       │   │   └── useUploadScheduler.ts # 多文件调度
│       │   └── components/
│       │       ├── UploadDropzone.tsx
│       │       ├── UploadItem.tsx
│       │       └── UploadQueue.tsx
│       └── components/
│           ├── VideoCard.tsx           # 卡片组件
│           ├── VideoForm.tsx           # 基础信息表单
│           └── SeasonManager.tsx       # 季集管理
├── features/transcoding/
│       ├── index.ts
│       ├── types.ts                    # 转码任务类型
│       ├── api.ts                      # 转码API
│       └── components/
│           └── TranscodingTable.tsx    # 任务表格
└── pages/
    ├── videos/
    │   ├── index.tsx                   # 影视库列表
    │   └── [id].tsx                    # 影视详情
    └── transcoding/
        └── index.tsx                   # 转码任务列表
```

## 上传流程

```
用户选择文件
    │
    ▼
┌─────────────────┐
│  状态: hashing  │
│  计算文件MD5    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  POST /upload/check  │
│  { md5, fileName, fileSize, totalChunks }  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
 exists=true  exists=false
    │         │
    ▼         │
┌───────────┐ │
│ 秒传成功   │ │
│ isInstantUpload │ │
└───────────┘ │
              │
              ▼
      ┌───────────────┐
      │ 返回: uploadId, uploadedChunks[]  │
      │ 跳过已上传分片    │
      └───────┬───────┘
              │
              ▼ (并发3)
      ┌───────────────┐
      │ POST /upload/chunk  │
      └───────┬───────┘
              │
              ▼
      ┌───────────────┐
      │ POST /upload/merge  │
      └───────┬───────┘
              │
              ▼
         上传完成
```

**状态流转**：
```
idle → hashing → uploading → success
                ↓
             paused ←→ uploading (续传)
                ↓
              error
```

## 影视库列表页

### 卡片展示信息
- 封面图（16:9比例）
- 标题、类型标签（电影/电视剧/动漫）
- 状态徽章（草稿/已发布/已归档）
- 季集信息（电视剧显示：X季X集）
- 上传状态图标（已上传源视频/未上传）
- 转码状态图标（转码中/已完成/失败/无任务）

### 筛选搜索
- 类型筛选（全部/电影/电视剧/动漫）
- 状态筛选（全部/草稿/已发布/已归档）
- 搜索框（标题模糊搜索）

### 操作
- 点击卡片 → 跳转详情页
- 右上角新增按钮 → 创建影视弹窗

## 影视详情页

### 布局
```
┌─────────────────────────────────────────────────────────────┐
│  ← 返回    影视标题                          [保存] [发布]  │
├──────────────────────┬──────────────────────────────────────┤
│                      │  功能区（垂直堆叠）                   │
│    ┌──────────────┐  │  ┌───────────────────────────────────┤
│    │              │  │  │ 基础信息编辑                      │
│    │   封面图      │  │  │ 标题、类型、标签、分类、简介       │
│    │   16:9       │  │  └───────────────────────────────────┤
│    │              │  │  ┌───────────────────────────────────┤
│    │  [更换封面]   │  │  │ 源视频上传                        │
│    └──────────────┘  │  │ 拖拽上传 + 进度显示               │
│                      │  └───────────────────────────────────┤
│    状态: [草稿 ▼]    │  ┌───────────────────────────────────┤
│    创建时间: xxx     │  │ 季集管理 (电视剧类型显示)          │
│    更新时间: xxx     │  │ 季列表 + 集列表 + 添加/编辑/删除   │
│                      │  └───────────────────────────────────┤
│                      │  ┌───────────────────────────────────┤
│                      │  │ 转码任务                          │
│                      │  │ 任务列表 + 创建任务 + 取消/重试    │
│                      │  └───────────────────────────────────┘
└──────────────────────┴──────────────────────────────────────┘
```

### 功能模块
1. **基础信息编辑**：标题、简介、封面图、类型、标签、分类
2. **源视频上传**：拖拽上传，支持秒传、分片上传、断点续传
3. **季集管理**：新建/编辑/删除季和集，仅电视剧类型显示
4. **转码任务管理**：创建转码任务，查看任务列表，取消/重试

## 转码任务列表页

### 表格列
| 影视名称 | 任务类型 | 状态 | 进度 | 创建时间 | 操作 |
|---------|---------|------|------|---------|------|
| 电影A | 转码 | 进行中 | 45% | 2024-03-14 10:00 | [取消] |
| 电视剧B | 缩略图 | 已完成 | 100% | 2024-03-14 09:30 | [重试] |
| 动漫C | 转码 | 失败 | - | 2024-03-13 15:20 | [重试] |

### 筛选
- 状态筛选：全部 / 进行中 / 已完成 / 失败
- 类型筛选：全部 / 转码 / 缩略图 / 字幕

### 操作
- 取消：取消进行中的任务
- 重试：重新开始失败或已完成的任务

## API 接口设计

### 影视相关
```
GET    /videos                    # 影视列表
GET    /videos/:id                # 影视详情
POST   /videos                    # 创建影视
PUT    /videos/:id                # 更新影视
DELETE /videos/:id                # 删除影视

# 季集管理
POST   /videos/:id/seasons        # 添加季
PUT    /videos/:id/seasons/:sid   # 更新季
DELETE /videos/:id/seasons/:sid   # 删除季
POST   /videos/:id/seasons/:sid/episodes  # 添加集
PUT    /videos/:id/seasons/:sid/episodes/:eid  # 更新集
DELETE /videos/:id/seasons/:sid/episodes/:eid  # 删除集
```

### 上传相关
```
POST   /upload/check              # 秒传检查 + 获取已上传分片
POST   /upload/chunk              # 上传分片
POST   /upload/merge              # 合并分片
```

### 转码
```
GET    /transcoding               # 全局任务列表
POST   /videos/:id/transcoding    # 创建转码任务
POST   /transcoding/:id/cancel    # 取消任务
POST   /transcoding/:id/retry     # 重试任务
```

## 侧边栏导航更新

在 `NAVIGATION_CONFIG` 的 features 分组增加：
```typescript
{
  name: 'groups.features',
  items: [
    { title: 'items.videoLibrary', path: '/videos', icon: <Film size={18} /> },
    { title: 'items.transcoding', path: '/transcoding', icon: <Film size={18} /> },
    { title: 'items.tagManagement', path: '/tags', icon: <Tag size={18} /> },
  ],
}
```