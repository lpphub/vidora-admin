import type { User } from './types'

export const userApi = {
  list: async (): Promise<User[]> => {
    return []
  },
  create: async (_data: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    return {} as User
  },
  update: async (_id: number, _data: Partial<User>): Promise<User> => {
    return {} as User
  },
  delete: async (_id: number): Promise<void> => {},
}
