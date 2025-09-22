type State = typeof SERVER_STATE_EVENTS[number]

/**
 * control the server's state. state meaning the current action the server is performing
 *
 * updated @ server/api/state.get.ts
 */
export function useState(sessionId: string) {
  const { getItem, setItem, watch: watchState } = useStorage<string>(`state:${sessionId}`)

  const setState = (state: State) => setItem(state, '')

  const getProgress = () => getItem('downloading')

  const setProgress = (progress: number) => setItem('downloading', progress.toString())

  const resetProgress = () => setItem('downloading', '0')

  return {
    /**
     * get the current progress of the server
     *
     * @returns progress number (between 0 & 1)
     */
    getProgress,
    /**
     * reset the current progress of the server to 0
     */
    resetProgress,
    /**
     * set the current progress of the server
     *
     * @param progress
     */
    setProgress,
    /**
     * set the current state of the server (current action the server is performing)
     *
     * @param state "downloading" or "idle" or "uploading"
     */
    setState,
    watchState,
  }
}
