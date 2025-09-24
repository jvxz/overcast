export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('error', (_, { event }) => {
    if (!event)
      return

    if (useAppConfig().logErrorsInConsole)
      console.error(`${event.node.req.url}:`, event.node.res.statusCode, event.node.res.statusMessage)

    useState(event.context.sessionId).resetProgress()
    useState(event.context.sessionId).setState('idle')
  })
})
