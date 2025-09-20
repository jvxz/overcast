import type { H3Event } from 'h3'
import type { z } from 'zod'

export async function validateQueryZod<T extends z.ZodType>(event: H3Event, schema: T) {
  const res = await getValidatedQuery(event, schema.safeParse)

  if (!res.success) {
    throw createError({
      data: res.error,
      message: 'Invalid query parameters',
      statusCode: 422,
    })
  }

  return res.data
}
