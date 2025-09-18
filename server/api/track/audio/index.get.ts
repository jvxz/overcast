import type { EventHandlerRequest, H3Event } from 'h3'
import { Readable } from 'node:stream'
import { Data, Effect } from 'effect'
import p from 'p-limit'

const limit = p(10)

class TrackAudioError extends Data.TaggedError('TrackAudioError') <EffectH3Error> {}

const QuerySchema = z.object({
  url: SoundCloudUrlSchema,
})

function program(event: H3Event<EventHandlerRequest>) {
  return Effect.gen(function* () {
    const { url } = yield* validateQueryEffect(event, QuerySchema)

    const trackData = yield* Effect.tryPromise({
      catch: e => new TrackAudioError({
        cause: e,
        message: 'Failed to get track data',
        statusCode: 500,
      }),
      try: async () => event.$fetch('/api/track/meta', {
        query: {
          url,
        },
      }),
    })

    const audioUrl = yield* getAudioUrl(trackData)

    const { url: playlistUrl } = yield* $sc({
      endpoint: audioUrl,
      event,
      options: {
        params: {
          response_format: 'm3u8',
        },
      },
      schema: z.object({
        url: z.url(),
      }),
    })

    const m3u8 = yield* $sc({
      endpoint: playlistUrl,
      event,
      options: {
        responseType: 'text',
      },
      schema: z.string(),
    })

    const segments = m3u8
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(segment => new URL(segment, audioUrl).toString())

    const coreStream = new ReadableStream({
      start: async (controller) => {
        const chunks: {
          chunk: Uint8Array
          index: number
        }[] = []

        const procedures = segments.map(async (segment, index) => limit(async () => {
          const res = await fetch(segment)
          const reader = res.body?.getReader()

          if (!reader) {
            throw new Error('No reader found in segment response')
          }

          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              break
            }

            chunks.push({ chunk: value, index })
          }
        }))

        await Promise.all(procedures)

        const sortedChunks = chunks.sort((a, b) => a.index - b.index)

        for (const chunk of sortedChunks) {
          controller.enqueue(chunk.chunk)
        }

        controller.close()
      },
    })

    const transformStream = coreStream.pipeThrough(
      transformAudio(trackData),
    )

    const filename = getTrackFilename(trackData)

    yield* Effect.tryPromise({
      catch: e => new TrackAudioError({
        cause: e,
        message: 'Failed to put object',
        statusCode: 500,
      }),
      try: async () => event.context.minio.putObject('overcast', `cache/${filename}`, Readable.fromWeb(transformStream as import('node:stream/web').ReadableStream)),
    })

    const presignedUrl = yield* Effect.tryPromise({
      catch: e => new TrackAudioError({
        cause: e,
        message: 'Failed to get presigned URL',
        statusCode: 500,
      }),
      try: async () => event.context.minio.presignedGetObject('overcast', `cache/${filename}`, PRESIGNED_URL_EXPIRATION),
    })

    // add track to cache in the background
    yield* Effect.forkDaemon(Effect.gen(function* () {
      const { addTrackToCache } = useTrackCacheStorage()

      yield* Effect.promise(async () => addTrackToCache(url, presignedUrl))
    }))

    return presignedUrl
  })
}

function transformAudio(trackMeta: TrackData) {
  const chunks: Uint8Array[] = []

  return new TransformStream({
    flush: async (controller) => {
      const buffer = Buffer.concat(chunks)
      const taggedBuffer = await writeTrackTags({
        audioBuffer: buffer.buffer,
        trackMeta,
      })
      controller.enqueue(Buffer.from(taggedBuffer))
    },
    transform: async (chunk) => {
      chunks.push(chunk)
    },
  })
}

export default defineEffectEventHandler(program)
