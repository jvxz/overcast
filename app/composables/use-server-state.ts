const useServerStateEvents = createSharedComposable(() => {
  const { $sessionId } = useNuxtApp()

  return useEventSource(`/api/state?id=${$sessionId}`, [...SERVER_STATE_EVENTS])
})

export const useServerStateTarget = createGlobalState(() => ref<'index' | string & {}>('index'))

export function useServerState(target: MaybeRefOrGetter<'index' | string & {}>) {
  const { data: _serverStateData, event: serverState } = useServerStateEvents()
  const serverStateTarget = useServerStateTarget()

  const isTarget = computed(() => toValue(target) === serverStateTarget.value)
  const serverStateData = computed(() => isTarget.value ? _serverStateData.value : null)
  const trackDownloadProgress = computed(() => serverState.value === 'downloading' ? (Number(serverStateData.value) * 100).toFixed(5) : 0)

  return {
    isTarget,
    serverState,
    serverStateData,
    /**
     * an identifier for the target of the server state. used to determine if the server state is for the target
     *
     * you should probably set this to the track url for individual downloads, or a unique id for the source of the download
     */
    serverStateTarget,
    trackDownloadProgress,
  }
}
