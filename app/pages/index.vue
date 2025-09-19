<script lang="ts" setup>
const trackUrl = ref('')

const { downloadTrack, isDownloadingTrack } = useTrack()

function handleSubmit() {
  if (trackUrl.value) {
    downloadTrack(trackUrl.value)
  }
}
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-center gap-4">
    <div class="flex w-xl flex-col gap-4">
      <div class="flex-1" />
      <UCard class="w-full shrink-0 flex-row gap-2 p-2">
        <form
          class="flex w-full items-center gap-3"
          @submit.prevent="handleSubmit"
        >
          <UInput
            v-model="trackUrl"
            placeholder="Enter a track URL"
            class="border-none bg-transparent px-0 pl-3 shadow-none"
          />
          <UButton
            :disabled="!trackUrl"
            :is-loading="isDownloadingTrack"
            size="icon"
            variant="ghost"
          >
            <Icon name="tabler:arrow-right" />
          </UButton>
        </form>
      </UCard>
      <div class="flex-1">
        <UAlertRoot v-if="trackUrl">
          <UAlertTitle>
            Track downloaded successfully
          </UAlertTitle>
          <UAlertDescription>
            The track has been downloaded successfully.
          </UAlertDescription>
        </UAlertRoot>
      </div>
    </div>
  </div>
</template>
