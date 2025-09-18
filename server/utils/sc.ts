import type { H3Event } from 'h3'
import type { z } from 'zod'
import { Data, Effect, pipe } from 'effect'

interface Params<T> {
  event: H3Event
  endpoint: string
  options?: Parameters<typeof $fetch>[1]
  schema: z.ZodType<T>
  manualClientId?: string
}

class ScFetchError extends Data.TaggedError('ScFetchError')<EffectH3Error> {}
class ScUnauthorizedError extends Data.TaggedError('ScUnauthorizedError')<EffectH3Error> {}

/**
 * hit the soundcloud api
 */
export function $sc<T>({ endpoint, options, schema }: Params<T>) {
  return Effect.gen(function* () {
    const program = Effect.gen(function* () {
      const { getClientId } = useClientId()

      const clientId = yield* pipe(
        Effect.promise(() => getClientId()),
        Effect.flatMap(clientId => Effect.fromNullable(clientId)),
        Effect.mapError(e => new ScUnauthorizedError({
          cause: e,
          message: `No client ID found. Please try again`,
          statusCode: 401,
        })),
      )

      const url = endpoint.startsWith('http') ? endpoint : `${SOUNDCLOUD_API_URL}${endpoint}`

      const res = yield* Effect.tryPromise({
        catch: (e: any) => {
          if (e.statusCode === 401) {
            return new ScUnauthorizedError({
              message: `Unauthorized response from SoundCloud API. Please try again`,
              statusCode: 401,
            })
          }

          return new ScFetchError({
            cause: e,
            message: `Failed to get data from URL. Did you provide a valid URL?`,
            statusCode: 500,
          })
        },
        try: async () => $fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
          },
          params: {
            ...options?.params,
            client_id: clientId,
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
      .pipe(Effect.catchTag('ScUnauthorizedError', () => Effect.gen(function* () {
        yield* getFreshClientId()

        return yield* Effect.fail(new ScUnauthorizedError({
          message: `Unauthorized response from SoundCloud API. Please try again`,
          statusCode: 401,
        }))
      })))

    return yield* Effect.retry(program, {
      times: 1,
    })
  })
}
