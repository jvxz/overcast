<script lang="ts" setup>
const emit = defineEmits<{
  pending: [boolean]
}>()

const { cachedTracks, canLoadMore, getNextChunk, isLoadingNextChunk, isLoadingPlaylistTrackChunks } = usePlaylist({
  onPlaylistUrlChange: () => scrollToTop(),
})

watch([isLoadingNextChunk, isLoadingPlaylistTrackChunks], (newPending) => {
  emit('pending', newPending.some(Boolean))
})

const { containerProps, list: tracks, scrollTo, wrapperProps } = useVirtualList(cachedTracks, {
  itemHeight: 108,
  overscan: 3,
})

useInfiniteScroll(containerProps.ref, () => getNextChunk(), {
  canLoadMore: () => canLoadMore.value,
  distance: 108,
})

function scrollToTop() {
  scrollTo(0)
}
</script>

<template>
  <div v-bind="containerProps" class="h-full">
    <div v-bind="wrapperProps" class="*:mb-3 last:mb-0">
      <template v-if="tracks.length">
        <AsideContentPlaylistTrackCard
          v-for="track in tracks"
          :key="track.data.id"
          :track="track.data"
        >
        </AsideContentPlaylistTrackCard>
        <UCard v-if="isLoadingNextChunk" class="h-24 border-none items-center justify-center">
          <USpinner class="!size-10" />
        </UCard>
      </template>
      <template v-else>
        <UCard
          v-for="i in 6"
          :key="i"
          class="h-24 animate-pulse"
        />
      </template>
    </div>
  </div>
</template>
