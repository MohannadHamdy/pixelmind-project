"use client"

import * as React from "react"

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [initialized, setInitialized] = React.useState(false)
  const [state, setState] = React.useState<T>(defaultValue)

  // Hydrate from localStorage after first render (avoids hydration mismatch)
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setState(JSON.parse(stored) as T)
      }
    } catch {
      // ignore
    }
    setInitialized(true)
  }, [key])

  React.useEffect(() => {
    if (!initialized) return
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // quota exceeded or private browsing — silently ignore
    }
  }, [key, state, initialized])

  return [state, setState] as const
}
