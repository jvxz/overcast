import type { EventHandlerRequest, H3Event } from 'h3'
import { Data, Effect } from 'effect'

class TrackAudioError extends Data.TaggedError('TrackAudioError')<EffectH3Error> { }

const QuerySchema = z.object({
  url: SoundCloudUrlSchema,
})

function program(event: H3Event<EventHandlerRequest>) {
  return Effect.gen(function* () {
    const { url: trackUrl } = yield* validateQueryEffect(event, QuerySchema)

    const { resetProgress, setState } = useState()
    yield* Effect.promise(async () => resetProgress())
    yield* Effect.promise(async () => setState('downloading'))

    const cachedTrackUrl = yield* getCachedTrackUrl(trackUrl)

    if (cachedTrackUrl) {
      yield* Effect.promise(async () => setState('idle'))

      return cachedTrackUrl
    }

    return yield* Effect.tryPromise({
      catch: e => new TrackAudioError({
        cause: e,
        message: 'An error occurred while fetching the audio stream',
        statusCode: 500,
      }),
      try: async () => event.$fetch('/api/track/audio', {
        query: {
          clientId: event.context.clientId,
          url: trackUrl,
        },
      }),
    })
  })
}

export default defineEffectEventHandler(program)
