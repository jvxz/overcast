import { Effect } from 'effect'

/**
 * @returns string if track is cached, otherwise null
 */
export function getCachedTrackUrl(trackUrl: string) {
  return Effect.promise(async () => useTrackCacheStorage().getTrackFromCache(trackUrl))
}

export function useTrackCacheStorage() {
  async function addTrackToCache(trackUrl: string, presignedUrl: string) {
    const storage = useStorage<string>('track-cache')

    return Promise.all([storage.setItem(`${trackUrl}:url`, presignedUrl), storage.setItem(`${trackUrl}:created-at`, new Date().toISOString())])
  }

  async function getTrackFromCache(trackUrl: string) {
    const storage = useStorage<string>('track-cache')

    return storage.getItem(`${trackUrl}:url`)
  }

  return {
    addTrackToCache,
    getTrackFromCache,
  }
}
