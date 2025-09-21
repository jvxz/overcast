<script lang="ts" setup>
const { serverError } = useServerError()
const { downloadTrack, isDownloadingTrack } = useTrack()

const { serverState, serverStateData } = useServerState()
const progress = computed(() => serverState.value === 'downloading' ? Math.round(Number(serverStateData.value) * 100) : 0)

const trackUrl = ref('')

onPaste((text) => {
  if (new URL(text)) {
    trackUrl.value = removeSearchParams(text)
    handleSubmit()
  }
})

function handleSubmit() {
  if (trackUrl.value) {
    serverError.value = null
    downloadTrack(trackUrl.value)
  }
}
</script>

<template>
  <UCard class="relative w-full shrink-0 flex-col gap-2 overflow-hidden p-2 px-4">
    <form
      class="flex w-full items-center gap-3"
      @submit.prevent="handleSubmit"
    >
      <UInput
        v-model="trackUrl"
        placeholder="Enter a track URL"
        class="border-none bg-transparent px-0 shadow-none"
      />
      <UButton
        :disabled="!trackUrl"
        :is-loading="isDownloadingTrack"
        size="icon"
        variant="ghost"
        class="translate-x-2 px-0"
      >
        <Icon name="tabler:arrow-right" />
      </UButton>
    </form>
    <div class="absolute inset-0 h-full bg-muted p-0 mix-blend-screen duration-100" :style="{ width: `${progress}%` }"></div>
    <!-- <div class="flex gap-2 font-mono">
          <UButton variant="ghost">
            artist
          </UButton>
        </div> -->
  </UCard>
</template>
