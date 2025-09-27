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

const tabMap: Record<typeof ASIDE_TABS[number], { icon: string }> = {
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
  <aside
    :data-open="asideState !== null"
    class="flex w-[var(--aside-width-closed)] shrink-0 gap-3 duration-150 ease-out data-[open=true]:w-[var(--aside-width-open)] motion-reduce:transition-none"
  >
    <div class="flex w-12 shrink-0 flex-col gap-1">
      <UButton
        v-for="tab in ASIDE_TABS"
        :key="tab"
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
            duration: 0.15,
            ease: 'easeOut',
          }"
          class="absolute inset-0 size-full rounded bg-muted"
        />
      </UButton>
    </div>

    <Transition>
      <AsideContent v-if="asideState !== null" />
    </Transition>
  </aside>
</template>
