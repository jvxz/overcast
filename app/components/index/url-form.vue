<script lang="ts" setup>
import { breakpointsTailwind } from '@vueuse/core'

const serverError = useServerError()
const { downloadTrack, isDownloadingTrack } = useDownload()
const formMode = useFormMode()
const asideState = useAsideState()
const { addTrackToMultiTrack } = useMultiTrack()
const { trackDownloadProgress } = useServerState('index')
const artist = useArtist()
const playlistUrl = usePlaylistUrl()
const breakpoints = useBreakpoints(breakpointsTailwind)

const canPaste = usePermission('clipboard-read')
const isDesktop = breakpoints.xl
const trackUrl = ref('')

onPaste((text) => {
  trackUrl.value = text
  handleSubmit()
})

onStartTyping(() => focusUrlForm())

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
        downloadTrack({ target: 'index', trackUrl: removeSearchParams(input) })
        break
      case 'multi':
        if (!isDesktop) {
          asideState.value = 'multi-track'
        }

        addTrackToMultiTrack(removeSearchParams(input))
        break
      case 'artist':
        asideState.value = 'artist'

        artist.value = removeSearchParams(input)
        break
      case 'playlist':
        asideState.value = 'playlist'

        playlistUrl.value = removeSearchParams(input)
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
    case 'playlist':
      return 'Enter a playlist URL'
    default:
      return 'Enter a track URL'
  }
})
</script>

<template>
  <ProgressBar :progress="trackDownloadProgress">
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
            :disabled="canPaste === 'denied'"
            aria-label="Paste"
            variant="ghost"
            size="icon"
            @click="canPaste === 'granted' && handlePasteButton()"
          >
            <Icon name="mingcute:clipboard-line" />
          </UButton>
        </div>
      </div>
    </UCard>
  </ProgressBar>
</template>
