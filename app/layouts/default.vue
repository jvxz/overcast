<script lang="ts" setup>
const { isAsideOpen } = useAsideState()
</script>

<template>
  <div class="flex h-screen gap-3 bg-card p-3">
    <aside
      :data-open="isAsideOpen"
      class="w-[var(--aside-width-closed)] shrink-0 duration-150 ease-out data-[open=true]:w-[var(--aside-width-open)]"
    >
      <UButton
        class="size-16"
        variant="ghost"
        @click="isAsideOpen = !isAsideOpen"
      >
        <Icon class="!size-8" name="mingcute-clouds-line" />
      </UButton>
    </aside>
    <main class="h-full flex-1">
      <slot />
    </main>
  </div>
</template>
