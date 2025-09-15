<script lang="ts" setup>
const {data} = useFetch('/api/test')
</script>

<template>
  <div>
    {{ data?.toUpperCase() }}
  </div>
</template>
