import type { EventHandlerRequest, H3Event } from 'h3'
import { Data, Effect } from 'effect'
import p from 'p-limit'

const limit = p(10)

class TrackAudioError extends Data.TaggedError('TrackAudioError')<EffectH3Error> { }

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

    const coreStream = yield* Effect.tryPromise({
      catch: e => new TrackAudioError({
        cause: e,
        message: 'An unexpected error occurred while downloading the audio',
        statusCode: 500,
      }),
      try: async () => new ReadableStream({
        start: async (controller) => {
          // const before = performance.now()
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

          // const after = performance.now()

          // console.log(`Time taken: ${after - before}ms`)
          controller.close()
        },
      }),

    })

    setHeader(event, 'Content-Type', 'audio/mpeg')

    return coreStream
  })
}

export default defineEffectEventHandler(program)
