export const DOWNLOADING_TRACK_KEY = 'downloading-track'

export const useTrack = createSharedComposable(() => {
  const serverStateTarget = useServerStateTarget()

  const { isPending: isDownloadingTrack, mutate: downloadTrack } = useMutation({
    mutationFn: async ({ target, trackUrl }: { trackUrl: string, target: string }) => {
      serverStateTarget.value = target

      return $fetch('/api/track', {
        method: 'GET',
        onResponse: handleResponseError,
        query: {
          url: trackUrl,
        },
        retry: false,
      })
    },
    mutationKey: [DOWNLOADING_TRACK_KEY],
    onSuccess: url => downloadFile(url),
  })

  return {
    downloadTrack,
    isDownloadingTrack,
  }
})
