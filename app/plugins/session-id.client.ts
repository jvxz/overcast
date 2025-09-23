export default defineNuxtPlugin({
  parallel: true,
  async setup() {
    const { fetch, session } = useUserSession()

    if (!session.value?.id)
      await fetch()

    return {
      provide: { sessionId: session.value!.id },
    }
  },
})
