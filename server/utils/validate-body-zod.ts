import type { H3Event } from 'h3'
import type { z } from 'zod'

export async function validateBodyZod<T extends z.ZodType>(event: H3Event, schema: T) {
  const res = await readValidatedBody(event, schema.safeParse)

  if (!res.success) {
    throw createError({
      data: res.error,
      message: 'Invalid body',
      statusCode: 422,
    })
  }

  return res.data
}
