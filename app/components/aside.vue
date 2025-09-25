<script lang="ts" setup>
const asideState = useAsideState()

function handleTabClick(tab: typeof ASIDE_TABS[number]) {
  if (tab === asideState.value.asideTab && asideState.value.isAsideOpen) {
    asideState.value.isAsideOpen = false
    return
  }
  asideState.value.asideTab = tab
  asideState.value.isAsideOpen = true
}

const tabMap: Record<typeof ASIDE_TABS[number], { icon: string }> = {
  'artist': {
    icon: 'mingcute:user-2-line',
  },
  'multi-track': {
    icon: 'mingcute:grid-line',
  },
}
</script>

<template>
  <aside
    :data-open="asideState.isAsideOpen"
    class="flex w-[var(--aside-width-closed)] shrink-0 gap-3 duration-150 ease-out data-[open=true]:w-[var(--aside-width-open)] motion-reduce:transition-none"
  >
    <div class="flex w-12 shrink-0 flex-col gap-1">
      <UButton
        v-for="tab in ASIDE_TABS"
        :key="tab"
        class="size-12"
        variant="ghost"
        @click="handleTabClick(tab)"
      >
        <Icon :name="tabMap[tab].icon" class="!size-8" />
      </UButton>
    </div>

    <Transition>
      <AsideContent v-if="asideState.isAsideOpen" />
    </Transition>
  </aside>
</template>
