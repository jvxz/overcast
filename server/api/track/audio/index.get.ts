import { Readable } from 'node:stream'
import p from 'p-limit'

const limit = p(10)

const QuerySchema = z.object({
  url: SoundCloudUrlSchema,
})

export default defineEventHandler(async (event) => {
  const { url } = await validateQueryZod(event, QuerySchema)

  const { setProgress, setState } = useState()

  await setState('downloading')

  const trackData = await $fetch('/api/track/meta', {
    query: {
      url,
    },
  })

  const audioUrl = getAudioUrl(trackData)

  const { url: playlistUrl } = await $sc({
    endpoint: audioUrl,
    options: {
      params: {
        response_format: 'm3u8',
      },
    },
    schema: z.object({
      url: z.url(),
    }),
  })

  const m3u8 = await $sc({
    endpoint: playlistUrl,
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
      let localProgress = 0

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
            localProgress++
            setProgress(localProgress / segments.length)
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

  await event.context.minio.putObject('overcast', `cache/${filename}`, Readable.fromWeb(transformStream as import('node:stream/web').ReadableStream))

  const presignedUrl = await event.context.minio.presignedGetObject('overcast', `cache/${filename}`, PRESIGNED_URL_EXPIRATION)

  if (useAppConfig().trackCaching) {
    const { addTrackToCache } = useTrackCacheStorage()

    // add track to cache in the background
    addTrackToCache(url, presignedUrl)
  }

  await setState('idle')

  return presignedUrl
})

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
