import { authHandlers } from './auth'
import { profileHandlers } from './profile'
import { tagHandlers } from './tag'

export const handlers = [...authHandlers, ...profileHandlers, ...tagHandlers]
