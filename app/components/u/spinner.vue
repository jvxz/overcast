<script setup lang="ts">
defineOptions({ name: 'Spinner' })
const props = defineProps<{
  invert?: boolean
}>()

const colorMode = useColorMode()

const stroke = computed(() => {
  if (colorMode.value === 'dark') {
    return props.invert ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
  }

  return props.invert ? 'var(--muted-foreground)' : 'var(--primary-foreground)'
})
</script>

<template>
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
    :style="{ '--spinner-stroke': stroke }"
  >
    <title>Loading...</title>
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '0s' }"
      d="M50 22v11"
    />
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '-.1s' }"
      transform="rotate(-30 50 50)"
      d="M50 22v11"
    />
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '-.2s' }"
      transform="rotate(-60 50 50)"
      d="M50 22v11"
    />
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '-.3s' }"
      transform="rotate(-90 50 50)"
      d="M50 22v11"
    />
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '-.4s' }"
      transform="rotate(-120 50 50)"
      d="M50 22v11"
    />
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '-.5s' }"
      transform="rotate(-150 50 50)"
      d="M50 22v11"
    />
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '-.6s' }"
      transform="rotate(-180 50 50)"
      d="M50 22v11"
    />
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '-.7s' }"
      transform="rotate(-210 50 50)"
      d="M50 22v11"
    />
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '-.8s' }"
      transform="rotate(-240 50 50)"
      d="M50 22v11"
    />
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '-.9s' }"
      transform="rotate(-270 50 50)"
      d="M50 22v11"
    />
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '-1s' }"
      transform="rotate(-300 50 50)"
      d="M50 22v11"
    />
    <path
      class="spinner-line"
      stroke-width="6"
      :style="{ animationDelay: '-1.1s' }"
      transform="rotate(-330 50 50)"
      d="M50 22v11"
    />
  </svg>
</template>

<style scoped>
@keyframes spinner-fade {
  0% {
    opacity: 1;
  }
  to {
    opacity: 0.1;
  }
}

.spinner-line {
  animation: spinner-fade 1.2s linear infinite;
  stroke: var(--spinner-stroke);
  stroke-linecap: round;
}
</style>
