import type { H3Error } from 'h3'

export function useServerError() {
  return useState('server-error', () => null as Omit<H3Error, 'toJSON'> | null)
}
