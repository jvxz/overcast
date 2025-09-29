<template>
  <div class="flex h-full xl:-translate-x-7.5 flex-col items-center justify-center">
    <div class="flex h-28 gap-4">
      <div class="h-full">
        <Logo class="aspect-square !size-full" />
      </div>
      <div class="flex h-full -translate-y-1 flex-col justify-evenly">
        <h1 class="text-4xl font-medium">
          overcast
        </h1>
        <p class="text-sm font-medium text-muted-foreground">
          v{{ $version }}
        </p>
        <p class="text-sm text-muted-foreground">
          With 🩵 by <NuxtLink href="https://github.com/jvxz" class="underline">
            @jvxz
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
