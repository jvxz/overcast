const QuerySchema = z.object({
  url: SoundCloudUrlSchema,
})

export default defineEventHandler(async (event) => {
  const { url: trackUrl } = await validateQueryZod(event, QuerySchema)

  const { resetProgress, setState } = useState()

  await resetProgress()
  await setState('downloading')

  const cachedTrackUrl = await getCachedTrackUrl(trackUrl)

  if (cachedTrackUrl) {
    await setState('idle')

    return cachedTrackUrl
  }

  return getTrackAudioUrl({
    event,
    url: trackUrl,
  })
})
