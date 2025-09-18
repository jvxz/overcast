import { Effect } from 'effect'

/**
 * @returns string if track is cached, otherwise null
 */
export function getCachedTrackUrl(trackUrl: string) {
  return Effect.promise(async () => useTrackCacheStorage().getTrackFromCache(trackUrl))
}

export function useTrackCacheStorage() {
  async function addTrackToCache(trackUrl: string, presignedUrl: string) {
    const storage = useStorage<string>(trackUrl)

    return Promise.all([storage.setItem('url', presignedUrl), storage.setItem('created-at', new Date().toISOString())])
  }

  async function getTrackFromCache(trackUrl: string) {
    const storage = useStorage<string>(trackUrl)

    return storage.getItem('url')
  }

  return {
    addTrackToCache,
    getTrackFromCache,
  }
}
