<script lang="ts" setup>
const { asideTab, isAsideOpen } = useAsideState()

function handleTabClick(tab: typeof ASIDE_TABS[number]) {
  if (tab === asideTab.value && isAsideOpen.value) {
    isAsideOpen.value = false
    return
  }
  asideTab.value = tab
  isAsideOpen.value = true
}

const tabMap: Record<typeof ASIDE_TABS[number], { icon: string }> = {
  'artist': {
    icon: 'mingcute:user-2-line',
  },
  'multi-track': {
    icon: 'mingcute:notebook-2-line',
  },
}
</script>

<template>
  <aside
    :data-open="isAsideOpen"
    class="flex w-[var(--aside-width-closed)] shrink-0 gap-3 duration-150 ease-out data-[open=true]:w-[var(--aside-width-open)] motion-reduce:transition-none"
  >
    <div class="flex w-16 shrink-0 flex-col gap-1">
      <UButton
        v-for="tab in ASIDE_TABS"
        :key="tab"
        class="size-16"
        variant="ghost"
        @click="handleTabClick(tab)"
      >
        <Icon :name="tabMap[tab].icon" class="!size-8" />
      </UButton>
    </div>

    <Transition>
      <AsideContent v-if="isAsideOpen" />
    </Transition>
  </aside>
</template>
