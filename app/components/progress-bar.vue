<script lang="ts" setup>
const props = defineProps<{
  progress: string | number
  class?: string
}>()
</script>

<template>
  <div v-bind="$attrs" :class="cn('relative', props.class)">
    <slot />
    <div class="absolute inset-0 z-100 h-full bg-muted/50 p-0 mix-blend-screen duration-100" :style="{ width: `${progress}%` }"></div>
  </div>
</template>
