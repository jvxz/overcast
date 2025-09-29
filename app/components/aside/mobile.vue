<script lang="ts" setup>
const asideState = useAsideState()

const el = ref<HTMLElement>()
onClickOutside(el, () => {
  asideState.value = null
})
</script>

<template>
  <FocusScope :trapped="asideState !== null">
    <Transition name="aside-mobile">
      <div
        v-if="asideState !== null"
        ref="el"
        class="absolute inset-0 z-20 w-full p-3 md:w-3/4"
      >
        <UCard class="size-full">
          <AsideContent />
        </UCard>
      </div>
    </Transition>
  </FocusScope>
</template>

<style scoped>
.aside-mobile-enter-active,
.aside-mobile-leave-active {
  transition: all 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.aside-mobile-enter-from,
.aside-mobile-leave-to {
  transform: translateX(-100%);
}
</style>
