export const DOWNLOADING_TRACK_KEY = 'downloading-track'
export const DOWNLOADING_MULTI_TRACK_KEY = 'downloading-multi-track'
export const DOWNLOADING_ARTIST_TRACKS_KEY = 'downloading-artist-tracks'

export const useDownload = createSharedComposable(() => {
  const { $clientPosthog } = useNuxtApp()
  const serverStateTarget = useServerStateTarget()
  const { multiTracks } = useMultiTrack()

  const { isPending: isDownloadingTrack, mutate: downloadTrack } = useMutation({
    mutationFn: async ({ target, trackUrl }: { trackUrl: string, target: string }) => {
      serverStateTarget.value = target

      return $fetch('/api/track', {
        method: 'GET',
        onResponse: handleResponseError,
        query: {
          url: trackUrl,
        },
      })
    },
    mutationKey: [DOWNLOADING_TRACK_KEY],
    onSuccess: (url) => {
      downloadFile(url)
      $clientPosthog?.capture('single-file')
    },
  })

  const { isPending: isDownloadingMultiTracks, mutate: downloadMultiTracks } = useMutation({
    mutationFn: async () => {
      serverStateTarget.value = 'multi-track'

      const stream = await $fetch<ReadableStream>('/api/track/multi', {
        method: 'GET',
        onResponse: handleResponseError,
        query: {
          urls: Array.from(multiTracks.value),
        },
        responseType: 'stream',
      })

      const blob = await streamToBlob(stream)
      const url = URL.createObjectURL(blob)

      return { filename: `overcast-${Date.now()}.zip`, url }
    },
    mutationKey: [DOWNLOADING_MULTI_TRACK_KEY],
    onSuccess: ({ filename, url }) => {
      downloadFile(url, filename)
      $clientPosthog?.capture('multi')
    },
  })

  const { isPending: isDownloadingArtistTracks, mutate: downloadArtistTracks } = useMutation({
    mutationFn: async (artistUrl: string) => {
      serverStateTarget.value = 'artist'

      const stream = await $fetch<ReadableStream>('/api/user/tracks-audio', {
        method: 'GET',
        onResponse: handleResponseError,
        query: {
          url: artistUrl,
        },
      })

      const blob = await streamToBlob(stream)
      const url = URL.createObjectURL(blob)

      return { filename: `${artistUrl.split('/').pop()}-${Date.now()}.zip`, url }
    },
    mutationKey: [DOWNLOADING_ARTIST_TRACKS_KEY],
    onSuccess: ({ filename, url }) => {
      downloadFile(url, filename)
      $clientPosthog?.capture('download-artist-tracks')
    },
  })

  const { isPending: isDownloadingPlaylistTracks, mutate: downloadPlaylistTracks } = useMutation({
    mutationFn: async ({ ids, playlistUrl }: { ids: number[], playlistUrl: string }) => {
      serverStateTarget.value = 'playlist'

      const stream = await $fetch<ReadableStream>('/api/playlist/tracks-audio', {
        body: {
          ids,
          url: playlistUrl,
        },
        method: 'POST',
        onResponse: handleResponseError,
      })

      const blob = await streamToBlob(stream)
      const url = URL.createObjectURL(blob)

      return { filename: `${playlistUrl.split('/').pop()}-${Date.now()}.zip`, url }
    },
    mutationKey: [DOWNLOADING_ARTIST_TRACKS_KEY],
    onSuccess: ({ filename, url }) => {
      downloadFile(url, filename)
      $clientPosthog?.capture('download-playlist-tracks')
    },
  })

  const isMutating = useIsMutating()
  const isFetching = useIsFetching()

  const isBusy = computed<boolean>(() => isMutating.value > 0 || isFetching.value > 0)

  return {
    downloadArtistTracks,
    downloadMultiTracks,
    downloadPlaylistTracks,
    downloadTrack,
    isBusy,
    isDownloadingArtistTracks,
    isDownloadingMultiTracks,
    isDownloadingPlaylistTracks,
    isDownloadingTrack,
  }
})
