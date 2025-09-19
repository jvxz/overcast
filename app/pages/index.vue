<script lang="ts" setup>
const scrollArea = useTemplateRef('scrollArea')
const url = ref('')

const tracks = ref<TrackData[]>([])

const nextHref = ref<string | null>(null)
const { execute: getMoreUserTracks, pending } = useFetch('/api/user/tracks', {
  immediate: false,
  onResponse: (data) => {
    nextHref.value = data.response._data?.next_href ?? null
    tracks.value = [...tracks.value, ...data.response._data?.collection ?? []]
  },
  params: {
    nextHref,
    url,
  },
  watch: false,
})

useInfiniteScroll(scrollArea, () => getMoreUserTracks(), {
  canLoadMore: () => !!nextHref.value,
  distance: 24,
})

function handleRequest(newUrl: string) {
  tracks.value = []
  nextHref.value = null

  url.value = newUrl
  getMoreUserTracks()
}
</script>

<template>
  <div class="mx-auto flex h-screen w-lg flex-col items-center justify-center gap-4">
    <UInput
      v-model="url"
      :disabled="pending"
      @keydown.enter="handleRequest($event.target.value)"
    />

    <div ref="scrollArea" class="h-[300px] w-full overflow-y-auto rounded border">
      <div
        v-for="track in tracks"
        :key="track.id"
        class="h-20"
      >
        <h1>{{ track.title }}</h1>
      </div>
    </div>
  </div>
</template>
