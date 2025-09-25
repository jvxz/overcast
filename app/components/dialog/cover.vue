<script lang="ts" setup>
const { isOpen, trackUrl } = useCoverDialog()

const { data: trackData } = useQuery({
  enabled: computed(() => !!trackUrl.value),
  queryFn: async () => $fetch('/api/track/meta', {
    onResponse: handleResponseError,
    query: {
      url: trackUrl,
    },
  }),
  queryKey: [trackUrl],
})

const coverUrl = computed(() => getOriginalArtworkUrl(trackData.value?.artwork_url ?? trackData.value?.user.avatar_url ?? ''))
const artist = computed(() => trackData.value?.publisher_metadata?.artist ?? trackData.value?.user.username)
</script>

<template>
  <UDialogRoot v-model:open="isOpen">
    <UDialogContent>
      <UDialogHeader>
        <UDialogTitle>{{ trackData?.title }}</UDialogTitle>
        <UDialogDescription>{{ artist }}</UDialogDescription>
      </UDialogHeader>
      <NuxtImg
        fit="cover"
        :src="coverUrl"
        class="size-[534px] rounded bg-muted"
      />
      <UDialogFooter>
        <UButton
          @click="downloadFile(coverUrl)"
        >
          Download cover
        </UButton>
      </UDialogFooter>
    </UDialogContent>
  </UDialogRoot>
</template>
