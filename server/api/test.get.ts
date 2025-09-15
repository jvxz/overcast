import { Effect } from "effect"

export default defineEffectEventHandler((event) => Effect.gen(function* () {
  yield* Effect.sleep(1000)

  return "success from effect"
}))
