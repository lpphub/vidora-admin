import { delay, HttpResponse, http } from 'msw'
import type { Season, TranscodingTask, Video } from '@/features/video/types'

const API_BASE = '/api'

const videos: Video[] = [
  {
    id: '1',
    title: '星际穿越',
    description: '一部关于太空探索的科幻电影，讲述了一群宇航员穿越虫洞寻找新家园的故事。',
    cover: 'https://picsum.photos/seed/movie1/400/225',
    type: 'movie',
    tags: ['科幻', '冒险'],
    status: 'published',
    duration: 169,
    resolution: '4K',
    fileSize: 15728640000,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-10T08:00:00Z',
  },
  {
    id: '2',
    title: '盗梦空间',
    description: '一个能够进入他人梦境的盗贼，被委托执行一项特殊的任务。',
    cover: 'https://picsum.photos/seed/movie2/400/225',
    type: 'movie',
    tags: ['科幻', '悬疑'],
    status: 'published',
    duration: 148,
    resolution: '1080p',
    fileSize: 8589934592,
    createdAt: '2024-02-20T14:20:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
  },
  {
    id: '3',
    title: '权力的游戏',
    description: '七大王国争夺铁王座的史诗故事。',
    cover: 'https://picsum.photos/seed/series1/400/225',
    type: 'series',
    tags: ['奇幻', '剧情'],
    status: 'published',
    seasons: [
      {
        id: 's1',
        videoId: '3',
        seasonNumber: 1,
        title: '第一季',
        episodes: [
          {
            id: 'e1',
            seasonId: 's1',
            episodeNumber: 1,
            title: '凛冬将至',
            duration: 62,
            status: 'published',
          },
          {
            id: 'e2',
            seasonId: 's1',
            episodeNumber: 2,
            title: '国王大道',
            duration: 58,
            status: 'published',
          },
          {
            id: 'e3',
            seasonId: 's1',
            episodeNumber: 3,
            title: '雪诺大人',
            duration: 55,
            status: 'published',
          },
        ],
      },
      {
        id: 's2',
        videoId: '3',
        seasonNumber: 2,
        title: '第二季',
        episodes: [
          {
            id: 'e4',
            seasonId: 's2',
            episodeNumber: 1,
            title: '北方铭记',
            duration: 52,
            status: 'published',
          },
          {
            id: 'e5',
            seasonId: 's2',
            episodeNumber: 2,
            title: '夜之地',
            duration: 56,
            status: 'published',
          },
        ],
      },
    ],
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-20T11:30:00Z',
  },
  {
    id: '4',
    title: '三体',
    description: '根据刘慈欣同名小说改编的科幻剧集。',
    cover: 'https://picsum.photos/seed/series2/400/225',
    type: 'series',
    tags: ['科幻', '剧情'],
    status: 'draft',
    seasons: [
      {
        id: 's3',
        videoId: '4',
        seasonNumber: 1,
        title: '第一季',
        episodes: [
          {
            id: 'e6',
            seasonId: 's3',
            episodeNumber: 1,
            title: '疯狂年代',
            duration: 45,
            status: 'draft',
          },
          {
            id: 'e7',
            seasonId: 's3',
            episodeNumber: 2,
            title: '红岸基地',
            duration: 48,
            status: 'draft',
          },
        ],
      },
    ],
    createdAt: '2024-03-10T15:00:00Z',
    updatedAt: '2024-03-18T10:00:00Z',
  },
  {
    id: '5',
    title: '流浪地球2',
    description: '人类试图带着地球逃离太阳系的续作。',
    cover: 'https://picsum.photos/seed/movie3/400/225',
    type: 'movie',
    tags: ['科幻', '灾难'],
    status: 'archived',
    duration: 173,
    resolution: '4K',
    fileSize: 21474836480,
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-02-28T18:00:00Z',
  },
  {
    id: '6',
    title: '抖音热门合集',
    description: '精选短视频内容合集',
    cover: 'https://picsum.photos/seed/short1/400/225',
    type: 'short',
    tags: ['娱乐'],
    status: 'published',
    duration: 15,
    createdAt: '2024-03-18T08:00:00Z',
    updatedAt: '2024-03-18T08:00:00Z',
  },
]

const transcodingTasks: TranscodingTask[] = [
  {
    id: 't1',
    videoId: '1',
    videoTitle: '星际穿越',
    type: 'transcode',
    status: 'processing',
    progress: 65,
    input: { file: 'interstellar_4k.mkv', resolution: '4K', codec: 'h265' },
    output: { resolution: '1080p', codec: 'h264', bitrate: 8000 },
    startedAt: '2024-03-14T10:00:00Z',
  },
  {
    id: 't2',
    videoId: '2',
    videoTitle: '盗梦空间',
    type: 'thumbnail',
    status: 'completed',
    progress: 100,
    input: { file: 'inception.mkv', resolution: '1080p', codec: 'h264' },
    output: { resolution: '480p', codec: 'h264', bitrate: 2000 },
    startedAt: '2024-03-14T09:00:00Z',
    completedAt: '2024-03-14T09:30:00Z',
  },
  {
    id: 't3',
    videoId: '4',
    videoTitle: '三体',
    type: 'transcode',
    status: 'failed',
    progress: 0,
    input: { file: 'three_body_ep1.mp4', resolution: '1080p', codec: 'h264' },
    output: { resolution: '720p', codec: 'h264', bitrate: 4000 },
    startedAt: '2024-03-13T15:00:00Z',
    error: '源文件损坏',
  },
]

export const videoHandlers = [
  http.get(`${API_BASE}/videos`, async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const status = url.searchParams.get('status')
    const keyword = url.searchParams.get('keyword')

    let filtered = [...videos]

    if (type && type !== 'all') {
      filtered = filtered.filter(v => v.type === type)
    }
    if (status && status !== 'all') {
      filtered = filtered.filter(v => v.status === status)
    }
    if (keyword) {
      filtered = filtered.filter(v => v.title.toLowerCase().includes(keyword.toLowerCase()))
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        items: filtered,
        total: filtered.length,
        page: 1,
        pageSize: 20,
      },
    })
  }),

  http.get(`${API_BASE}/videos/:id`, async ({ params }) => {
    await delay(200)
    const video = videos.find(v => v.id === params.id)
    if (!video) {
      return HttpResponse.json({ code: 404, message: 'Video not found' }, { status: 404 })
    }
    return HttpResponse.json({ code: 0, message: 'success', data: video })
  }),

  http.post(`${API_BASE}/videos`, async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as Partial<Video>
    const newVideo: Video = {
      id: String(Date.now()),
      title: body.title || '',
      description: body.description,
      cover: body.cover,
      type: body.type || 'movie',
      tags: body.tags || [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    videos.push(newVideo)
    return HttpResponse.json({ code: 0, message: 'success', data: newVideo })
  }),

  http.put(`${API_BASE}/videos/:id`, async ({ params, request }) => {
    await delay(300)
    const id = params.id as string
    const index = videos.findIndex(v => v.id === id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, message: 'Video not found' }, { status: 404 })
    }
    const body = (await request.json()) as Partial<Video>
    videos[index] = { ...videos[index], ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json({ code: 0, message: 'success', data: videos[index] })
  }),

  http.delete(`${API_BASE}/videos/:id`, async ({ params }) => {
    await delay(200)
    const id = params.id as string
    const index = videos.findIndex(v => v.id === id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, message: 'Video not found' }, { status: 404 })
    }
    videos.splice(index, 1)
    return HttpResponse.json({ code: 0, message: 'success', data: { success: true } })
  }),

  http.post(`${API_BASE}/videos/:id/seasons`, async ({ params, request }) => {
    await delay(300)
    const videoId = params.id as string
    const body = (await request.json()) as { seasonNumber: number; title?: string }
    const newSeason: Season = {
      id: String(Date.now()),
      videoId,
      seasonNumber: body.seasonNumber,
      title: body.title,
      episodes: [],
    }
    const video = videos.find(v => v.id === videoId)
    if (video) {
      video.seasons = video.seasons || []
      video.seasons.push(newSeason)
    }
    return HttpResponse.json({ code: 0, message: 'success', data: newSeason })
  }),

  http.get(`${API_BASE}/transcoding`, async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const videoId = url.searchParams.get('videoId')

    let filtered = [...transcodingTasks]
    if (videoId) {
      filtered = filtered.filter(t => t.videoId === videoId)
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: filtered,
    })
  }),

  http.post(`${API_BASE}/transcoding/:id/cancel`, async ({ params }) => {
    await delay(200)
    const id = params.id as string
    const task = transcodingTasks.find(t => t.id === id)
    if (task) {
      task.status = 'failed'
      task.error = '用户取消'
    }
    return HttpResponse.json({ code: 0, message: 'success', data: { success: true } })
  }),

  http.post(`${API_BASE}/transcoding/:id/retry`, async ({ params }) => {
    await delay(300)
    const id = params.id as string
    const task = transcodingTasks.find(t => t.id === id)
    if (task) {
      task.status = 'processing'
      task.progress = 0
      task.error = undefined
    }
    return HttpResponse.json({ code: 0, message: 'success', data: task })
  }),

  http.post(`${API_BASE}/videos/:id/transcoding`, async ({ params }) => {
    await delay(300)
    const videoId = params.id as string
    const video = videos.find(v => v.id === videoId)
    const newTask: TranscodingTask = {
      id: String(Date.now()),
      videoId,
      videoTitle: video?.title || '',
      type: 'transcode',
      status: 'pending',
      progress: 0,
      input: { file: 'source.mp4', resolution: '1080p', codec: 'h264' },
      output: { resolution: '720p', codec: 'h264', bitrate: 4000 },
      startedAt: new Date().toISOString(),
    }
    transcodingTasks.push(newTask)
    return HttpResponse.json({ code: 0, message: 'success', data: newTask })
  }),
]
