import { QueryClient } from '@tanstack/vue-query'

export default defineNuxtPlugin({
  parallel: true,
  setup: (app) => {
    app.hook('nuxt-query:configure', (loadConfig) => {
      const qc = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })

      loadConfig(qc)
    })
  },
})
