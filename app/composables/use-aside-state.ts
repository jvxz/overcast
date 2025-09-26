export const ASIDE_TABS = ['artist', 'multi-track'] as const

export function useAsideState() {
  return useState('aside-state', () => null as typeof ASIDE_TABS[number] | null)
}
