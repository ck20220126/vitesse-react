import useColorMode from './useColorMode'
import { usePreferredDark } from './usePreferredDark'

export default function (): [boolean, () => void] {
  const [mode, setMode] = useColorMode()
  const preferredDark = usePreferredDark()

  function toggle() {
    const prevMode = mode === 'auto' ? preferredDark ? 'dark' : 'light' : mode
    const nextMode = prevMode === 'dark' === preferredDark ? 'light' : 'auto'
    setMode(nextMode)
  }

  function getDarkStatus(status: typeof mode): boolean {
    return (!status || status === 'auto' ? preferredDark ? 'dark' : 'light' : status) === 'dark'
  }

  return [getDarkStatus(mode), toggle]
}
