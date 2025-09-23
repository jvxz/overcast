export const ASIDE_TABS = ['artist', 'multi-track'] as const

export const useAsideState = createGlobalState(() => ({
  asideTab: ref<typeof ASIDE_TABS[number]>(ASIDE_TABS[0]),
  isAsideOpen: ref(false),
}))
