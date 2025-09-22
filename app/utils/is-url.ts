import { z } from 'zod'

export function isUrl(url: string) {
  return z.url().safeParse(url).success
}
