<script lang="ts" setup>
import { motion } from 'motion-v'

const formMode = useFormMode()

const SUBMIT_MODE_MAP: Record<Exclude<typeof SUBMIT_MODES[number], 'multi'>, { icon: string }> = {
  artist: {
    icon: 'mingcute:user-2-line',
  },
  playlist: {
    icon: 'mingcute:playlist-line',
  },
  track: {
    icon: 'mingcute:music-line',
  },
}

const activeMode = computed<SubmitMode[]>(() => {
  if (formMode.value === 'track' || formMode.value === 'multi') {
    return ['track', 'multi']
  }

  return [formMode.value]
})
</script>

<template>
  <div class="flex w-full gap-1 font-mono">
    <UButton
      v-for="mode in SUBMIT_MODES.filter(mode => mode !== 'multi')"
      :key="mode"
      variant="ghost"
      class="relative bg-transparent hover:bg-muted/50 disabled:opacity-100"
      :class="activeMode.includes(mode) ? 'text-foreground' : ''"
      @click="formMode = mode"
    >
      <p class="z-10 hidden xl:block">
        {{ mode }}
      </p>
      <Icon :name="SUBMIT_MODE_MAP[mode].icon" class="z-10 xl:!hidden" />
      <motion.div
        v-if="activeMode.includes(mode)"
        layout-id="form-mode-select-mobile"
        :transition="{
          type: 'tween',
          duration: 0.10,
          ease: 'easeOut',
        }"
        class="absolute inset-0 size-full rounded bg-muted bg-blend-lighten"
      />
    </UButton>
  </div>
</template>
