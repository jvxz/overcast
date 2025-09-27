<script lang="ts" setup>
const emit = defineEmits<{
  pending: [boolean]
}>()

const nextHref = ref<string | null>(null)
const artist = useArtist()
const searchQuery = useArtistSearch()

const { data: fetchedData, pending, refresh } = useFetch('/api/user/tracks', {
  query: {
    nextHref,
    url: artist,
  },
  server: false,
  watch: false,
})

watch(pending, (newPending) => {
  emit('pending', newPending)
})

const cachedData = ref<UserTracksData['collection'] | null>(null)
watch(fetchedData, (newData) => {
  nextHref.value = newData?.next_href ?? null
  cachedData.value = [...(cachedData.value ?? []), ...(newData?.collection ?? [])]
})

watch(artist, () => {
  cachedData.value = null
  nextHref.value = null
  refresh()
  scrollToTop()
})

watch(searchQuery, () => scrollToTop())

const trackArray = computed(() => cachedData.value ?? [])
const filteredTracks = computed(() => {
  if (!searchQuery.value) {
    return trackArray.value
  }

  const term = searchQuery.value.trim().toLowerCase()

  return trackArray.value.filter((track) => {
    if (!track) {
      return false
    }

    return track.title.trim().toLowerCase().includes(term)
      || track.publisher_metadata?.artist?.trim().toLowerCase().includes(term)
      || track.user.username.trim().toLowerCase().includes(term)
      || track.permalink_url.trim().toLowerCase().includes(term)
  })
})

watchEffect(async () => {
  await until(searchQuery).not.toBeNull()
  if (!searchQuery.value)
    return

  while (nextHref.value) {
    await refresh()
  }
})

const { containerProps, list: tracks, scrollTo, wrapperProps } = useVirtualList(filteredTracks, {
  itemHeight: 108,
  overscan: 1,
})

function scrollToTop() {
  scrollTo(0)
}

useInfiniteScroll(containerProps.ref, () => refresh(), {
  canLoadMore: () => nextHref.value !== null,
  distance: 108,

})
</script>

<template>
  <div v-bind="containerProps" class="h-full">
    <div v-bind="wrapperProps" class="*:mb-3 last:mb-0">
      <template v-if="tracks.length">
        <AsideContentArtistTrackCard
          v-for="track in tracks"
          :key="track.data.id"
          :track="track.data"
        />
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
