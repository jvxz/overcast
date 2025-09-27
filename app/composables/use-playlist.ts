export const usePlaylist = createSharedComposable((opts?: {
  onPlaylistUrlChange?: () => void
}) => {
  const allTrackIds = ref<number[]>([])
  const cachedTracks = shallowRef<TrackData[]>([])
  const chunkTotal = ref(0)
  const currentChunkIndex = ref(0)
  const playlistUrl = ref<string | null>(null)

  const { data: playlistTrackChunks, isLoading: isLoadingPlaylistTrackChunks } = useQuery({
    enabled: computed(() => !!playlistUrl.value),
    queryFn: async () => $fetch('/api/playlist/ids', {
      onResponse: handleResponseError,
      query: {
        url: playlistUrl.value,
      },
    }),
    queryKey: [playlistUrl],
    retry: false,
    staleTime: 600000,
  })

  const idsToFetch = computed(() => playlistTrackChunks.value?.[currentChunkIndex.value] ?? [])

  const { data: currentChunkData, isLoading: isLoadingNextChunk, refetch: getChunk } = useQuery({
    enabled: computed(() => playlistTrackChunks.value && currentChunkIndex.value < chunkTotal.value),
    queryFn: async () => $fetch('/api/playlist/tracks', {
      body: {
        ids: idsToFetch.value,
      },
      method: 'POST',
      onResponse: handleResponseError,
    }),
    queryKey: computed(() => [playlistUrl.value, currentChunkIndex.value]),
    retry: false,
    staleTime: 600000,
  })

  function getNextChunk() {
    currentChunkIndex.value = currentChunkIndex.value + 1
    getChunk()
  }

  watch(currentChunkData, (newChunk) => {
    if (newChunk) {
      const rawTracks = newChunk.map(track => markRaw(track))
      cachedTracks.value = [...cachedTracks.value, ...rawTracks]
    }
  })

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
    playlistUrl,
  }
})
