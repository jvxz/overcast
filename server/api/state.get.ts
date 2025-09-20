export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event)

  const { getProgress, watchState } = useState()

  watchState(async (_, key) => {
    if (!key.startsWith('state:')) {
      return
    }

    const state = key.split(':')[1] as ServerState

    if (state === 'downloading') {
      const progress = await getProgress()

      return eventStream.push({
        data: progress?.toString() ?? '0',
        event: 'downloading',
      })
    }

    eventStream.push({
      data: '',
      event: state,
    })
  })

  return eventStream.send()
})
