<script lang="ts" setup>
const { $version } = useNuxtApp()
const { asideTab, isAsideOpen } = useAsideState()
</script>

<template>
  <div class="flex min-w-[500px] flex-col">
    <div class="flex h-16 items-center justify-between">
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
          @click="isAsideOpen = false"
        >
          <Icon name="mingcute:align-arrow-left-line" class="!size-4" />
        </UButton>
      </div>
    </div>
    <AsideContentArtist v-if="asideTab === 'artist'" />
    <AsideContentMultiTrack v-if="asideTab === 'multi-track'" />
  </div>
</template>
