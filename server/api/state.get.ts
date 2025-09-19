import type { EventHandlerRequest, H3Event } from 'h3'
import { Effect } from 'effect'

function program(event: H3Event<EventHandlerRequest>) {
  return Effect.gen(function* () {
    const eventStream = createEventStream(event)

    const { getProgress, watchState } = useState()

    yield* Effect.forkDaemon(Effect.gen(function* () {
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
    }))

    return eventStream.send()
  })
}

export default defineEffectEventHandler(program)
