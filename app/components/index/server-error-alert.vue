<script lang="ts" setup>
const { serverError } = useServerError()
</script>

<template>
  <Transition name="err">
    <UAlertRoot v-if="serverError" class="flex flex-col p-4">
      <div class="flex w-full items-center justify-between">
        <UAlertTitle>
          {{ serverError.statusCode }}
        </UAlertTitle>
        <UButton
          class="-my-2 translate-x-2 -translate-y-1 px-0"
          variant="ghost"
          size="icon"
          @click="serverError = null"
        >
          <Icon name="tabler:x" />
        </UButton>
      </div>
      <UAlertDescription>
        {{ serverError.message }}
      </UAlertDescription>
    </UAlertRoot>
  </Transition>
</template>
