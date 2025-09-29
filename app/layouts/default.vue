<script lang="ts" setup>
import { breakpointsTailwind } from '@vueuse/core'

const asideState = useAsideState()
const breakpoints = useBreakpoints(breakpointsTailwind)

const isDesktop = breakpoints.xl
</script>

<template>
  <div class="relative flex h-screen gap-3 xl:bg-card xl:p-3">
    <aside
      :data-open="asideState !== null"
      class="flex w-0 xl:w-[var(--aside-width-closed)] shrink-0 gap-3 duration-150 ease-out xl:data-[open=true]:w-[var(--aside-width-open)] motion-reduce:transition-none"
    >
      <Aside v-if="isDesktop" class="hidden xl:flex" />
      <AsideMobile v-else class="flex xl:hidden" />
    </aside>
    <main class="z-10 h-full flex-1">
      <UButton
        class="absolute top-4 left-4 size-12 xl:hidden"
        size="icon"
        variant="soft"
        @click="asideState === 'multi-track' ? asideState = null : asideState = 'multi-track'"
      >
        <Icon name="mingcute:align-arrow-right-line" class="!size-7" />
      </UButton>
      <UButton
        class="absolute top-4 right-4 size-12 xl:hidden"
        size="icon"
        variant="soft"
        @click="$colorMode.value === 'dark' ? $colorMode.value = 'light' : $colorMode.value = 'dark'"
      >
        <Icon :name="$colorMode.value === 'dark' ? 'mingcute:moon-line' : 'mingcute:sun-line'" class="!size-7" />
      </UButton>
      <UCard class="flex h-full flex-col items-center justify-center gap-4 border-none bg-background xl:border-solid">
        <Transition>
          <div v-if="asideState !== null" class="absolute inset-0 z-10 block size-full bg-black opacity-50 transition-opacity duration-150 xl:hidden" />
        </Transition>
        <slot />
      </UCard>
    </main>
  </div>
</template>
