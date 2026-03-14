import { delay, HttpResponse, http } from 'msw'
import type { Tag } from '@/features/tag/types'

const API_BASE = '/api'

const tags: Tag[] = [
  {
    id: '1',
    name: 'JavaScript',
    color: '#f7df1e',
    usageCount: 156,
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    name: 'TypeScript',
    color: '#3178c6',
    usageCount: 89,
    createdAt: '2024-02-20 14:20:00',
  },
  {
    id: '3',
    name: 'React',
    color: '#61dafb',
    usageCount: 234,
    createdAt: '2024-03-10 09:15:00',
  },
  {
    id: '4',
    name: 'Vue',
    color: '#42b883',
    usageCount: 78,
    createdAt: '2024-03-15 16:45:00',
  },
  {
    id: '5',
    name: 'Node.js',
    color: '#68a063',
    usageCount: 145,
    createdAt: '2024-04-01 08:00:00',
  },
  {
    id: '6',
    name: 'Python',
    color: '#3776ab',
    usageCount: 201,
    createdAt: '2024-04-15 11:30:00',
  },
]

export const tagHandlers = [
  http.get(`${API_BASE}/tags`, async () => {
    await delay(200)
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: tags,
    })
  }),

  http.get(`${API_BASE}/tags/:id`, async ({ params }) => {
    await delay(100)
    const tag = tags.find(t => t.id === params.id)
    if (!tag) {
      return HttpResponse.json({ code: 404, message: 'Tag not found' }, { status: 404 })
    }
    return HttpResponse.json({ code: 0, message: 'success', data: tag })
  }),

  http.post(`${API_BASE}/tags`, async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Partial<Tag>
    const newTag: Tag = {
      id: String(Date.now()),
      name: body.name || '',
      color: body.color,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    }
    tags.push(newTag)
    return HttpResponse.json({ code: 0, message: 'success', data: newTag })
  }),

  http.put(`${API_BASE}/tags/:id`, async ({ params, request }) => {
    await delay(300)
    const id = params.id as string
    const index = tags.findIndex(t => t.id === id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, message: 'Tag not found' }, { status: 404 })
    }
    const body = (await request.json()) as Partial<Tag>
    tags[index] = { ...tags[index], ...body }
    return HttpResponse.json({ code: 0, message: 'success', data: tags[index] })
  }),

  http.delete(`${API_BASE}/tags/:id`, async ({ params }) => {
    await delay(200)
    const id = params.id as string
    const index = tags.findIndex(t => t.id === id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, message: 'Tag not found' }, { status: 404 })
    }
    tags.splice(index, 1)
    return HttpResponse.json({ code: 0, message: 'success', data: { success: true } })
  }),
]
