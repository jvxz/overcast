export async function getPlaylistMeta(url: string) {
  return await $sc({
    endpoint: '/resolve',
    options: {
      params: {
        url,
      },
    },
    schema: PlaylistResolveSchema,
    type: 'playlist',
  })
}
