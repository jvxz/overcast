<script lang="ts" setup>
const { data } = useFetch('/api/test')
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <UCard>
      {{ data?.toUpperCase() }}
    </UCard>
  </div>
</template>
