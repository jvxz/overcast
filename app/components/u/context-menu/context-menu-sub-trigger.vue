<script setup lang="ts">
import type { ContextMenuSubTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { useForwardProps } from 'reka-ui'

const props = defineProps<ContextMenuSubTriggerProps & { class?: HTMLAttributes['class'], inset?: boolean }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <ContextMenuSubTrigger
    v-bind="forwardedProps"
    :class="cn(
      popoverStyles.item,
      props.class,
    )"
  >
    <slot />
    <Icon name="tabler:chevron-right" class="ml-auto !size-4" />
  </ContextMenuSubTrigger>
</template>
