<script lang="ts" setup>
import { Slot } from 'reka-ui'

interface ButtonProps {
  asChild?: boolean
  disabled?: boolean
  size?: 'default' | 'icon' | 'lg' | 'sm'
  variant?: 'default' | 'danger' | 'ghost' | 'link' | 'outline' | 'soft'
  class?: string
  isLoading?: boolean
}

const props = withDefaults(
  defineProps<ButtonProps>(),
  {
    asChild: false,
    class: '',
    disabled: false,
    isLoading: false,
    size: 'default',
    variant: 'default',
  },
)
</script>

<template>
  <Slot
    v-if="asChild"
    :disabled="disabled || isLoading"
    :class="cn(buttonVariants({ variant, size }), props.class, isLoading && 'grid text-transparent [grid-template-areas:stack]', disabled && 'pointer-events-none')"
  >
    <slot />
  </Slot>
  <button
    v-else
    :disabled="disabled || isLoading"
    :class="cn(buttonVariants({ variant, size }), props.class, isLoading && 'not-[.spinner]:text-transparent', disabled && 'pointer-events-none')"
  >
    <USpinner
      v-if="isLoading"
      :invert="true"
      class="absolute inset-0 top-1/2 left-1/2 !size-6 -translate-x-1/2 -translate-y-1/2"
    />
    <slot />
  </button>
</template>
