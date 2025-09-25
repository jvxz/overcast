const QuerySchema = z.object({
  urls: z.array(SoundCloudUrlSchema),
})

export default defineEventHandler(async (event) => {
  const { urls: trackUrls } = await validateQueryZod(event, QuerySchema)

  if (trackUrls.length <= 1) {
    throw createError({
      statusCode: 403,
      statusMessage: 'At least 2 tracks are required to download',
    })
  }

  const zipStream = await getMultiTrackZipStream({
    event,
    trackUrls,
  })

  setHeader(event, 'Content-Type', 'application/zip')
  setHeader(event, 'Content-Disposition', `attachment; filename=overcast-${Date.now()}.zip`)

  return zipStream
})
