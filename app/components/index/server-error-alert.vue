<script lang="ts" setup>
const serverError = useServerError()

const codeMap = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
  412: 'Precondition failed',
  413: 'Payload too large',
  414: 'URI too long',
  422: 'Unprocessable entity',
  500: 'Internal server error',
  503: 'Service unavailable',
}
</script>

<template>
  <Transition name="err">
    <UAlertRoot
      v-if="serverError"
      variant="danger"
      class="flex flex-col p-4 glow-red-900"
    >
      <div class="flex w-full items-center justify-between">
        <UAlertTitle>
          {{ codeMap[serverError.statusCode as keyof typeof codeMap] ?? serverError.statusCode }}
        </UAlertTitle>
        <UButton
          class="active: -my-2 translate-x-2 -translate-y-1 px-0 hover:bg-danger/60 active:bg-danger/50"
          variant="ghost"
          size="icon"
          @click="serverError = null"
        >
          <Icon name="mingcute:close-line" />
        </UButton>
      </div>
      <UAlertDescription>
        {{ serverError.message }}
      </UAlertDescription>
    </UAlertRoot>
  </Transition>
</template>
