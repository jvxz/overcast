import type { EventHandlerRequest, H3Event } from 'h3'
import { Effect } from 'effect'

const QuerySchema = z.object({
  nextHref: z.string().nullable(),
  url: SoundCloudUrlSchema,
})

function program(event: H3Event<EventHandlerRequest>) {
  return Effect.gen(function* () {
    const { nextHref, url } = yield* validateQueryEffect(event, QuerySchema)

    if (nextHref) {
      return yield* $sc({
        endpoint: nextHref,
        options: {
          params: {
            linked_partitioning: true,
          },
        },
        schema: UserTracksSchema,
      })
    }

    const user = yield* $sc({
      endpoint: '/resolve',
      options: {
        params: {
          url,
        },
      },
      schema: UserSchema,
    })

    const userTracks = yield* $sc({
      endpoint: `/users/${user.id}/tracks`,
      options: {
        params: {
          linked_partitioning: true,
        },
      },
      schema: UserTracksSchema,
    })

    return userTracks
  })
}

export default defineEffectEventHandler(program)
