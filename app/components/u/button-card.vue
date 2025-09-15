<script lang="ts" setup>
const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <button
    data-slot="button-card"
    :class="cn(
      buttonVariants({ variant: 'soft' }),
      staticStyles.base,
      staticStyles.variant.default,
      'w-full',
      props.class,
    )"
  >
    <slot />
  </button>
</template>
