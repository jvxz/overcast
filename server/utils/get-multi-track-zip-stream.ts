import type { H3Event } from 'h3'
import p from 'p-limit'
import { ZipFile } from 'yazl'

const limit = p(4)

export async function getMultiTrackZipStream(opts: {
  event: H3Event
  trackUrls: string[]
}) {
  const { getTrackDirFromCache } = useTrackCacheStorage()
  const { setProgress, setState } = useState(opts.event.context.sessionId)

  await setState('zipping')
  await setProgress(0, 'zipping')

  const zip = new ZipFile()

  const totalTracks = opts.trackUrls.length
  let processedTracks = 0

  const procedures = opts.trackUrls.map(async trackUrl => limit(async () => {
    let trackObjectDir = await getTrackDirFromCache(trackUrl)

    if (!trackObjectDir) {
      await getTrackAudioUrl({
        doStateUpdates: false,
        event: opts.event,
        url: trackUrl,
        waitForCache: true,
      })

      trackObjectDir = await getTrackDirFromCache(trackUrl)
    }

    if (!trackObjectDir) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Track object directory not found',
      })
    }

    const trackObjectStream = await opts.event.context.minio.getObject('overcast', trackObjectDir)

    const chunks: Buffer[] = []
    for await (const chunk of trackObjectStream) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)

    const filename = trackObjectDir.replace('cache/', '')

    zip.addBuffer(buffer, filename)
    processedTracks++
    await setProgress(processedTracks / totalTracks, 'zipping')
  }))

  zip.outputStream.once('close', async () => await setState('idle'))

  await Promise.all(procedures)

  zip.end()

  return zip.outputStream
}
