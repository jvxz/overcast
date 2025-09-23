<script lang="ts" setup>
import { motion } from 'motion-v'

const { formMode } = useFormMode()

function isActive(mode: SubmitMode) {
  if (mode === 'track' || mode === 'multi') {
    return mode === 'track' || mode === 'multi'
  }

  return mode === formMode.value
}
</script>

<template>
  <div class="flex w-full gap-1 font-mono">
    <UButton
      v-for="mode in SUBMIT_MODES.filter(mode => mode !== 'multi')"
      :key="mode"
      variant="ghost"
      :data-active="isActive(mode)"
      class="relative bg-transparent hover:bg-muted/50 active:bg-muted/60 disabled:opacity-100 data-[active=true]:text-foreground"
      @click="formMode = mode"
    >
      <p class="z-10">
        {{ mode }}
      </p>
      <motion.div
        v-if="isActive(mode)"
        layout-id="form-mode-select"
        :transition="{
          type: 'tween',
          duration: 0.15,
          ease: 'easeOut',
        }"
        class="absolute inset-0 size-full rounded bg-muted bg-blend-lighten"
      />
    </UButton>
  </div>
</template>
