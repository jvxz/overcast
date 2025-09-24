<script lang="ts" setup>
const { multiTracks: _multiTracks } = useMultiTrack()

const multiTrackArray = computed(() => Array.from(_multiTracks.value))

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
          :key="track.index"
          :track-url="track.data"
        >
        </AsideContentMultiTrackCard>
      </div>
    </div>
  </div>
</template>
