import type { EventHandlerRequest, H3Event } from 'h3'
import { Data, Effect } from 'effect'
import { z } from 'zod'

class QueryValidationError extends Data.TaggedError('QueryValidationError')<EffectH3Error> {}

export function validateQueryEffect<T extends z.ZodType>(event: H3Event<EventHandlerRequest>, schema: T) {
  return Effect.gen(function* () {
    const validationRes = yield* Effect.promise(() => getValidatedQuery(event, schema.safeParse))

    if (!validationRes.success) {
      return yield* Effect.fail(new QueryValidationError({
        cause: validationRes.error,
        data: z.treeifyError(validationRes.error),
        message: 'Invalid query',
        statusCode: 422,
      }))
    }

    return validationRes.data
  })
}
