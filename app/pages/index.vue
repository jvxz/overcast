<template>
  <div class="flex h-full w-xl animate-in flex-col gap-4 duration-200 fade-in-0 zoom-in-90 xl:w-lg 2xl:w-xl">
    <div class="flex w-full flex-1 items-end justify-center">
      <h1 class="flex items-center justify-center gap-1 text-4xl font-medium">
        <Logo class="!size-11" />
        overcast
      </h1>
    </div>
    <IndexUrlForm />
    <div class="flex-1">
      <div class="relative size-full">
        <IndexServerErrorAlert />
        <IndexTabUserAlert />
      </div>
    </div>
  </div>
</template>
