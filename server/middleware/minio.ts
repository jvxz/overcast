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
        const minio = new Minio.Client({
          accessKey: process.env.MINIO_ACCESS_KEY,
          endPoint: process.env.MINIO_PUBLIC_HOST!,
          port: Number(process.env.MINIO_PUBLIC_PORT),
          secretKey: process.env.MINIO_SECRET_KEY,
        })

        event.context.minio = minio
      },
    })
  })
}

export default defineEffectEventHandler(program)
