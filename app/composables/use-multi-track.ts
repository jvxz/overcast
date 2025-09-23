export const useMultiTrack = createGlobalState(() => ({
  multiTracks: ref<Set<string>>(new Set()),
}))
