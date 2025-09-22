<script lang="ts" setup>
const { isAsideOpen } = useAsideState()
</script>

<template>
  <aside
    :data-open="isAsideOpen"
    class="w-[var(--aside-width-closed)] shrink-0 duration-150 ease-out data-[open=true]:w-[var(--aside-width-open)]"
  >
    <UButton
      class="size-16"
      variant="ghost"
      @click="isAsideOpen = !isAsideOpen"
    >
      <Logo class="!size-8" />
    </UButton>
  </aside>
</template>
