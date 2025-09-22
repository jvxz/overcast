export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('error', (_, { event }) => {
    if (!event)
      return

    useState(event.context.sessionId).resetProgress()
    useState(event.context.sessionId).setState('idle')
  })
})
