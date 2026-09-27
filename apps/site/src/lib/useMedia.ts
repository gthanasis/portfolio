import { useSyncExternalStore } from 'react'

// A media query as React state. False during prerender, real value in the browser.
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const m = matchMedia(query)
      m.addEventListener('change', onChange)
      return () => m.removeEventListener('change', onChange)
    },
    () => matchMedia(query).matches,
    () => false,
  )
}
