<script lang="ts" setup>
const qc = useQueryClient()
const { multiTracks: _multiTracks } = useMultiTrack()
const searchQuery = useMultiTrackSearch()

const multiTrackArray = computed(() => {
  const arr = Array.from(_multiTracks.value)

  if (!searchQuery.value) {
    return arr
  }

  const term = searchQuery.value.trim().toLowerCase()

  return arr.filter((url) => {
    const meta = qc.getQueryData<TrackData>([url])

    if (!meta) {
      return false
    }

    return meta.title.trim().toLowerCase().includes(term)
  })
})

const { containerProps, list: multiTracks, wrapperProps } = useVirtualList(multiTrackArray, {
  itemHeight: 96,
})
</script>

<template>
  <div class="absolute inset-0 w-full">
    <div v-bind="containerProps" class="h-full">
      <div v-bind="wrapperProps" class="*:mb-3 last:mb-0">
        <AsideContentMultiTrackCard
          v-for="track in multiTracks"
          :key="track.data"
          :track-url="track.data"
        >
        </AsideContentMultiTrackCard>
      </div>
    </div>
  </div>
</template>
