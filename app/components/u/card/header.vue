<script lang="ts" setup>
const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    data-slot="card-header"
    :class="cn('flex flex-col gap-1.5', props.class)"
  >
    <slot />
  </div>
</template>
