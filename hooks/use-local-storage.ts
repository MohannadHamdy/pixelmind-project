"use client"

import * as React from "react"

type Listener = () => void

const listeners = new Map<string, Set<Listener>>()

function getStoredValue(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function subscribe(key: string, listener: Listener) {
  let keyListeners = listeners.get(key)
  if (!keyListeners) {
    keyListeners = new Set()
    listeners.set(key, keyListeners)
  }
  keyListeners.add(listener)
  return () => keyListeners.delete(listener)
}

function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener())
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const stored = React.useSyncExternalStore(
    (listener) => subscribe(key, listener),
    () => getStoredValue(key),
    () => null
  )

  const state = stored !== null ? (JSON.parse(stored) as T) : defaultValue

  const setState = React.useCallback(
    (value: T | ((prev: T) => T)) => {
      const stored = getStoredValue(key)
      const prev = stored !== null ? (JSON.parse(stored) as T) : defaultValue
      const next = value instanceof Function ? value(prev) : value
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {
        // quota exceeded or private browsing — silently ignore
      }
      notify(key)
    },
    [key, defaultValue]
  )

  return [state, setState] as const
}
