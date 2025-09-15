<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { useCommand } from '.'

const props = defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const { filterState } = useCommand()
const isRender = computed(() => !!filterState.search && filterState.filtered.count === 0,
)
</script>

<template>
  <Primitive
    v-if="isRender"
    v-bind="delegatedProps"
    :class="cn('peer py-5 text-center text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </Primitive>
</template>
