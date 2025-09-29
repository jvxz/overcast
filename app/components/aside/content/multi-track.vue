<script lang="ts" setup>
const { serverState, zippingProgress } = useServerState('multi-track')
const { containsInvalidTrack, multiTracks } = useMultiTrack()
const { downloadMultiTracks, isBusy, isDownloadingMultiTracks } = useTrack()
const searchQuery = useMultiTrackSearch()
const formMode = useFormMode()

const hasTracks = computed(() => multiTracks.value.size > 0)
const placeholder = computed(() => {
  if (serverState.value === 'zipping') {
    return `Downloading and zipping ${multiTracks.value.size} ${multiTracks.value.size === 1 ? 'track' : 'tracks'}...`
  }

  return hasTracks.value ? `Search ${multiTracks.value.size} ${multiTracks.value.size === 1 ? 'track' : 'tracks'}` : 'No tracks added'
})
</script>

<template>
  <div class="flex h-full w-full flex-col items-center gap-4">
    <div class="flex w-full items-center gap-2">
      <div class="relative w-full">
        <div class="relative">
          <UInput
            v-model="searchQuery"
            :disabled="!hasTracks || isDownloadingMultiTracks"
            :placeholder
            class="pl-8"
          />
          <div class="absolute inset-0 z-100 h-full bg-muted/50 p-0 mix-blend-screen duration-100" :style="{ width: `${zippingProgress}%` }"></div>
        </div>
        <Icon
          v-if="serverState !== 'zipping'"
          name="mingcute:search-line"
          class="absolute inset-0 top-1/2 left-3 z-10 !size-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <USpinner v-else class="absolute inset-0 top-1/2 left-2 z-10 !size-5 -translate-y-1/2" />
      </div>
      <UButton
        size="icon"
        variant="soft"
        :disabled="!hasTracks || isBusy"
        @click="multiTracks.clear()"
      >
        <Icon name="mingcute:delete-line" />
      </UButton>
      <UButton
        v-if="multiTracks.size > 1"
        :is-loading="isTargetBusy('multi-track')"
        size="icon"
        variant="soft"
        :disabled="!hasTracks || isBusy || containsInvalidTrack"
        @click="!containsInvalidTrack && downloadMultiTracks()"
      >
        <Icon name="mingcute:download-line" />
      </UButton>
      <UButton
        v-else
        :disabled="true"
        size="icon"
        variant="soft"
      >
        <Icon name="mingcute:download-line" />
      </UButton>
    </div>
    <div class="relative h-full w-full">
      <Transition>
        <AsideContentMultiTrackList v-if="multiTracks.size" />
        <div v-else class="absolute inset-0 flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <Icon name="mingcute:ghost-line" class="!size-16" />
          <h1 class="text-lg font-medium">
            No tracks added
          </h1>
          <p class="w-xs text-center md:w-sm" style="text-wrap: balance;">
            Add tracks to the list by switching to multi-track mode, or adding them via the artist tab
          </p>
          <UButton
            variant="soft"
            size="sm"
            class="mt-2"
            @click="() => {
              formMode = 'multi'
              focusUrlForm()
            }"
          >
            Switch to multi-track mode
          </UButton>
        </div>
      </Transition>
    </div>
  </div>
</template>
