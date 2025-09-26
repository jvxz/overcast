<script lang="ts" setup>
const { isSupported } = useClipboardItems()
const serverError = useServerError()
const { downloadTrack, isDownloadingTrack } = useTrack()
const formMode = useFormMode()
const asideState = useAsideState()
const { addTrackToMultiTrack } = useMultiTrack()
const { trackDownloadProgress } = useServerState('index')
const artist = useArtist()

const trackUrl = ref('')

onPaste((text) => {
  trackUrl.value = text
  handleSubmit()
})

function handlePasteButton() {
  navigator.clipboard.readText().then((text) => {
    trackUrl.value = text
    handleSubmit(text)
  })
}

function handleSubmit(url?: string) {
  if (isDownloadingTrack.value) {
    return
  }

  const input = url ?? trackUrl.value

  if (input) {
    if (!isUrl(input)) {
      return serverError.value = {
        fatal: false,
        message: 'Invalid input. Must be a SoundCloud URL',
        name: 'Error',
        statusCode: 422,
        unhandled: false,
      }
    }

    serverError.value = null

    switch (formMode.value) {
      case 'track':
        downloadTrack({ target: 'index', trackUrl: input })
        break
      case 'multi':
        asideState.value = 'multi-track'

        addTrackToMultiTrack(input)
        break
      case 'artist':
        asideState.value = 'artist'

        artist.value = input
        break
      default:
        break
    }
  }
}

const urlFormPlaceholder = computed(() => {
  switch (formMode.value) {
    case 'multi':
      return 'Enter a track URL'
    case 'artist':
      return 'Enter an artist URL'
    default:
      return 'Enter a track URL'
  }
})
</script>

<template>
  <UCard class="relative w-full shrink-0 flex-col gap-2 overflow-hidden p-2 has-focus:border-foreground/20">
    <form
      class="flex w-full items-center gap-3"
      @submit.prevent="handleSubmit()"
    >
      <UInput
        id="url-form"
        v-model="trackUrl"
        :placeholder="urlFormPlaceholder"
        class="border-none bg-transparent px-1.5 shadow-none"
      />
      <UButton
        :disabled="!trackUrl || isDownloadingTrack"
        :is-loading="isTargetBusy('index')"
        size="icon"
        class="px-0"
      >
        <Icon :name="formMode === 'multi' ? 'mingcute:add-line' : 'mingcute:arrow-right-line'" />
      </UButton>
    </form>
    <div class="absolute inset-0 z-100 h-full bg-muted/50 p-0 mix-blend-screen duration-100" :style="{ width: `${trackDownloadProgress}%` }"></div>
    <div class="flex w-full items-center">
      <IndexUrlFormModeSelect />
      <div class="flex shrink-0 items-center gap-1">
        <UButton
          v-if="formMode === 'multi' || formMode === 'track'"
          size="icon"
          variant="ghost"
          aria-label="Paste"
          @click="formMode === 'multi' ? formMode = 'track' : formMode = 'multi'"
        >
          <Icon :name="formMode === 'multi' ? 'mingcute:square-line' : 'mingcute:grid-line'" />
        </UButton>
        <UButton
          v-if="isSupported"
          aria-label="Paste"
          variant="ghost"
          size="icon"
          @click="handlePasteButton"
        >
          <Icon name="mingcute:clipboard-line" />
        </UButton>
      </div>
    </div>
  </UCard>
</template>
