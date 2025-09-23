import { useMutationState as _useMutationState } from '@tanstack/vue-query'

export const useMutationState = createSharedComposable(() => {
  const _isDownloadingTrack = _useMutationState({
    filters: {
      mutationKey: [DOWNLOADING_TRACK_KEY],
    },
  })

  const isDownloadingTrack = computed(() => _isDownloadingTrack.value.some(e => e.status === 'pending'))

  return {
    isDownloadingTrack,
  }
})
