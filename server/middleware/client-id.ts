import type { EventHandlerRequest, H3Event } from 'h3'
import { Data, Effect, Option, pipe } from 'effect'
import { SOUNDCLOUD_API_URL } from '~~/shared/constants'

class ClientIdMiddlewareError extends Data.TaggedError('ClientIdMiddlewareError') <EffectH3Error> {}

function program(event: H3Event<EventHandlerRequest>) {
  return Effect.gen(function* () {
    const { get: getClientId, set: setClientId } = useClientId()

    const client_id = yield* Effect.promise(() => getClientId())

    const resolveRes = yield* pipe(
      Effect.tryPromise(() => $fetch(`${SOUNDCLOUD_API_URL}/resolve`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          client_id,
          url: 'https://soundcloud.com/user-434241656',
        },
      })),
      Effect.option,
    )

    if (Option.isSome(resolveRes)) {
      event.context.clientId = client_id
    }

    else {
      const res = yield* Effect.tryPromise({
        catch: e => new ClientIdMiddlewareError({
          cause: e,
          message: 'Failed to fetch SoundCloud HTML',
          statusCode: 500,
        }),
        try: async () => await fetch('https://soundcloud.com/'),
      })

      const html = yield* Effect.promise(() => res.text())

      const urls = yield* pipe(
        Effect.fromNullable(html.match(
          /https:\/\/a-v2\.sndcdn\.com\/assets\/\d+-[a-f0-9]+\.js/g,
        )),
        Effect.mapError(e => new ClientIdMiddlewareError({
          cause: e,
          message: 'Failed to match SoundCloud HTML',
          statusCode: 500,
        })),
      )

      const freshClientId = yield* Effect.firstSuccessOf(urls.map(getClientIdFromUrl))

      yield* Effect.promise(() => setClientId(freshClientId))
    }
  })
}

function getClientIdFromUrl(url: string) {
  return Effect.gen(function* () {
    const res = yield* Effect.tryPromise({
      catch: e => new ClientIdMiddlewareError({
        cause: e,
        message: 'Failed to fetch SoundCloud HTML',
        statusCode: 500,
      }),
      try: async () => await fetch(url),
    })
    const text = yield* Effect.promise(() => res.text())

    const clientId = text.match(/client_id:"([A-Z0-9]+)"/i)
    if (!clientId) {
      return yield* Effect.fail(new ClientIdMiddlewareError({
        message: 'No client ID found in SoundCloud HTML',
        statusCode: 500,
      }))
    }

    return clientId[1]
  })
}

export function useClientId() {
  const storage = useStorage<string>('clientId')

  return {
    get: async () => storage.getItem('value'),
    set: (clientId: string) => storage.setItem('value', clientId),
  }
}

export default defineEffectEventHandler(program)
