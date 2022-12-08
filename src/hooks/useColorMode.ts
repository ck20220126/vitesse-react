import { useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from 'react-use'
import { usePreferredDark } from './usePreferredDark'

export type BasicColorSchema = 'light' | 'dark' | 'auto'

export interface UseColorModeOptions<T extends string = BasicColorSchema> {
  /**
   * @default 'html'
   */
  selector?: string

  /**
   * @default 'class'
   */
  attribute?: string

  /**
   * @default 'auto'
   */
  initialValue?: T | BasicColorSchema

  modes?: Partial<Record<T | BasicColorSchema, string>>

  onChanged?: (mode: T | BasicColorSchema) => void

  /**
   * @default 'vueuse-color-scheme'
   */
  storageKey?: string
}

export default function useColorMode<T extends string = BasicColorSchema>(options: UseColorModeOptions<T> = {}): [T | BasicColorSchema | undefined, (mode: T | BasicColorSchema) => void] {
  const {
    selector = 'html',
    attribute = 'class',
    initialValue = 'auto',
    storageKey = 'vueuse-color-schema',
  } = options

  const modes = {
    auto: '',
    light: 'light',
    dark: 'dark',
    ...options.modes || {},
  } as Record<BasicColorSchema | T, string>

  const preferredDark = usePreferredDark()
  const preferredMode = useMemo(() => preferredDark ? 'dark' : 'light', [preferredDark])
  const [store, setStore] = useLocalStorage<T | BasicColorSchema>(storageKey, initialValue)
  const [state, setState] = useState<T | BasicColorSchema>()

  const updateHtmlAttribute = (_value: string) => {
    const el = window?.document.querySelector(selector)
    if (!el || !_value)
      return

    if (attribute === 'class') {
      const current = _value.split(/\s/g)
      Object.values(modes)
        .flatMap(i => (i || '').split(/\s/g))
        .filter(Boolean)
        .forEach((v) => {
          if (current.includes(v))
            el.classList.add(v)
          else el.classList.remove(v)
        })
    }
    else {
      el.setAttribute(attribute, _value)
    }
  }

  useEffect(() => {
    setState(store === 'auto' ? preferredMode : store as BasicColorSchema)
  }, [])

  useEffect(() => {
    if (store)
      setState(store)
  }, [preferredMode])

  useEffect(() => {
    if (state) {
      setStore(state)

      const resolvedMode = state === 'auto' ? preferredMode : state
      updateHtmlAttribute(modes[resolvedMode] ?? resolvedMode)
    }
  }, [state])

  return [state, setState]
}
