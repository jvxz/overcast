export const ASIDE_TABS = ['artist', 'multi-track'] as const

export function useAsideState() {
  return useState('aside-state', () => ({
    asideTab: ASIDE_TABS[0] as typeof ASIDE_TABS[number],
    isAsideOpen: false,
  }))
}
