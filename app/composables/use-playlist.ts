export const usePlaylistUrl = createGlobalState(() => ref<string | null>(null))

const usePlaylistValues = createGlobalState(() => ({
  allTrackIds: ref<number[]>([]),
  cachedTracks: shallowRef<TrackData[]>([]),
  chunkTotal: ref(0),
  currentChunkIndex: ref(0),
}))

export function usePlaylist(opts?: {
  onPlaylistUrlChange?: () => void
}) {
  const { allTrackIds, cachedTracks, chunkTotal, currentChunkIndex } = usePlaylistValues()
  const playlistUrl = usePlaylistUrl()

  const { data: playlistTrackChunks, isLoading: isLoadingPlaylistTrackChunks } = useQuery({
    enabled: computed(() => !!playlistUrl.value),
    queryFn: async () => $fetch('/api/playlist/ids', {
      onResponse: handleResponseError,
      query: {
        url: playlistUrl.value,
      },
    }),
    queryKey: [playlistUrl],
    staleTime: 600000,
  })

  const idsToFetch = computed(() => playlistTrackChunks.value?.[currentChunkIndex.value] ?? [])

  const { isLoading: isLoadingNextChunk, refetch: getChunk } = useQuery({
    enabled: computed(() => !!playlistTrackChunks.value && currentChunkIndex.value < chunkTotal.value),
    queryFn: async () => {
      const chunks = await $fetch('/api/playlist/tracks', {
        body: {
          ids: idsToFetch.value,
        },
        method: 'POST',
        onResponse: handleResponseError,
      })

      cachedTracks.value = [...cachedTracks.value, ...chunks.map(track => markRaw(track))]

      return chunks
    },
    queryKey: computed(() => playlistUrl.value ? [playlistUrl.value, currentChunkIndex.value] : []),
    staleTime: 600000,
  })

  function getNextChunk() {
    currentChunkIndex.value = currentChunkIndex.value + 1
    getChunk()
  }

  watch(playlistTrackChunks, () => {
    if (playlistTrackChunks.value) {
      allTrackIds.value = playlistTrackChunks.value.flat()
      chunkTotal.value = playlistTrackChunks.value.length
      getChunk()
    }
  })

  watch(playlistUrl, (newUrl) => {
    if (newUrl) {
      currentChunkIndex.value = 0
      chunkTotal.value = 0
      allTrackIds.value = []
      cachedTracks.value = []
      opts?.onPlaylistUrlChange?.()
    }
  }, {
    flush: 'sync',
  })

  const canLoadMore = computed(() => currentChunkIndex.value < chunkTotal.value && !isLoadingNextChunk.value)

  return {
    allTrackIds,
    cachedTracks,
    canLoadMore,
    getNextChunk,
    isLoadingNextChunk,
    isLoadingPlaylistTrackChunks,
  }
}
