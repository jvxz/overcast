export const useServerState = createSharedComposable(() => {
  const { $sessionId } = useNuxtApp()

  const { data: serverStateData, event: serverState } = useEventSource(`/api/state?id=${$sessionId}`, [...SERVER_STATE_EVENTS])

  return {
    serverState,
    serverStateData,
  }
})
