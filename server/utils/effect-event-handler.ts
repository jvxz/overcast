import type { EventHandler, EventHandlerRequest, H3Error, H3Event } from 'h3'
import { Cause, Data, Effect, Exit } from 'effect'

export type EffectH3Error = Partial<Omit<H3Error, 'statusMessage'>> & {
  message: string
}

class BaseError extends Data.TaggedError<string>('')<EffectH3Error> { }

export function defineEffectEventHandler<T extends EventHandlerRequest, D, E extends BaseError, R extends never>(
  program: (event: H3Event<T>) => Effect.Effect<D, E, R>,
): EventHandler<T, Promise<D>> {
  return defineEventHandler(async (event) => {
    const exit = await Effect.runPromiseExit(program(event))

    return Exit.match(exit, {
      onFailure: async (cause) => {
        console.error(cause)

        // reset progress on error
        useState().resetProgress()

        if (Cause.isFailType(cause)) {
          throw createError({
            cause: cause.error.cause,
            data: cause.error.data,
            message: cause.error.message,
            statusCode: cause.error.statusCode ?? 500,
            statusMessage: cause.error._tag,
          })
        }

        throw createError({
          statusCode: 500,
          statusMessage: 'An unexpected error occurred',
          unhandled: true,
        })
      },
      onSuccess: res => res,
    })
  })
}
