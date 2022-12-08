import { useMedia } from 'react-use'

export function usePreferredDark(defaultState?: boolean): boolean {
  return useMedia('(prefers-color-scheme: dark)', defaultState)
}
