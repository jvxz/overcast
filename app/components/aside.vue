<script lang="ts" setup>
import { motion } from 'motion-v'

const asideState = useAsideState()

function handleTabClick(tab: typeof ASIDE_TABS[number]) {
  if (tab === asideState.value && asideState.value !== null) {
    asideState.value = null
    return
  }
  asideState.value = tab
}

const tabMap: Record<Exclude<typeof ASIDE_TABS[number], 'about'>, { icon: string }> = {
  'artist': {
    icon: 'mingcute:user-2-line',
  },
  'multi-track': {
    icon: 'mingcute:grid-line',
  },
  'playlist': {
    icon: 'mingcute:playlist-line',
  },
}
</script>

<template>
  <div class="z-10 flex w-12 shrink-0 animate-in flex-col gap-1 duration-150 fade-in">
    <UButton
      v-for="tab in ASIDE_TABS.filter(tab => tab !== 'about')"
      :key="tab"
      :data-active="tab === asideState"
      class="relative size-12 bg-transparent hover:bg-muted/50 active:bg-muted/60 disabled:opacity-100 data-[active=true]:text-foreground"
      variant="ghost"
      @click="handleTabClick(tab)"
    >
      <Icon :name="tabMap[tab].icon" class="z-10 !size-8" />
      <motion.div
        v-if="tab === asideState"
        layout-id="aside-tab"
        :transition="{
          type: 'tween',
          duration: 0.10,
          ease: 'easeOut',
        }"
        class="absolute inset-0 size-full rounded bg-muted"
      />
    </UButton>

    <div class="flex-1" />

    <UButton
      :data-active="asideState === 'about'"
      class="relative size-12 bg-transparent hover:bg-muted/50 active:bg-muted/60 disabled:opacity-100 data-[active=true]:bg-muted data-[active=true]:text-foreground"
      variant="ghost"
      @click="handleTabClick('about')"
    >
      <Icon name="mingcute:information-line" class="z-10 !size-8" />
    </UButton>
  </div>

  <Transition>
    <AsideContent v-if="asideState !== null" />
  </Transition>
</template>
