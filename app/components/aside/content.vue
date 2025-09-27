<script lang="ts" setup>
const { $version } = useNuxtApp()
const asideState = useAsideState()
</script>

<template>
  <div class="flex min-w-[516px] flex-col gap-2">
    <div class="flex h-12 items-center justify-between">
      <h1 class="text-2xl font-medium">
        {{ toCapitalized(asideState ?? '') }}
      </h1>
      <div class="flex items-center gap-2">
        <p class="font-mono text-sm font-medium text-muted-foreground">
          {{ $version }}
        </p>
        <UButton
          variant="ghost"
          size="icon"
          @click="asideState = null"
        >
          <Icon name="mingcute:align-arrow-left-line" class="!size-4" />
        </UButton>
      </div>
    </div>
    <AsideContentArtist v-if="asideState === 'artist'" />
    <AsideContentPlaylist v-if="asideState === 'playlist'" />
    <AsideContentMultiTrack v-if="asideState === 'multi-track'" />
    <AsideContentAbout v-if="asideState === 'about'" />
  </div>
</template>
