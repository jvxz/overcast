const QuerySchema = z.object({
  nextHref: z.string().nullable(),
  url: SoundCloudUrlSchema,
})

export default defineEventHandler(async (event) => {
  const { nextHref, url } = await validateQueryZod(event, QuerySchema)

  return await getArtistTracks(url, {
    nextHref,
  })
})
