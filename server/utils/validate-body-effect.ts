import type { EventHandlerRequest, H3Event } from 'h3'
import { Data, Effect } from 'effect'
import { z } from 'zod'

class BodyValidationError extends Data.TaggedError('BodyValidationError')<EffectH3Error> {}

export function validateBodyEffect<T extends z.ZodType>(event: H3Event<EventHandlerRequest>, schema: T) {
  return Effect.gen(function* () {
    const validationRes = yield* Effect.promise(() => readValidatedBody(event, schema.safeParse))

    if (!validationRes.success) {
      return yield* Effect.fail(new BodyValidationError({
        cause: validationRes.error,
        data: z.treeifyError(validationRes.error),
        message: 'Invalid body',
        statusCode: 422,
      }))
    }

    return validationRes.data
  })
}
