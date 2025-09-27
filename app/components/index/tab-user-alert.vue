<script lang="ts" setup>
const hasShownTabUserAlert = useLocalStorage('has-shown-tab-user-alert', false)
const serverError = useServerError()
const showTabUserAlert = ref(false)

onKeyStroke('Tab', () => {
  if (!hasShownTabUserAlert.value) {
    showTabUserAlert.value = true
  }
})

function handleClose() {
  showTabUserAlert.value = false
  hasShownTabUserAlert.value = true
}
</script>

<template>
  <Transition name="err">
    <UAlertRoot
      v-if="showTabUserAlert && !serverError"
      class="flex flex-col p-4"
    >
      <div class="flex w-full items-center justify-between">
        <UAlertTitle>
          Hello, tab user!
        </UAlertTitle>
        <UButton
          class="-my-2 translate-x-2 -translate-y-1 px-0"
          variant="ghost"
          size="icon"
          @click="handleClose"
        >
          <Icon name="mingcute:close-line" />
        </UButton>
      </div>
      <UAlertDescription>
        You can simply paste a URL to submit it, or you can start typing anywhere to focus on the input field.
      </UAlertDescription>
    </UAlertRoot>
  </Transition>
</template>
