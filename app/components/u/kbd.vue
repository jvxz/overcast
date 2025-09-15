<script lang="ts" setup>
const props = defineProps<{
  class?: string
  icon?: string
}>()
</script>

<template>
  <kbd
    :class="cn(
      'inline-flex font-sans size-fit gap-0.5 items-center justify-center rounded-sm bg-muted p-0 px-0.5 text-xs text-muted-foreground *:[text-box:_trim-both_cap_alphabetic]',
      props.class,
    )"
  >
    <Icon v-if="props.icon" :name="props.icon" />
    <span v-else>⌘</span>
    <slot />
  </kbd>
</template>
