const QuerySchema = z.object({
  url: SoundCloudUrlSchema,
})

export default defineEventHandler(async (event) => {
  const { url } = await validateQueryZod(event, QuerySchema)

  const { setState } = useState(event.context.sessionId)
  await setState('preparing')

  let totalDuration = 0
  let nextHref: string = ''
  const artistTracks: string[] = []

  while (true) {
    const tracks = await getArtistTracks(url, {
      // limit: 32,
      nextHref,
    })

    if (tracks.next_href) {
      nextHref = tracks.next_href
    }
    else {
      break
    }

    artistTracks.push(...tracks.collection.map(track => track.permalink_url))
    totalDuration += tracks.collection.reduce((acc, track) => acc + track.duration, 0)
  }

  if (totalDuration > MAX_MULTI_TRACK_DURATION) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Total duration of tracks is greater than the maximum allowed (2.5 hours)',
    })
  }

  const zipStream = await getMultiTrackZipStream({
    event,
    trackUrls: artistTracks,
  })

  const permalink = url.split('/').pop()

  setHeader(event, 'Content-Type', 'application/zip')
  setHeader(event, 'Content-Disposition', `attachment; filename=${permalink}-${Date.now()}.zip`)

  return zipStream
})
