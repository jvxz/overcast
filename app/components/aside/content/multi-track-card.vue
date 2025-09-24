<script lang="ts" setup>
const props = defineProps<{
  trackUrl: string
}>()

const { downloadTrack, isDownloadingTrack } = useTrack()
const { removeTrackFromMultiTrack } = useMultiTrack()
const { trackDownloadProgress } = useServerState(props.trackUrl)

const { data, error, isPending } = useQuery({
  queryFn: async () => $fetch('/api/track/meta', {
    query: {
      url: props.trackUrl,
    },
    onResponse: handleResponseError,
  }),
  queryKey: [props.trackUrl],
  retry: false,
})

const artist = computed(() => data.value?.publisher_metadata?.artist ?? data.value?.user.username)
const createdAt = useDateFormat(() => data.value?.created_at ?? '', DATE_FORMAT_STRING)
const coverUrl = computed(() => data.value?.artwork_url ?? data.value?.user.avatar_url)
</script>

<template>
  <div class="relative h-24">
    <Transition>
      <UCard v-if="!isPending && data" class="absolute size-full flex-row gap-3 p-3">
        <UCardHeader class="aspect-square h-full">
          <NuxtImg :src="coverUrl" class="size-full rounded" />
        </UCardHeader>
        <div class="flex h-[calc(100%-0.5rem)] w-fit flex-1 flex-col justify-between self-center *:[text-box:_trim-both_cap_alphabetic]">
          <NuxtLink :href="trackUrl" class="text-lg font-medium hover:underline">
            {{ data.title }}
          </NuxtLink>
          <p class="text-sm font-medium text-muted-foreground">
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
        <div class="absolute inset-0 z-100 h-full bg-muted/50 p-0 mix-blend-screen duration-100" :style="{ width: `${trackDownloadProgress}%` }"></div>
      </UCard>
      <UCard v-else-if="error" class="absolute size-full flex-row gap-3 border-danger p-3">
        <UCardHeader class="aspect-square h-full">
          <div class="grid size-full place-items-center rounded bg-muted">
            <Icon name="mingcute:ghost-line" class="!size-6" />
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
  </div>
</template>
