import { version } from '~~/package.json'

export default defineNuxtPlugin({
  parallel: true,
  setup: () => ({
    provide: { version },
  }),
})
