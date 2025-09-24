const QuerySchema = z.object({
  url: SoundCloudUrlSchema,
})

export default defineEventHandler(async (event) => {
  const { url } = await validateQueryZod(event, QuerySchema)

  return getTrackMeta(url)
})
