import { Data, Effect, pipe } from 'effect'

class ClientIdError extends Data.TaggedError('ClientIdError') <EffectH3Error> {}

const message = 'Failed to refresh client ID. Please try again later, or contact support if the problem persists'

export function getFreshClientId() {
  return Effect.gen(function* () {
    const res = yield* Effect.tryPromise({
      catch: e => new ClientIdError({
        cause: e,
        message,
        statusCode: 500,
      }),
      try: async () => await fetch('https://soundcloud.com/'),
    })

    const html = yield* Effect.promise(() => res.text())

    const urls = yield* pipe(
      Effect.fromNullable(html.match(
        /https:\/\/a-v2\.sndcdn\.com\/assets\/\d+-[a-f0-9]+\.js/g,
      )),
      Effect.mapError(e => new ClientIdError({
        cause: e,
        message,
        statusCode: 500,
      })),
    )

    const freshClientId = yield* Effect.firstSuccessOf(urls.map(getClientIdFromUrl))

    yield* Effect.promise(() => useClientId().setClientId(freshClientId))

    return freshClientId
  })
}

function getClientIdFromUrl(url: string) {
  return Effect.gen(function* () {
    const res = yield* Effect.tryPromise({
      catch: e => new ClientIdError({
        cause: e,
        message,
        statusCode: 500,
      }),
      try: async () => await fetch(url),
    })

    const clientId = yield* pipe(
      Effect.promise(async () => await res.text()),
      Effect.flatMap(text => Effect.fromNullable(text.match(/client_id:"([A-Z0-9]+)"/i))),
      Effect.mapError(e => new ClientIdError({
        cause: e,
        message,
        statusCode: 500,
      })),
    )

    return clientId[1]
  })
}

export function useClientId() {
  const storage = useStorage<string>('clientId')

  return {
    getClientId: async () => storage.getItem('value'),
    setClientId: (clientId: string) => storage.setItem('value', clientId),
  }
}
