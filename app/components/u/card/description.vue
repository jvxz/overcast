<script lang="ts" setup>
const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    data-slot="card-description"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </div>
</template>
