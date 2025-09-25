export async function getArtistTracks(artistUrl: string, opts?: {
  nextHref?: string | null
  limit?: number
}) {
  if (opts?.nextHref) {
    return $sc({
      endpoint: opts.nextHref,
      options: {
        params: {
          linked_partitioning: true,
        },
        query: {
          limit: opts.limit ?? 16,
        },
      },
      schema: UserTracksSchema,
    })
  }

  const artist = await $sc({
    endpoint: '/resolve',
    options: {
      params: {
        url: artistUrl,
      },
    },
    schema: UserSchema,
  })

  return await $sc({
    endpoint: `/users/${artist.id}/tracks`,
    options: {
      params: {
        linked_partitioning: true,
      },
      query: {
        limit: 16,
      },
    },
    schema: UserTracksSchema,
  })
}
