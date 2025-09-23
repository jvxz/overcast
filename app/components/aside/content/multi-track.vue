<script lang="ts" setup>
const { multiTracks } = useMultiTrack()

const hasTracks = computed(() => multiTracks.value.size > 0)
const placeholder = computed(() => hasTracks.value ? `Search ${multiTracks.value.size} tracks` : 'No tracks added')
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <div class="relative w-full">
        <UInput
          :disabled="!hasTracks"
          :placeholder
          class="pl-8"
        />
        <Icon name="mingcute:search-line" class="absolute inset-0 top-1/2 left-3 z-10 !size-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>
      <UButton
        size="icon"
        variant="soft"
        :disabled="!hasTracks"
      >
        <Icon name="mingcute:delete-line" />
      </UButton>
      <UButton
        size="icon"
        variant="soft"
        :disabled="!hasTracks"
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
