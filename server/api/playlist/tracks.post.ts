const BodySchema = z.object({
  ids: z.array(z.number()),
})
export default defineEventHandler(async (event): Promise<TrackData[]> => {
  const { ids } = await validateBodyZod(event, BodySchema)

  if (!ids.length) {
    return []
  }

  return await getTrackMeta(ids)
})
