<script lang="ts" setup>
const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    data-slot="card-title"
    :class="cn('text-lg leading-none font-medium', props.class)"
  >
    <slot />
  </div>
</template>
