/**
 * @returns string if track is cached, otherwise null
 */
export function getCachedTrackUrl(trackUrl: string) {
  return useTrackCacheStorage().getTrackFromCache(trackUrl)
}

export function useTrackCacheStorage() {
  async function addTrackToCache({ dir, presignedUrl, trackUrl }: { trackUrl: string, presignedUrl: string, dir: string }) {
    const storage = useStorage<string>('track-cache')

    await storage.setItem(`${btoa(trackUrl)}:url`, presignedUrl)
    await storage.setItem(`${btoa(trackUrl)}:created-at`, new Date().toISOString())
    await storage.setItem(`${btoa(trackUrl)}:dir`, dir)
  }

  async function getTrackFromCache(trackUrl: string) {
    const storage = useStorage<string>('track-cache')

    return storage.getItem(`${btoa(trackUrl)}:url`)
  }

  async function getTrackDirFromCache(trackUrl: string) {
    const storage = useStorage<string>('track-cache')

    return storage.getItem(`${btoa(trackUrl)}:dir`)
  }

  return {
    addTrackToCache,
    getTrackDirFromCache,
    getTrackFromCache,
  }
}
