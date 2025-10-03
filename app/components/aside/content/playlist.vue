<script lang="ts" setup>
const { allTrackIds, cachedTracks, isLoadingNextChunk, isLoadingPlaylistTrackChunks } = usePlaylist()
const playlistUrl = usePlaylistUrl()
const formMode = useFormMode()
const { serverState, zippingProgress } = useServerState('playlist')
const { downloadPlaylistTracks, isBusy } = useDownload()

const pending = computed(() => isLoadingNextChunk.value || isLoadingPlaylistTrackChunks.value)

const placeholder = computed(() => {
  if (serverState.value === 'preparing') {
    return `Preparing to download ${allTrackIds.value.length} ${allTrackIds.value.length === 1 ? 'track' : 'tracks'}...`
  }

  if (serverState.value === 'zipping') {
    return `Downloading and zipping ${allTrackIds.value.length} ${allTrackIds.value.length === 1 ? 'track' : 'tracks'}...`
  }

  if (!allTrackIds.value.length && pending.value) {
    return 'Loading playlist tracks...'
  }

  if (allTrackIds.value.length) {
    return allTrackIds.value.length ? `${allTrackIds.value.length} ${allTrackIds.value.length === 1 ? 'track' : 'tracks'}` : 'Playlist has no tracks'
  }

  return 'No playlist selected'
})
</script>

<template>
  <div class="flex h-full w-full flex-col items-center gap-4">
    <div class="flex w-full items-center gap-2">
      <div class="relative w-full">
        <ProgressBar :progress="zippingProgress">
          <div
            :class="cn(
              interactiveStyles.size.default, 'flex w-full min-w-0 cursor-text items-center truncate rounded border py-1 pl-8 text-sm font-medium text-muted-foreground selection:bg-primary selection:text-primary-foreground focus-visible:ring-0 md:text-sm',
              (pending || !cachedTracks.length) && 'opacity-50',
            )"
          >
            {{ placeholder }}
          </div>
        </ProgressBar>
        <USpinner v-if="pending" class="absolute inset-0 top-1/2 left-2 z-10 !size-5 -translate-y-1/2" />
        <Icon
          v-else
          name="mingcute:playlist-line"
          class="absolute inset-0 top-1/2 left-3 z-10 !size-3.5 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      <UButton
        :is-loading="isTargetBusy('playlist')"
        size="icon"
        variant="soft"
        aria-label="Download all playlist tracks as zip"
        :disabled="!playlistUrl || isBusy"
        @click="downloadPlaylistTracks({ ids: allTrackIds, playlistUrl: playlistUrl ?? '' })"
      >
        <Icon name="mingcute:download-line" />
      </UButton>
    </div>
    <div class="relative h-full w-full">
      <Transition>
        <AsideContentPlaylistList v-if="cachedTracks.length || isLoadingNextChunk || isLoadingPlaylistTrackChunks" />
        <div v-else-if="playlistUrl && !cachedTracks.length" class="absolute inset-0 flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <Icon name="mingcute:ghost-line" class="!size-16" />
          <h1 class="text-lg font-medium">
            Playlist has no tracks
          </h1>
          <p class="w-xs text-center md:w-sm" style="text-wrap: balance;">
            Consider selecting a different playlist
          </p>
          <UButton
            variant="soft"
            size="sm"
            class="mt-2"
            aria-label="Switch to playlist mode"
            @click="() => {
              formMode = 'playlist'
              focusUrlForm()
            }"
          >
            Switch to playlist mode
          </UButton>
        </div>
        <div v-else-if="!playlistUrl" class="absolute inset-0 flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <Icon name="mingcute:ghost-line" class="!size-16" />
          <h1 class="text-lg font-medium">
            No playlist selected
          </h1>
          <p class="w-xs text-center md:w-sm" style="text-wrap: balance;">
            Select a playlist by switching to playlist mode and entering its url
          </p>
          <UButton
            variant="soft"
            size="sm"
            class="mt-2"
            aria-label="Switch to playlist mode"
            @click="() => {
              formMode = 'playlist'
              focusUrlForm()
            }"
          >
            Switch to playlist mode
          </UButton>
        </div>
      </Transition>
    </div>
  </div>
</template>
