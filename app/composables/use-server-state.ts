export const useServerState = createSharedComposable(() => {
  const { data: serverStateData, event: serverState } = useEventSource('/api/state', [...SERVER_STATE_EVENTS])

  return {
    serverState,
    serverStateData,
  }
})
