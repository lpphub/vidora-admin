import type { Permission } from './types'

export const permissionApi = {
  list: (): Promise<Permission[]> => {
    throw new Error('Not implemented')
  },

  get: (_id: number): Promise<Permission> => {
    throw new Error('Not implemented')
  },

  create: (_data: Partial<Permission>): Promise<Permission> => {
    throw new Error('Not implemented')
  },

  update: (_id: number, _data: Partial<Permission>): Promise<Permission> => {
    throw new Error('Not implemented')
  },

  delete: (_id: number): Promise<void> => {
    throw new Error('Not implemented')
  },
}
