<script lang="ts" setup>
const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    data-slot="card-footer"
    :class="cn('flex items-center', props.class)"
  >
    <slot />
  </div>
</template>
