export function onPaste(fn: (text: string) => void, options?: { disabled?: Ref<boolean> }) {
  const activeElement = useActiveElement()
  const isFocusedOnField = computed(() => activeElement.value?.tagName === 'INPUT' || activeElement.value?.tagName === 'TEXTAREA')

  let text = ''

  function handlePaste(e: ClipboardEvent) {
    if (options?.disabled?.value || isFocusedOnField.value) {
      return
    }

    if (e.clipboardData) {
      text = e.clipboardData.getData('text')
      fn(text)
    }
  }

  onMounted(() => document.addEventListener('paste', handlePaste))
  onUnmounted(() => document.removeEventListener('paste', handlePaste))
}
