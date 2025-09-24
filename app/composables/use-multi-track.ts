export const useMultiTrackSet = () => useState('multi-track', () => new Set<string>())
export const useMultiTrackSearch = createGlobalState(() => ref(''))

export const useMultiTrack = createGlobalState(() => {
  const qc = useQueryClient()
  const multiTracks = useMultiTrackSet()

  async function addTrackToMultiTrack(trackUrl: string) {
    multiTracks.value.add(trackUrl)

    await qc.ensureQueryData({
      queryFn: async () => $fetch('/api/track/meta', {
        onResponse: handleResponseError,
        query: {
          url: trackUrl,
        },
      }),
      queryKey: [trackUrl],
      revalidateIfStale: false,
    })
  }

  function removeTrackFromMultiTrack(trackUrl: string) {
    multiTracks.value.delete(trackUrl)
  }

  const containsInvalidTrack = computed(() => Array.from(multiTracks.value).some(url => qc.getQueryState([url])?.status === 'error'))

  return {
    addTrackToMultiTrack,
    containsInvalidTrack,
    multiTracks,
    removeTrackFromMultiTrack,
  }
})
