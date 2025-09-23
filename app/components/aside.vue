<script lang="ts" setup>
const { isAsideOpen } = useAsideState()
</script>

<template>
  <aside
    :data-open="isAsideOpen"
    class="flex w-[var(--aside-width-closed)] shrink-0 gap-3 duration-150 ease-out data-[open=true]:w-[var(--aside-width-open)] motion-reduce:transition-none"
  >
    <UButton
      class="size-16"
      variant="ghost"
      @click="isAsideOpen = !isAsideOpen"
    >
      <Logo class="!size-8" />
    </UButton>
    <Transition>
      <AsideContent v-if="isAsideOpen" />
    </Transition>
  </aside>
</template>
