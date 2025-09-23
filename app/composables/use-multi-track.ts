export const useMultiTrack = createGlobalState(() => {
  const multiTracks = ref<Set<string>>(new Set())

  function addTrackToMultiTrack(trackUrl: string) {
    multiTracks.value.add(trackUrl)
  }

  function removeTrackFromMultiTrack(trackUrl: string) {
    multiTracks.value.delete(trackUrl)
  }

  return {
    addTrackToMultiTrack,
    multiTracks,
    removeTrackFromMultiTrack,
  }
})
