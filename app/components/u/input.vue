<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  defaultValue: props.defaultValue,
  passive: true,
})
</script>

<template>
  <input
    v-model="modelValue"
    data-1p-ignore
    :class="cn(staticStyles.base, interactiveStyles.size.default, staticStyles.variant.default, 'flex w-full min-w-0 cursor-text truncate  py-1 selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-0 md:text-sm', props.class)"
  >
</template>
