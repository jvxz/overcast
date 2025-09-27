const QuerySchema = z.object({
  url: SoundCloudUrlSchema,
})

export default defineEventHandler(async (event) => {
  const { url } = await validateQueryZod(event, QuerySchema)

  const { tracks: trackIds } = await $sc({
    endpoint: '/resolve',
    options: {
      params: {
        url,
      },
    },
    schema: z.object({
      tracks: z.array(z.object({
        id: z.number(),
      })),
    }),
    type: 'playlist',
  })

  const chunkSize = 16

  const trackIdChunks: number[][] = []
  for (let i = 0; i < trackIds.length; i += chunkSize) {
    const chunk = trackIds.slice(i, i + chunkSize)
    trackIdChunks.push(chunk.map(track => track.id))
  }

  return trackIdChunks
})
