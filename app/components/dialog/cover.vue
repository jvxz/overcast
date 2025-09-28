<script lang="ts" setup>
const { isOpen, trackUrl } = useCoverDialog()

const { data: trackData } = useFetch('/api/track/meta', {
  immediate: false,
  key: computed(() => trackUrl.value ?? ''),
  onResponse: handleResponseError,
  query: {
    url: trackUrl,
  },
})

const coverUrl = computed(() => getLargerArtworkUrl(trackData.value?.artwork_url ?? trackData.value?.user.avatar_url ?? ''))
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
