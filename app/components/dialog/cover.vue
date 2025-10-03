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
  retry: false,
  staleTime: 600000,
})

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
        :src="getLargerArtworkUrl(trackData?.artwork_url ?? trackData?.user.avatar_url ?? '')"
        class="size-[534px] rounded bg-muted"
      />
      <UDialogFooter>
        <UButton
          aria-label="Download cover art"
          @click="downloadFile(getLargerArtworkUrl(trackData?.artwork_url ?? trackData?.user.avatar_url ?? ''))"
        >
          Download cover
        </UButton>
      </UDialogFooter>
    </UDialogContent>
  </UDialogRoot>
</template>
