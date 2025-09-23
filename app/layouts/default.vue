<template>
  <div class="flex h-screen gap-3 bg-card p-3">
    <Aside />
    <main class="h-full flex-1 z-10">
      <slot />
    </main>
  </div>
</template>
