<script lang="ts" setup>
const props = defineProps<{
  track: UserTracksData['collection'][number]
}>()

const qc = useQueryClient()
const { isOpen: isCoverDialogOpen, trackUrl: coverDialogTrackUrl } = useCoverDialog()
const { downloadTrack, isDownloadingTrack } = useTrack()
const { addTrackToMultiTrack, multiTracks } = useMultiTrack()
const { trackDownloadProgress } = useServerState(props.track.permalink_url)

const artist = computed(() => props.track.publisher_metadata?.artist ?? props.track.user.username)
const createdAt = useDateFormat(() => props.track.created_at ?? '', DATE_FORMAT_STRING)
const coverUrl = computed(() => props.track.artwork_url ?? props.track.user.avatar_url)

function handleAddTrackToMultiTrack() {
  qc.setQueryData([props.track.permalink_url], props.track)
  addTrackToMultiTrack(props.track.permalink_url)
}

function handleOpenCoverDialog() {
  qc.setQueryData([props.track.permalink_url], props.track)

  isCoverDialogOpen.value = true
  coverDialogTrackUrl.value = props.track.permalink_url
}
</script>

<template>
  <ProgressBar :progress="trackDownloadProgress">
    <UCard class="relative h-24 w-full flex-row gap-3 p-3">
      <UCardHeader class="aspect-square h-full">
        <NuxtImg
          :src="coverUrl"
          class="size-full rounded"
          @click="handleOpenCoverDialog"
        />
      </UCardHeader>
      <div class="flex h-[calc(100%-0.5rem)] w-fit flex-1 flex-col justify-between self-center *:[text-box:trim-both]">
        <NuxtLink
          :title="track.title"
          :href="track.permalink_url"
          class="max-w-fit -translate-y-0.5 truncate text-lg font-medium hover:underline"
        >
          {{ track.title }}
        </NuxtLink>
        <p :title="artist" class="-translate-y-0.5 truncate text-sm font-medium text-muted-foreground">
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
          :is-loading="isTargetBusy(track.permalink_url)"
          :disabled="isDownloadingTrack"
          @click="downloadTrack({ target: track.permalink_url, trackUrl: track.permalink_url })"
        >
          <Icon name="mingcute:download-line" />
        </UButton>
        <UButton
          v-if="!multiTracks.has(track.permalink_url)"
          size="icon"
          variant="ghost"
          @click="handleAddTrackToMultiTrack"
        >
          <Icon name="mingcute:plus-line" />
        </UButton>
        <UButton
          v-else
          :disabled="true"
          size="icon"
          variant="ghost"
        >
          <Icon name="mingcute:check-line" />
        </UButton>
      </div>
    </UCard>
  </ProgressBar>
</template>
