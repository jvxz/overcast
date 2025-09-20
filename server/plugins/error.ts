export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('error', () => {
    useState().resetProgress()
    useState().setState('idle')
  })
})
