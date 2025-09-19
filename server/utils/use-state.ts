type State = typeof SERVER_STATE_EVENTS[number]

/**
 * control the server's state. state meaning the current action the server is performing
 *
 * updated @ server/api/state.get.ts
 */
export function useState() {
  const { getItem, setItem, watch: watchState } = useStorage<string>('state')

  async function getState() {
    return getItem<State | null>('state')
  }

  async function setState(state: State) {
    return setItem(state, '')
  }

  async function getProgress() {
    return getItem('downloading')
  }

  async function setProgress(progress: number) {
    return setItem('downloading', progress.toString())
  }

  async function resetProgress() {
    return setItem('downloading', '0')
  }

  return {
    /**
     * get the current progress of the server
     *
     * @returns progress number (between 0 & 1)
     */
    getProgress,
    /**
     * get the current state of the server (current action the server is performing)
     *
     * @returns "downloading" or "idle" or "uploading"
     */
    getState,
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
