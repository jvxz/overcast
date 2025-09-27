export async function getTrackMeta(input: string): Promise<TrackData>
export async function getTrackMeta(input: number[]): Promise<TrackData[]>

export async function getTrackMeta(input: string | number[]): Promise<TrackData | TrackData[]> {
  if (typeof input === 'string') {
    return $sc({
      endpoint: '/resolve',
      options: {
        params: {
          url: input,
        },
        retry: false,
      },
      schema: TrackSchema,
      type: 'track',
    })
  }

  return $sc({
    endpoint: '/tracks',
    options: {
      params: {
        ids: input.join(','),
        linked_partitioning: true,
      },
      retry: false,
    },
    schema: z.array(TrackSchema),
    type: 'track',
  })
}
