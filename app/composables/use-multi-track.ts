export const useMultiTrackSet = () => useState('multi-track', () => new Set<string>())

export const useMultiTrack = createGlobalState(() => {
  const qc = useQueryClient()
  const multiTracks = useMultiTrackSet()

  function addTrackToMultiTrack(trackUrl: string) {
    multiTracks.value.add(trackUrl)
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
