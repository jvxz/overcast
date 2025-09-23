<script lang="ts" setup>
const { isSupported } = useClipboardItems()
const { serverError } = useServerError()
const { downloadTrack, isDownloadingTrack } = useTrack()
const { formMode } = useFormMode()
const { asideTab, isAsideOpen } = useAsideState()
const { addTrackToMultiTrack } = useMultiTrack()

const { serverState, serverStateData } = useServerState()
const progress = computed(() => serverState.value === 'downloading' ? Math.round(Number(serverStateData.value) * 100) : 0)

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
  const input = url ?? trackUrl.value

  if (input) {
    if (!isUrl(input)) {
      return serverError.value = {
        fatal: false,
        message: 'Invalid URL',
        name: 'Error',
        statusCode: 422,
        unhandled: false,
      }
    }

    serverError.value = null

    switch (formMode.value) {
      case 'track':
    downloadTrack(input)
        break
      case 'multi':
        asideTab.value = 'multi-track'
        isAsideOpen.value = true

        addTrackToMultiTrack(input)
        break
      default:
        break
    }
  }
}
</script>

<template>
  <UCard class="relative w-full shrink-0 flex-col gap-2 overflow-hidden p-2">
    <form
      class="flex w-full items-center gap-3"
      @submit.prevent="handleSubmit()"
    >
      <UInput
        v-model="trackUrl"
        placeholder="Enter a track URL"
        class="border-none bg-transparent px-1.5 shadow-none"
      />
      <UButton
        :disabled="!trackUrl"
        :is-loading="isDownloadingTrack"
        size="icon"
        variant="ghost"
        class="px-0"
      >
        <Icon :name="formMode === 'multi' ? 'mingcute:add-line' : 'tabler:arrow-right'" />
      </UButton>
    </form>
    <div class="absolute inset-0 z-100 h-full bg-muted/50 p-0 mix-blend-screen duration-100" :style="{ width: `${progress}%` }"></div>
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
        <Icon name="tabler:clipboard" />
      </UButton>
      </div>
    </div>
  </UCard>
</template>
