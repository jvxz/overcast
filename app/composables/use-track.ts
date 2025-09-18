export const useTrack = createSharedComposable(() => {
  const { isPending: isDownloadingTrack, mutate: downloadTrack } = useMutation({
    mutationFn: async (trackUrl: string) => $fetch('/api/track', {
      method: 'GET',
      query: {
        url: trackUrl,
      },
    }),
    onSuccess: url => downloadFile(url),
  })

  return {
    downloadTrack,
    isDownloadingTrack,
  }
})
