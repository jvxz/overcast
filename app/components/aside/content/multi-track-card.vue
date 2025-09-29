<script lang="ts" setup>
const props = defineProps<{
  trackUrl: string
}>()

const { downloadTrack, isDownloadingTrack } = useTrack()
const { removeTrackFromMultiTrack } = useMultiTrack()
const { trackDownloadProgress } = useServerState(props.trackUrl)
const { isOpen: isCoverDialogOpen, trackUrl: coverDialogTrackUrl } = useCoverDialog()

const { data, error, isPending } = useQuery({
  queryFn: async () => $fetch('/api/track/meta', {
    onResponse: handleResponseError,
    query: {
      url: props.trackUrl,
    },
  }),
  queryKey: [props.trackUrl],
  staleTime: 600000,
})

const artist = computed(() => data.value?.publisher_metadata?.artist ?? data.value?.user.username)
const createdAt = useDateFormat(() => data.value?.created_at ?? '', DATE_FORMAT_STRING)
const coverUrl = computed(() => data.value?.artwork_url ?? data.value?.user.avatar_url)

function handleOpenCoverDialog() {
  isCoverDialogOpen.value = true
  coverDialogTrackUrl.value = props.trackUrl
}
</script>

<template>
  <Transition>
    <ProgressBar
      v-if="!isPending && data"
      class="rounded"
      :progress="trackDownloadProgress"
    >
      <UCard class="size-full h-24 flex-row gap-3 p-3">
        <UCardHeader class="aspect-square h-full">
          <NuxtImg
            :src="coverUrl"
            class="size-full rounded"
            @click="handleOpenCoverDialog"
          />
        </UCardHeader>
        <div class="flex h-[calc(100%-0.5rem)] w-fit flex-1 flex-col justify-between self-center *:[text-box:trim-both]">
          <NuxtLink
            :title="data.title"
            :href="trackUrl"
            class="max-w-fit -translate-y-0.5 truncate text-lg font-medium hover:underline"
          >
            {{ data.title }}
          </NuxtLink>
          <p class="-translate-y-0.5 text-sm font-medium text-muted-foreground">
            {{ artist }}
          </p>
          <p class="font-mono text-xs font-medium text-muted-foreground">
            {{ createdAt }}
          </p>
        </div>
        <div class="flex h-full flex-col justify-between">
          <UButton
            size="icon"
            variant="ghost"
            :is-loading="isTargetBusy(props.trackUrl)"
            :disabled="isDownloadingTrack"
            @click="downloadTrack({ target: props.trackUrl, trackUrl: props.trackUrl })"
          >
            <Icon name="mingcute:download-line" />
          </UButton>
          <UButton
            size="icon"
            variant="ghost"
            @click="removeTrackFromMultiTrack(trackUrl)"
          >
            <Icon name="mingcute:delete-line" />
          </UButton>
        </div>
      </UCard>
    </ProgressBar>
    <UCard v-else-if="error" class="absolute size-full flex-row gap-3 border-danger p-3">
      <UCardHeader class="aspect-square h-full">
        <div class="grid size-full place-items-center rounded bg-muted">
          <Icon name="mingcute:ghost-line" class="!size-6 text-muted-foreground" />
        </div>
      </UCardHeader>
      <div class="flex h-[calc(100%-0.5rem)] w-fit flex-1 flex-col self-center">
        <NuxtLink :href="trackUrl" class="-translate-y-1.5 truncate text-lg font-medium hover:underline">
          {{ trackUrl }}
        </NuxtLink>
        <p class="-translate-y-1.5 text-sm font-medium text-muted-foreground">
          Invalid track URL
        </p>
      </div>
      <div class="flex h-full flex-col justify-between">
        <UButton
          :disabled="true"
          size="icon"
          variant="ghost"
        >
          <Icon name="mingcute:download-line" />
        </UButton>
        <UButton
          size="icon"
          variant="ghost"
          @click="removeTrackFromMultiTrack(trackUrl)"
        >
          <Icon name="mingcute:delete-line" />
        </UButton>
      </div>
    </UCard>
    <UCard v-else class="absolute size-full flex-row gap-3 p-3">
      <UCardHeader class="aspect-square h-full">
        <div class="size-full rounded bg-muted" />
      </UCardHeader>
    </UCard>
  </Transition>
</template>
