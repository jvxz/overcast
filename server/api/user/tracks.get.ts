const QuerySchema = z.object({
  nextHref: z.string().nullable(),
  url: SoundCloudUrlSchema,
})

export default defineEventHandler(async (event) => {
  const { nextHref, url } = await validateQueryZod(event, QuerySchema)

  if (nextHref) {
    return $sc({
      endpoint: nextHref,
      options: {
        params: {
          linked_partitioning: true,
        },
      },
      schema: UserTracksSchema,
    })
  }

  const user = await $sc({
    endpoint: '/resolve',
    options: {
      params: {
        url,
      },
    },
    schema: UserSchema,
  })

  const userTracks = await $sc({
    endpoint: `/users/${user.id}/tracks`,
    options: {
      params: {
        linked_partitioning: true,
      },
    },
    schema: UserTracksSchema,
  })

  return userTracks
})
