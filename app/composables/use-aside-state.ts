export const ASIDE_TABS = ['multi-track', 'artist', 'playlist'] as const

export function useAsideState() {
  return useState('aside-state', () => null as typeof ASIDE_TABS[number] | null)
}
