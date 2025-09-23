<script lang="ts" setup>
const props = defineProps<{
  trackUrl: string
}>()

const { downloadTrack } = useTrack()
const { removeTrackFromMultiTrack } = useMultiTrack()

const { data, isPending } = useQuery({
  queryFn: async () => $fetch('/api/track/meta', {
    query: {
      url: props.trackUrl,
    },
  }),
  queryKey: [props.trackUrl],
})

const artist = computed(() => data.value?.publisher_metadata?.artist ?? data.value?.user.username)
const createdAt = useDateFormat(() => data.value?.created_at ?? '', DATE_FORMAT_STRING)
const coverUrl = computed(() => data.value?.artwork_url ?? data.value?.user.avatar_url)
</script>

<template>
  <div class="h-24 relative">
    <Transition appear>
      <UCard v-if="!isPending && data" class="size-full flex-row gap-3 p-3 absolute">
        <UCardHeader class="aspect-square h-full">
          <NuxtImg :src="coverUrl" class="size-full rounded" />
        </UCardHeader>
        <div class="flex h-[calc(100%-0.5rem)] w-fit flex-1 flex-col justify-between self-center *:[text-box:_trim-both_cap_alphabetic]">
          <p class="text-lg font-medium">
            {{ data.title }}
          </p>
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
            @click="downloadTrack(trackUrl)"
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
      <UCard v-else class="size-full flex-row gap-3 p-3 absolute">
        <UCardHeader class="aspect-square h-full">
          <div class="size-full rounded bg-muted" />
        </UCardHeader>
      </UCard>
    </Transition>
  </div>
</template>
