import React, { useEffect } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { initConsoleManual } from './lib/consoleManual'
import { useSandboxStore } from './store/useSandboxStore'

const DEFAULT_TOKEN =
  'eyJ1c2VyIjoiaC52YW5jZSIsInJvbGUiOiJDTElFTlQiLCJjbGVhcmFuY2UiOiJUSUVSXzEifQ=='

export function App() {
  const unlockAchievement = useSandboxStore((state) => state.unlockAchievement)
  const setClearance = useSandboxStore((state) => state.setClearance)

  useEffect(() => {
    // 1. Initialize secret DevTools console manual
    initConsoleManual()

    // 2. Set default clearance token if not present
    if (!localStorage.getItem('aegis_clearance_token')) {
      localStorage.setItem('aegis_clearance_token', DEFAULT_TOKEN)
    }

    // 3. Monkey-patch window.alert for DOM XSS detection (A05 Path B)
    const originalAlert = window.alert
    window.alert = (message?: any) => {
      unlockAchievement(4)
      originalAlert(message)
    }

    // 4. Polling watcher every 1000ms for localStorage aegis_clearance_token edits (A04)
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem('aegis_clearance_token')
        if (raw) {
          const parsed = JSON.parse(atob(raw))
          const role = (parsed.role || 'CLIENT').toUpperCase()
          const clearance = (parsed.clearance || 'TIER_1').toUpperCase()

          if (
            ['ADMIN', 'CHAIRMAN', 'SOVEREIGN'].includes(role) ||
            ['TIER_0', 'SOVEREIGN', 'ADMIN'].includes(clearance)
          ) {
            setClearance(clearance, role)
            unlockAchievement(3)
          }
        }
      } catch {
        // Corrupt token ignored until corrected
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [unlockAchievement, setClearance])

  return <RouterProvider router={router} />
}
