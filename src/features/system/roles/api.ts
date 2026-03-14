import type { Role } from './types'

export const roleApi = {
  list: () => Promise.resolve<Role[]>([]),
  get: (_id: number) => Promise.resolve<Role | null>(null),
  create: (_data: Partial<Role>) => Promise.resolve<Role | null>(null),
  update: (_id: number, _data: Partial<Role>) => Promise.resolve<Role | null>(null),
  delete: (_id: number) => Promise.resolve<void>(undefined),
}
