import { authHandlers } from './auth'
import { profileHandlers } from './profile'
import { tagHandlers } from './tag'
import { videoHandlers } from './video'

export const handlers = [...authHandlers, ...profileHandlers, ...tagHandlers, ...videoHandlers]
