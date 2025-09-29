<script lang="ts" setup>
const { $version } = useNuxtApp()
const asideState = useAsideState()
const serverError = useServerError()

function handleSwitch(direction: 'next' | 'previous') {
  if (!asideState.value) {
    return
  }

  const i = ASIDE_TABS.indexOf(asideState.value)

  if (direction === 'next') {
    if (i === ASIDE_TABS.length - 1) {
      asideState.value = ASIDE_TABS[0] as typeof ASIDE_TABS[number]
    }
    else {
      asideState.value = ASIDE_TABS[i + 1] as typeof ASIDE_TABS[number]
    }
  }
  else {
    if (i === 0) {
      asideState.value = ASIDE_TABS[ASIDE_TABS.length - 1] as typeof ASIDE_TABS[number]
    }
    else {
      asideState.value = ASIDE_TABS[i - 1] as typeof ASIDE_TABS[number]
    }
  }
}
</script>

<template>
  <div class="flex h-full flex-col gap-2 xl:min-w-[516px]">
    <div class="flex h-12 items-center justify-between">
      <div class="flex flex-1 items-center justify-end gap-2 xl:mx-0 xl:hidden">
        <UButton
          variant="ghost"
          size="icon"
          @click="handleSwitch('previous')"
        >
          <Icon name="mingcute:left-line" class="!size-4" />
        </UButton>
      </div>
      <h1 class="mx-auto w-[128px] shrink-0 text-center text-2xl font-medium xl:mx-0 xl:w-auto xl:flex-1 xl:text-left">
        {{ toCapitalized(asideState ?? '') }}
      </h1>
      <div class="flex flex-1 items-center justify-between gap-2 xl:flex-none xl:justify-start">
        <UButton
          variant="ghost"
          size="icon"
          class="xl:hidden"
          @click="handleSwitch('next')"
        >
          <Icon name="mingcute:right-line" class="!size-4" />
        </UButton>
        <p class="hidden font-mono text-sm font-medium text-muted-foreground xl:block">
          {{ $version }}
        </p>
        <UButton
          variant="ghost"
          class="relative"
          size="icon"
          @click="asideState = null"
        >
          <Icon name="mingcute:align-arrow-left-line" class="!size-4" />
          <template v-if="serverError">
            <div class="absolute -top-1 -right-1 size-2.5 rounded-full bg-danger xl:hidden"></div>
            <div class="absolute -top-1 -right-1 size-2.5 animate-ping rounded-full bg-danger xl:hidden"></div>
          </template>
        </UButton>
      </div>
    </div>
    <AsideContentArtist v-if="asideState === 'artist'" />
    <AsideContentPlaylist v-if="asideState === 'playlist'" />
    <AsideContentMultiTrack v-if="asideState === 'multi-track'" />
    <AsideContentAbout v-if="asideState === 'about'" />
  </div>
</template>
