export default defineNuxtPlugin(async () => {
  const { fetch, session } = useUserSession()

  if (!session.value?.id)
    await fetch()

  return {
    provide: { sessionId: session.value!.id },
  }
})
