<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    :class="cn(
      'ml-auto rounded-md bg-muted/50 p-1 text-xs tracking-widest text-muted-foreground',
      props.class,
    )"
  >
    <slot />
  </span>
</template>
