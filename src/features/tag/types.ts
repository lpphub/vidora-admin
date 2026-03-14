export type TagType = 0 | 1
export type TagStatus = 'enabled' | 'disabled'

export interface Tag {
  id: string
  name: string
  slug: string
  type: TagType
  color?: string
  sortOrder?: number
  status?: TagStatus
  createdAt: string
}
