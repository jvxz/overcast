const QuerySchema = z.object({
  url: SoundCloudUrlSchema,
})

export default defineEventHandler(async (event) => {
  const { url } = await validateQueryZod(event, QuerySchema)

  return $sc({
    endpoint: '/resolve',
    options: {
      params: {
        url,
      },
    },
    schema: TrackSchema,
  })
})
