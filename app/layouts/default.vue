<template>
  <div class="hidden h-screen gap-3 bg-card p-3 xl:flex">
    <Aside />
    <main class="z-10 h-full flex-1">
      <UCard class="flex h-full flex-col items-center justify-center gap-4 bg-background">
        <slot />
      </UCard>
    </main>
  </div>
  <div class="flex h-screen gap-3 bg-card p-3 xl:hidden">
    <main class="z-10 h-full flex-1">
      <UCard class="flex h-full flex-col items-center justify-center gap-4 bg-background">
        <slot />
      </UCard>
    </main>
  </div>
</template>
