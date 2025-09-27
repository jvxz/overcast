const BodySchema = z.object({
  ids: z.array(z.number()),
  url: SoundCloudUrlSchema,
})

export default defineEventHandler(async (event) => {
  const { ids, url } = await validateBodyZod(event, BodySchema)

  const { setState } = useState(event.context.sessionId)
  await setState('preparing')

  const playlist = await getPlaylistMeta(url)

  const playlistTracks = await getTrackMeta(ids)
  const totalDuration = playlistTracks.reduce((acc, track) => acc + track.duration, 0)

  if (totalDuration > MAX_MULTI_TRACK_DURATION) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Total duration of tracks is greater than the maximum allowed (2.5 hours)',
    })
  }

  const trackUrls = playlistTracks.map(track => track.permalink_url)

  const zipStream = await getMultiTrackZipStream({
    event,
    trackUrls,
  })

  const permalink = playlist.permalink.split('/').pop()

  setHeader(event, 'Content-Type', 'application/zip')
  setHeader(event, 'Content-Disposition', `attachment; filename=${permalink}-${Date.now()}.zip`)

  return zipStream
})
