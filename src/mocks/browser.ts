import { setupWorker } from 'msw/browser'
import { env } from '@/shared/utils/env'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export async function startMsw() {
  if (!env.IS_DEV) {
    return
  }

  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
