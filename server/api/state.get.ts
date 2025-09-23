const QuerySchema = z.object({
  id: z.string(),
})

export default defineEventHandler(async (event) => {
  const { id } = await validateQueryZod(event, QuerySchema)

  const eventStream = createEventStream(event)

  const { getProgress, watchState } = useState(id)

  watchState(async (_, key) => {
    if (!key.includes(id)) {
      return
    }

    const state = key.split(':').pop() as ServerState

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

  eventStream.onClosed(() => {

  })

  return eventStream.send()
})
