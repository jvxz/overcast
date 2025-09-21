<script lang="ts" setup>
const { serverError } = useServerError()

const trackUrl = ref('')

const { downloadTrack, isDownloadingTrack } = useTrack()

function handleSubmit() {
  if (trackUrl.value) {
    downloadTrack(trackUrl.value)
  }
}

const { serverState, serverStateData } = useServerState()

const progress = computed(() => serverState.value === 'downloading' ? Math.round(Number(serverStateData.value) * 100) : 0)
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-center gap-4">
    <div class="flex w-xl flex-col gap-4">
      <div class="flex-1" />
      <UCard class="relative w-full shrink-0 flex-col gap-2 overflow-hidden p-2 px-4">
        <form
          class="flex w-full items-center gap-3"
          @submit.prevent="handleSubmit"
        >
          <UInput
            v-model="trackUrl"
            placeholder="Enter a track URL"
            class="border-none bg-transparent px-0 shadow-none"
          />
          <UButton
            :disabled="!trackUrl"
            :is-loading="isDownloadingTrack"
            size="icon"
            variant="ghost"
            class="translate-x-2 px-0"
          >
            <Icon name="tabler:arrow-right" />
          </UButton>
        </form>
        <div class="absolute inset-0 h-full bg-muted/20 p-0 duration-100" :style="{ width: `${progress}%` }"></div>
        <!-- <div class="flex gap-2 font-mono">
          <UButton variant="ghost">
            artist
          </UButton>
        </div> -->
      </UCard>
      <div class="flex-1">
        <Transition>
          <UAlertRoot v-if="serverError" class="flex flex-col p-4">
            <div class="flex w-full items-center justify-between">
              <UAlertTitle>
                {{ serverError.statusCode }}
              </UAlertTitle>
              <UButton
                class="-my-2 translate-x-2 -translate-y-1 px-0"
                variant="ghost"
                size="icon"
                @click="serverError = null"
              >
                <Icon name="tabler:x" />
              </UButton>
            </div>
            <UAlertDescription>
              {{ serverError.message }}
            </UAlertDescription>
          </UAlertRoot>
        </Transition>
      </div>
    </div>
  </div>
</template>
