<template>
  <UCard class="flex h-full flex-col items-center justify-center gap-4 bg-background">
    <div class="flex h-full w-xl animate-in flex-col gap-4 duration-200 fade-in-0 zoom-in-90">
      <div class="flex w-full flex-1 items-end justify-center">
        <h1 class="flex items-center justify-center gap-1 text-4xl font-medium">
          <Logo class="!size-11" />
          overcast
        </h1>
      </div>
      <IndexUrlForm />
      <div class="flex-1">
        <IndexServerErrorAlert />
      </div>
    </div>
  </UCard>
</template>
