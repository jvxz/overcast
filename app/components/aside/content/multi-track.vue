<script lang="ts" setup>
const { serverState, zippingProgress } = useServerState('multi-track')
const { containsInvalidTrack, multiTracks } = useMultiTrack()
const { downloadMultiTracks, isBusy, isDownloadingMultiTracks } = useTrack()

const hasTracks = computed(() => multiTracks.value.size > 0)
const placeholder = computed(() => {
  if (serverState.value === 'zipping') {
    return `Downloading and zipping ${multiTracks.value.size} ${multiTracks.value.size === 1 ? 'track' : 'tracks'}...`
  }

  return hasTracks.value ? `Search ${multiTracks.value.size} ${multiTracks.value.size === 1 ? 'track' : 'tracks'}` : 'No tracks added'
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <div class="relative w-full">
        <div class="relative">
          <UInput
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
      >
        <Icon name="mingcute:delete-line" />
      </UButton>
      <UButton
        :is-loading="isTargetBusy('multi-track')"
        size="icon"
        variant="soft"
        :disabled="!hasTracks || isBusy || containsInvalidTrack"
        @click="!containsInvalidTrack && downloadMultiTracks()"
      >
        <Icon name="mingcute:download-line" />
      </UButton>
    </div>
    <AsideContentMultiTrackCard
      v-for="track in multiTracks"
      :key="track"
      :track-url="track"
    >
    </AsideContentMultiTrackCard>
  </div>
</template>
