<script lang="ts" setup>
const props = withDefaults(defineProps<{
  duration?: number
  color?: string
}>(), {
  color: 'white',
  duration: 5,
})

const emit = defineEmits<{
  onComplete: []
}>()

const [scope, animate] = useAnimate()

function onComplete() {
  emit('onComplete')
  animate(scope.value, { scaleX: 0 }, { duration: 0.1 })
}
</script>

<template>
  <UButton
    v-bind="$attrs"
    class="relative overflow-hidden"
    @pointerdown="animate(scope, { scaleX: 1 }, { duration: props.duration, onComplete })"
    @pointerup="animate(scope, { scaleX: 0 }, { duration: 0.1 })"
  >
    <div
      ref="scope"
      class="absolute inset-0 h-full origin-left opacity-40 mix-blend-overlay"
      :style="{ backgroundColor: props.color }"
      style="transform: scaleX(0)"
    />
    <slot />
  </UButton>
</template>
