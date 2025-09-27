<script lang="ts" setup>
const { serverState, zippingProgress } = useServerState('artist')
const { downloadArtistTracks, isBusy, isDownloadingArtistTracks } = useTrack()
const searchQuery = useArtistSearch()
const artistUrl = useArtist()
const formMode = useFormMode()

const { data: artistData } = useQuery({
  enabled: computed(() => !!artistUrl.value),
  queryFn: async () => $fetch('/api/user/meta', {
    onResponse: handleResponseError,
    query: {
      url: artistUrl.value,
    },
  }),
  queryKey: [artistUrl],
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  retry: false,
  staleTime: 600000,
})

const hasTracks = computed(() => artistData.value?.track_count ?? 0)
const placeholder = computed(() => {
  if (serverState.value === 'preparing') {
    return `Preparing to download ${hasTracks.value} ${hasTracks.value === 1 ? 'track' : 'tracks'}...`
  }

  if (serverState.value === 'zipping') {
    return `Downloading and zipping ${hasTracks.value} ${hasTracks.value === 1 ? 'track' : 'tracks'}...`
  }

  if (artistUrl.value) {
    return hasTracks.value ? `Search ${hasTracks.value} ${hasTracks.value === 1 ? 'track' : 'tracks'}` : 'Artist has no tracks'
  }

  return 'No artist selected'
})

const pending = ref(false)
const isLoading = computed(() => pending.value || isDownloadingArtistTracks.value)
</script>

<template>
  <div class="flex h-full w-full flex-col items-center gap-4">
    <div class="flex w-full items-center gap-2">
      <div class="relative w-full">
        <div class="relative">
          <UInput
            v-model="searchQuery"
            :disabled="!hasTracks || isDownloadingArtistTracks"
            :placeholder
            class="pl-8"
          />
          <div class="absolute inset-0 z-100 h-full bg-muted/50 p-0 mix-blend-screen duration-100" :style="{ width: `${zippingProgress}%` }"></div>
        </div>
        <USpinner v-if="isLoading" class="absolute inset-0 top-1/2 left-2 z-10 !size-5 -translate-y-1/2" />
        <Icon
          v-else
          name="mingcute:search-line"
          class="absolute inset-0 top-1/2 left-3 z-10 !size-3.5 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      <UButton
        :is-loading="isTargetBusy('artist')"
        size="icon"
        variant="soft"
        :disabled="!hasTracks || isBusy"
        @click="downloadArtistTracks(artistUrl ?? '')"
      >
        <Icon name="mingcute:download-line" />
      </UButton>
    </div>
    <div class="relative h-full w-full">
      <Transition>
        <LazyAsideContentArtistList v-if="artistUrl && artistData?.track_count" @pending="pending = $event" />
        <div v-else-if="artistUrl && !artistData?.track_count" class="absolute inset-0 flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <Icon name="mingcute:ghost-line" class="!size-16" />
          <h1 class="text-lg font-medium">
            Artist has no tracks
          </h1>
          <p class="w-sm text-center" style="text-wrap: balance;">
            Consider selecting a different artist
          </p>
          <UButton
            variant="soft"
            size="sm"
            class="mt-2"
            @click="() => {
              formMode = 'artist'
              focusUrlForm()
            }"
          >
            Switch to artist mode
          </UButton>
        </div>
        <div v-else-if="!artistUrl" class="absolute inset-0 flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <Icon name="mingcute:ghost-line" class="!size-16" />
          <h1 class="text-lg font-medium">
            Artist not selected
          </h1>
          <p class="w-sm text-center" style="text-wrap: balance;">
            Select an artist by switching to artist mode and entering their url
          </p>
          <UButton
            variant="soft"
            size="sm"
            class="mt-2"
            @click="() => {
              formMode = 'artist'
              focusUrlForm()
            }"
          >
            Switch to artist mode
          </UButton>
        </div>
      </Transition>
    </div>
  </div>
</template>
