import type React from 'react'
import { useEffect, useRef } from 'react'
import { type BasicTarget, getTargetElement } from './utils/domTarget'

export default function useDoubleClick(target: BasicTarget, { interval = 3000 }: {
  interval?: number
}, callback?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void) {
  const prevTime = useRef<number>()
  // const targetElement = getTargetElement(target)
  const targetElement = useRef<any>()
  function start() {
    targetElement.current = getTargetElement(target)
    console.log('<useDoubleClick> {start} targetElement:', targetElement.current)
    targetElement.current?.addEventListener('click', handleClick)
  }

  function handleClick(event: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const newDate = Date.now()

    if (!prevTime.current) {
      prevTime.current = Date.now()
      return
    }

    if (newDate - prevTime.current < interval) {
      callback?.(event)
      prevTime.current = 0
    }
    else { prevTime.current = Date.now() }
  }

  function end() {
    targetElement.current?.removeEventListener('click', handleClick)
  }
  useEffect(() => {
    if (target)
      start()

    return end
  }, [target])
}
