<script setup lang="ts">
import type { ListboxGroupProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed, onMounted, onUnmounted, useId } from 'vue'
import { provideCommandGroupContext, useCommand } from '.'

const props = defineProps<ListboxGroupProps & {
  class?: HTMLAttributes['class']
  heading?: string
  icon?: string
}>()

const delegatedProps = reactiveOmit(props, 'class')

const { allGroups, filterState } = useCommand()
const id = useId()

const isRender = computed(() => !filterState.search ? true : filterState.filtered.groups.has(id))

provideCommandGroupContext({ id })
onMounted(() => {
  if (!allGroups.value.has(id))
    allGroups.value.set(id, new Set())
})
onUnmounted(() => {
  allGroups.value.delete(id)
})
</script>

<template>
  <ListboxGroup
    v-bind="delegatedProps"
    :id="id"
    :class="cn(
      'mb-1 overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-0 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-items]]:space-y-1',
      props.class,
    )"
    :hidden="isRender ? undefined : true"
  >
    <ListboxGroupLabel v-if="heading" class="flex my-0.5 items-center gap-1 px-2 py-1.5 text-xs font-medium text-muted-foreground">
      <Icon v-if="icon" :name="icon" />
      {{ heading }}
    </ListboxGroupLabel>
    <slot />
  </ListboxGroup>
</template>
