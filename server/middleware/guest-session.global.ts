export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.id) {
    await setUserSession(event, {
      ...session,
      id: crypto.randomUUID(),
    })
  }

  event.context.sessionId = session.id
})
