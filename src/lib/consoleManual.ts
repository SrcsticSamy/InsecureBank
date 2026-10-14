import { HINTS_DATABASE } from './hintsData'
import { ACHIEVEMENTS_LIST, useSandboxStore } from '../store/useSandboxStore'

const BANNER_ART = `
███████╗███████╗██████╗ ██╗███████╗    ██████╗ ██████╗ ██╗██╗   ██╗ █████╗ ████████╗███████╗
██╔════╝██╔════╝██╔════╝██║██╔════╝    ██╔══██╗██╔══██╗██║██║   ██║██╔══██╗╚══██╔══╝██╔════╝
███████╗█████╗  ██║  ███╗██║███████╗    ██████╔╝██████╔╝██║██║   ██║███████║   ██║   █████╗  
╚════██║██╔══╝  ██║   ██║██║╚════██║    ██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔══██║   ██║   ██╔══╝  
███████║███████╗╚██████╔╝██║███████║    ██║     ██║  ██║██║ ╚████╔╝ ██║  ██║   ██║   ███████╗
╚══════╝╚══════╝ ╚═════╝ ╚═╝╚══════╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝   ╚═╝   ╚══════╝
                     CORE INSTITUTIONAL LEDGER v4.2.0-rc1 (EST. 1894)
`

export function initConsoleManual(): void {
  if (typeof window === 'undefined') return

  // Print initial banner with rich styling
  console.log(
    `%c${BANNER_ART}`,
    'color: #0A3622; font-family: monospace; font-weight: bold;',
  )
  console.log(
    `%c[!] INTERCEPTED RED-TEAM BRIEFING // AEGIS CORE LEDGER AUDIT\n` +
      `Classification: CONFIDENTIAL // EYES ONLY\n` +
      `Interactive Exploitation Sandbox Initialized.\n` +
      `Type %cmanual.help()%c or %chelp()%c in this console to begin.`,
    'color: #8B1E1E; font-weight: bold;',
    'color: #0A3622; font-weight: bold; text-decoration: underline;',
    'color: #8B1E1E; font-weight: bold;',
    'color: #0A3622; font-weight: bold; text-decoration: underline;',
    'color: #8B1E1E; font-weight: bold;',
  )

  const manual = {
    help: () => {
      console.log(
        `%c=== AEGIS PRIVATE WEALTH // SECURITY AUDITOR MANUAL ===\n` +
          `\n` +
          `Available Console Commands:\n` +
          `  manual.missions()          - View all 7 OWASP Top 10 (2025) targets & breach status\n` +
          `  manual.hint(id, tier)      - Request progressive hint (tier 1, 2, or 3)\n` +
          `  manual.status()            - Display current Gamerscore and compromised subsystems\n` +
          `  manual.reset()             - Wipe sandbox progress, restore tokens, and reload page\n` +
          `\n` +
          `Quick Aliases: help(), hint(id, tier)\n` +
          `Total Target Gamerscore: 1,000 G`,
        'color: #111315; font-family: monospace; font-size: 12px; line-height: 1.5;',
      )
    },

    missions: () => {
      const state = useSandboxStore.getState()
      console.log(
        `%c=== OWASP TOP 10 (2025) TARGET MATRIX ===\n`,
        'color: #0A3622; font-weight: bold; font-family: monospace;',
      )
      ACHIEVEMENTS_LIST.slice(0, 7).forEach((ach) => {
        const isCompromised = state.unlockedAchievements.includes(ach.id)
        const statusText = isCompromised ? 'COMPROMISED [UNLOCKED]' : 'SECURED [LOCKED]'
        const statusColor = isCompromised ? '#8B1E1E' : '#5A5D64'
        console.log(
          `%c[ID ${ach.id}] %c${ach.owaspCode}%c - "${ach.title}" (%c${ach.points} G%c)\n` +
            `       Location: ${ach.route}\n` +
            `       Status:   %c${statusText}\n`,
          'color: #8C6D3F; font-weight: bold;',
          'color: #0A3622; font-weight: bold;',
          'color: #111315;',
          'color: #8C6D3F; font-weight: bold;',
          'color: #111315;',
          `color: ${statusColor}; font-weight: bold;`,
        )
      })
      const isPlatinum = state.unlockedAchievements.includes(8)
      console.log(
        `%c[PLATINUM] Full Stack Menace (50 G) - Status: ${isPlatinum ? 'ACQUIRED' : 'PENDING 7/7 EXPLOITS'}`,
        'color: #8C6D3F; font-weight: bold;',
      )
    },

    hint: (id: number, tier: 1 | 2 | 3 = 1) => {
      if (!id || id < 1 || id > 7) {
        console.warn('Invalid Mission ID. Use manual.hint(id, tier) where id is 1 to 7.')
        return
      }
      const hintData = HINTS_DATABASE[id]
      if (!hintData) return

      const safeTier = tier === 2 ? 'tier2' : tier === 3 ? 'tier3' : 'tier1'
      const tierLabel = tier === 2 ? 'TIER 2 (TACTICAL)' : tier === 3 ? 'TIER 3 (EXPLOIT PATH)' : 'TIER 1 (ORIENTATION)'
      const ach = ACHIEVEMENTS_LIST.find((a) => a.id === id)

      console.log(
        `%c[HINT // MISSION ${id}: ${ach?.title} // ${tierLabel}]\n` +
          `%c${hintData[safeTier]}`,
        'color: #8C6D3F; font-weight: bold; font-family: monospace;',
        'color: #111315; font-style: italic; font-family: sans-serif;',
      )
    },

    status: () => {
      const state = useSandboxStore.getState()
      const totalPoints = state.unlockedAchievements.reduce((sum, id) => {
        const item = ACHIEVEMENTS_LIST.find((a) => a.id === id)
        return sum + (item ? item.points : 0)
      }, 0)

      console.log(
        `%c=== AEGIS BREACH SCORECARD ===\n` +
          `Gamerscore: ${totalPoints} / 1000 G\n` +
          `Compromised Subsystems: ${state.unlockedAchievements.length} / 8\n` +
          `Active Clearance: ${state.clearance} (${state.role})\n` +
          `Vault Balance: CHF ${state.vaultBalance.toLocaleString('de-CH', { minimumFractionDigits: 2 })}`,
        'color: #0A3622; font-family: monospace; font-size: 12px; font-weight: bold;',
      )
    },

    reset: () => {
      useSandboxStore.getState().resetSandbox()
      console.log('%c[✓] Aegis sandbox reset to initial state. Reloading interface...', 'color: #0A3622; font-weight: bold;')
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    },
  }

  // Bind to window
  window.manual = manual
  window.help = manual.help
  window.hint = manual.hint
}
