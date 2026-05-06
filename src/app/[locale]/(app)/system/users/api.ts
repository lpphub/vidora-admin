import type { SystemUser } from './types'

export const userApi = {
  list: async (): Promise<SystemUser[]> => {
    return []
  },
  create: async (_data: Omit<SystemUser, 'id' | 'createdAt'>): Promise<SystemUser> => {
    return {} as SystemUser
  },
  update: async (_id: number, _data: Partial<SystemUser>): Promise<SystemUser> => {
    return {} as SystemUser
  },
  delete: async (_id: number): Promise<void> => {},
}
