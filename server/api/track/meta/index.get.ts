import type { EventHandlerRequest, H3Event } from 'h3'
import { Effect } from 'effect'

const QuerySchema = z.object({
  url: SoundCloudUrlSchema,
})

function program(event: H3Event<EventHandlerRequest>) {
  return Effect.gen(function* () {
    const { url } = yield* validateQueryEffect(event, QuerySchema)

    return yield* $sc({
      endpoint: '/resolve',
      event,
      options: {
        params: {
          url,
        },
      },
      schema: TrackDataSchema,
    })
  })
}

export default defineEffectEventHandler(program)
