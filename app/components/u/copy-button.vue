<script lang="ts" setup>
import type { Transition } from 'motion-v'
import { motion } from 'motion-v'

const props = defineProps<{
  value: MaybeRefOrGetter<string | undefined>
}>()

const animate = { opacity: 1, scale: 1 }
const exit = { opacity: 0, scale: 0.5 }
const initial = { opacity: 0, scale: 0.5 }
const transition: Transition = { duration: 0.15, ease: [0.25, 0, 0.06, 1] }

const copied = ref(false)
const { copy } = useClipboard()

const { start } = useTimeoutFn(() => {
  copied.value = false
}, 1000)

function copyValue(value: string) {
  copy(value)
  copied.value = true
  start()
}
</script>

<template>
  <UButton
    v-bind="$attrs"
    variant="ghost"
    class="size-7"
    size="icon"
    :aria-label="copied ? 'Copied' : 'Copy'"
    :disabled="copied"
    @click="copyValue(toValue(props.value) ?? '')"
  >
    <AnimatePresence :initial="false" mode="sync">
      <motion.div
        v-if="copied"
        :initial="initial"
        :animate="animate"
        :exit="exit"
        :transition="transition"
        class="absolute h-5"
      >
        <Icon
          name="mingcute:check-line"
          class="!size-4"
        />
      </motion.div>
      <motion.div
        v-else
        :initial="initial"
        :animate="animate"
        :exit="exit"
        :transition="transition"
        class="absolute h-5"
      >
        <Icon name="mingcute:copy-line" class="!size-4" />
      </motion.div>
    </AnimatePresence>
  </UButton>
</template>
