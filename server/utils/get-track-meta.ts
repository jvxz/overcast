export async function getTrackMeta(url: string) {
  return $sc({
    endpoint: '/resolve',
    options: {
      params: {
        url,
      },
      retry: false,
    },
    schema: TrackSchema,
    type: 'track',
  })
}
