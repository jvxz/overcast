export const useCoverDialog = createGlobalState(() => ({
  isOpen: ref(false),
  trackUrl: ref<string | null>(null),
}))
