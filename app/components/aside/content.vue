<script lang="ts" setup>
const { $version } = useNuxtApp()
const asideState = useAsideState()
</script>

<template>
  <div class="flex min-w-[500px] flex-col gap-2">
    <div class="flex h-12 items-center justify-between">
      <h1 class="text-2xl font-medium">
        overcast
      </h1>
      <div class="flex items-center gap-2">
        <p class="font-mono text-sm font-medium text-muted-foreground">
          {{ $version }}
        </p>
        <UButton
          variant="ghost"
          size="icon"
          @click="asideState.isAsideOpen = false"
        >
          <Icon name="mingcute:align-arrow-left-line" class="!size-4" />
        </UButton>
      </div>
    </div>
    <AsideContentArtist v-if="asideState.asideTab === 'artist'" />
    <AsideContentMultiTrack v-if="asideState.asideTab === 'multi-track'" />
  </div>
</template>
