import type { H3Event } from 'h3'
import type { z } from 'zod'
import { SOUNDCLOUD_API_URL } from '#shared/constants'
import { Data, Effect } from 'effect'
import { $fetch } from 'ofetch'

interface Params<T> {
  event: H3Event
  endpoint: string
  options?: Parameters<typeof $fetch>[1]
  schema: z.ZodType<T>
}

class ScFetchError extends Data.TaggedError('ScFetchError')<EffectH3Error> {}

export function $sc<T>({ endpoint, event, options, schema }: Params<T>) {
  return Effect.gen(function* () {
    const url = endpoint.startsWith('http') ? endpoint : `${SOUNDCLOUD_API_URL}${endpoint}`

    const res = yield* Effect.tryPromise({
      catch: e => new ScFetchError({
        cause: e,
        message: `Failed to get data from URL. Did you provide a valid URL?`,
        statusCode: 500,
      }),
      try: async () => $fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          'Content-Type': 'application/json',
        },
        params: {
          ...options?.params,
          client_id: event.context.clientId,
        },
      }),
    })

    return yield* Effect.try({
      catch: e => new ScFetchError({
        cause: e,
        message: `Invalid response from ${endpoint}`,
        statusCode: 422,
      }),
      try: () => schema.parse(res),
    })
  })
}
