<script lang="ts" setup>
import { breakpointsTailwind } from '@vueuse/core'

const [dim, toggleDim] = useToggle(true)

const { active: getActiveBreakpoint } = useBreakpoints(breakpointsTailwind, {
  ssrWidth: 1280,
})

const activeBreakpoint = getActiveBreakpoint()
</script>

<template>
  <div
    :class="cn(
      'fixed right-2 bottom-2 rounded bg-muted p-1 font-mono text-sm z-50',
      dim ? 'opacity-75' : 'opacity-25',
    )"
    @click="toggleDim()"
  >
    {{ activeBreakpoint }}
  </div>
</template>
