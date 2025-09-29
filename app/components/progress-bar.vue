<script lang="ts" setup>
const props = defineProps<{
  progress: string | number
  class?: string
}>()
</script>

<template>
  <div v-bind="$attrs" :class="cn('relative overflow-hidden', props.class)">
    <slot />
    <div class="pointer-events-none absolute inset-0 z-100 h-full bg-black/10 p-0 mix-blend-hard-light duration-100 dark:bg-neutral-700/25 dark:mix-blend-screen" :style="{ width: `${progress}%` }"></div>
  </div>
</template>
