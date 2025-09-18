import type { EventHandlerRequest, H3Event } from 'h3'
import { Data, Effect } from 'effect'
import * as Minio from 'minio'

class MinioMiddlewareError extends Data.TaggedError('MinioMiddlewareError')<EffectH3Error> {}

function program(event: H3Event<EventHandlerRequest>) {
  return Effect.gen(function* () {
    if (event.context.minio) {
      return
    }

    yield* Effect.tryPromise({
      catch: (e) => {
        return new MinioMiddlewareError({
          cause: e,
          message: 'Failed to create Minio client',
          statusCode: 500,
        })
      },
      try: async () => {
        const { minio: minioCreds } = useRuntimeConfig()

        const minio = new Minio.Client({
          accessKey: minioCreds.accessKey,
          endPoint: minioCreds.host,
          pathStyle: true,
          port: Number(minioCreds.port),
          region: 'us-east-1',
          secretKey: minioCreds.secretKey,
          transportAgent: undefined,
          useSSL: Number(minioCreds.port) === 443,
        })

        event.context.minio = minio
      },
    })
  })
}

export default defineEffectEventHandler(program)
