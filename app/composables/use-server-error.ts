import type { H3Error } from 'h3'

export const useServerError = createGlobalState(() => ({
  serverError: ref<Omit<H3Error, 'toJSON'> | null>(null),
}))
