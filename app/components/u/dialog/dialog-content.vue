<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<DialogContentProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      :class="cn(overlayStyles)"
    />
    <DialogContent
      v-bind="forwarded"
      data-slot="dialog-content"
      :class="
        cn(
          staticStyles.base,
          staticStyles.variant.default,
          'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-2 sm:max-w-xl',
          props.class,
        )"
    >
      <slot />

      <DialogClose
        :class="cn(
          interactiveStyles.base,
          interactiveStyles.variant.ghost,
          interactiveStyles.size.icon,
          'absolute top-3 right-3 inline-flex size-6 items-center justify-center opacity-70',
        )"
      >
        <Icon name="mingcute:close-line" class="size-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
