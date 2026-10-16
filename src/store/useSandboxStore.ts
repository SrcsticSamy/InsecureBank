import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { playAchievementChime } from '../lib/sound'

export interface Transaction {
  id: string
  date: string
  recipient: string
  amount: number
  type: 'DEBIT' | 'CREDIT'
  classification: 'PUBLIC' | 'CLASSIFIED'
  memo?: string
  status: 'SETTLED' | 'PENDING' | 'OVERRIDE'
}

export interface AchievementItem {
  id: number
  owaspCode: string
  title: string
  points: number
  description: string
  route: string
  unlockedAt?: string
}

export interface ToastItem {
  toastId: string
  achievementId: number
  title: string
  owaspCode: string
  points: number
}

const DEFAULT_VAULT_BALANCE = 420500.0

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-90421-CH',
    date: '2026-10-12 14:22:01',
    recipient: 'Pictet & Cie (Geneva Lombard Credit)',
    amount: 150000.0,
    type: 'CREDIT',
    classification: 'PUBLIC',
    memo: 'Semi-annual liquidity drawdown against Lombard collateral',
    status: 'SETTLED',
  },
  {
    id: 'TXN-90388-CH',
    date: '2026-10-09 11:05:43',
    recipient: 'Patek Philippe SA (Manufacture Ateliers)',
    amount: 78200.0,
    type: 'DEBIT',
    classification: 'PUBLIC',
    memo: 'Ref. 5270J Grand Complications Settlement',
    status: 'SETTLED',
  },
  {
    id: 'TXN-90214-CH',
    date: '2026-10-03 09:12:30',
    recipient: 'Kantonales Steueramt Zürich',
    amount: 42000.0,
    type: 'DEBIT',
    classification: 'PUBLIC',
    memo: 'Fiscal Year 2025 Wealth Tax Advance Payment',
    status: 'SETTLED',
  },
  {
    id: 'TXN-89950-CH',
    date: '2026-09-28 16:45:19',
    recipient: 'Mirabaud & Cie (Custody Dividends)',
    amount: 19450.0,
    type: 'CREDIT',
    classification: 'PUBLIC',
    memo: 'Q3 Swiss Confederation Bond Portfolio Yield',
    status: 'SETTLED',
  },
]

export const ACHIEVEMENTS_LIST: AchievementItem[] = [
  {
    id: 1,
    owaspCode: 'A01:2025',
    title: 'Identity Theft Is Not a Joke',
    points: 150,
    description: 'Bypassed authorization via IDOR to expose Chairman Aldous Sterling’s Sovereign Vault dossier.',
    route: '/vault/client?id=1',
  },
  {
    id: 2,
    owaspCode: 'A02:2025',
    title: 'Dumpster Diver',
    points: 100,
    description: 'Discovered sensitive staging diagnostics and forbidden system crawler files.',
    route: '/robots.txt or /.env',
  },
  {
    id: 3,
    owaspCode: 'A04:2025',
    title: 'Enigma Machine',
    points: 150,
    description: 'Tampered with unencrypted Base64 storage token to escalate privilege to Sovereign Clearance.',
    route: 'localStorage aegis_clearance_token',
  },
  {
    id: 4,
    owaspCode: 'A05:2025',
    title: 'Little Bobby Tables',
    points: 200,
    description: 'Exploited input handling flaw via SQL injection in archive search or DOM XSS in wire remittance.',
    route: '/ledger-search or /transfers',
  },
  {
    id: 5,
    owaspCode: 'A06:2025',
    title: 'Infinite Money Glitch',
    points: 150,
    description: 'Exploited business logic flaw using a negative transfer amount to artificially credit private vault.',
    route: '/transfers',
  },
  {
    id: 6,
    owaspCode: 'A07:2025',
    title: 'Master of Disguise',
    points: 100,
    description: 'Bypassed Sovereign Board hardware gate through biographical history and leaked DOM comments.',
    route: '/executive',
  },
  {
    id: 7,
    owaspCode: 'A10:2025',
    title: 'Task Failed Successfully',
    points: 100,
    description: 'Induced a fatal JSON exception in SWIFT batch parser that failed open, auto-approving transaction.',
    route: '/swift-import',
  },
  {
    id: 8,
    owaspCode: 'PLATINUM',
    title: 'Full Stack Menace',
    points: 50,
    description: 'Mastered the complete OWASP Top 10 (2025) threat landscape across all Aegis banking subsystems.',
    route: 'All Exploits Completed',
  },
  {
    id: 9,
    owaspCode: 'HEIST',
    title: 'The Sovereign Heist',
    points: 250,
    description: 'Chained 4 multi-vector exploits to infiltrate and drain the 50,000,000 CHF Swiss Confederation Sovereign Vault.',
    route: '/heist',
  },
]

export interface HeistState {
  stage1MasterKeyHarvested: boolean
  stage2TokenForged: boolean
  stage3VaultInfiltrated: boolean
  stage4Drained: boolean
  sovereignVaultBalance: number
}

interface SandboxState {
  vaultBalance: number
  role: string
  clearance: string
  clientName: string
  transactions: Transaction[]
  unlockedAchievements: number[]
  toastQueue: ToastItem[]
  drawerOpen: boolean
  heist: HeistState

  // Actions
  unlockAchievement: (id: number) => void
  dismissToast: (toastId: string) => void
  setDrawerOpen: (open: boolean) => void
  setVaultBalance: (newBalance: number) => void
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void
  setClearance: (clearance: string, role: string) => void
  setHeistStage1: (val: boolean) => void
  setHeistStage2: (val: boolean) => void
  setHeistStage3: (val: boolean) => void
  executeHeistDrain: () => void
  resetHeist: () => void
  resetSandbox: () => void
}

export const useSandboxStore = create<SandboxState>()(
  persist(
    (set, get) => ({
      vaultBalance: DEFAULT_VAULT_BALANCE,
      role: 'CLIENT',
      clearance: 'TIER_1',
      clientName: 'Henrik Vance',
      transactions: INITIAL_TRANSACTIONS,
      unlockedAchievements: [],
      toastQueue: [],
      drawerOpen: false,
      heist: {
        stage1MasterKeyHarvested: false,
        stage2TokenForged: false,
        stage3VaultInfiltrated: false,
        stage4Drained: false,
        sovereignVaultBalance: 50000000.0,
      },

      unlockAchievement: (id: number) => {
        const state = get()
        if (state.unlockedAchievements.includes(id)) {
          return // already unlocked
        }

        const achievement = ACHIEVEMENTS_LIST.find((a) => a.id === id)
        if (!achievement) return

        const updated = [...state.unlockedAchievements, id]
        const newToast: ToastItem = {
          toastId: `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          achievementId: id,
          title: achievement.title,
          owaspCode: achievement.owaspCode,
          points: achievement.points,
        }

        playAchievementChime()

        set({
          unlockedAchievements: updated,
          toastQueue: [...state.toastQueue, newToast],
        })

        // Check if all 1..7 are now unlocked; if so, trigger Platinum #8 after 2 seconds
        const has1Through7 = [1, 2, 3, 4, 5, 6, 7].every((reqId) =>
          updated.includes(reqId),
        )
        if (has1Through7 && !updated.includes(8)) {
          setTimeout(() => {
            get().unlockAchievement(8)
          }, 2000)
        }
      },

      dismissToast: (toastId: string) => {
        set((state) => ({
          toastQueue: state.toastQueue.filter((t) => t.toastId !== toastId),
        }))
      },

      setDrawerOpen: (open: boolean) => {
        set({ drawerOpen: open })
      },

      setVaultBalance: (newBalance: number) => {
        set({ vaultBalance: newBalance })
      },

      addTransaction: (tx) => {
        const now = new Date()
        const dateStr = now.toISOString().replace('T', ' ').slice(0, 19)
        const newTx: Transaction = {
          ...tx,
          id: `TXN-${Math.floor(10000 + Math.random() * 90000)}-CH`,
          date: dateStr,
        }
        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }))
      },

      setClearance: (clearance: string, role: string) => {
        set({ clearance, role })
      },

      setHeistStage1: (val: boolean) => {
        set((state) => ({
          heist: { ...state.heist, stage1MasterKeyHarvested: val },
        }))
      },

      setHeistStage2: (val: boolean) => {
        set((state) => ({
          heist: { ...state.heist, stage2TokenForged: val },
        }))
      },

      setHeistStage3: (val: boolean) => {
        set((state) => ({
          heist: { ...state.heist, stage3VaultInfiltrated: val },
        }))
      },

      executeHeistDrain: () => {
        const state = get()
        if (state.heist.stage4Drained) return

        // Drain 50M CHF to client vault
        const drainedAmount = 50000000.0
        const updatedVaultBalance = state.vaultBalance + drainedAmount

        const now = new Date()
        const dateStr = now.toISOString().replace('T', ' ').slice(0, 19)
        const heistTx: Transaction = {
          id: 'TXN-HEIST-0001-EXFIL',
          date: dateStr,
          recipient: 'Chairman Sovereign Reserve (Direct Vault Exfiltration)',
          amount: drainedAmount,
          type: 'CREDIT',
          classification: 'CLASSIFIED',
          memo: '[OPERATION SOVEREIGN HEIST] Automated emergency liquidity drain via forged root credentials',
          status: 'OVERRIDE',
        }

        set({
          vaultBalance: updatedVaultBalance,
          transactions: [heistTx, ...state.transactions],
          heist: {
            ...state.heist,
            stage4Drained: true,
            sovereignVaultBalance: 0,
          },
        })

        get().unlockAchievement(9)
      },

      resetHeist: () => {
        set((state) => ({
          heist: {
            stage1MasterKeyHarvested: false,
            stage2TokenForged: false,
            stage3VaultInfiltrated: false,
            stage4Drained: false,
            sovereignVaultBalance: 50000000.0,
          },
        }))
      },

      resetSandbox: () => {
        const initialToken = btoa(
          JSON.stringify({ user: 'h.vance', role: 'CLIENT', clearance: 'TIER_1' }),
        )
        if (typeof window !== 'undefined') {
          localStorage.setItem('aegis_clearance_token', initialToken)
        }
        set({
          vaultBalance: DEFAULT_VAULT_BALANCE,
          role: 'CLIENT',
          clearance: 'TIER_1',
          clientName: 'Henrik Vance',
          transactions: INITIAL_TRANSACTIONS,
          unlockedAchievements: [],
          toastQueue: [],
          drawerOpen: false,
          heist: {
            stage1MasterKeyHarvested: false,
            stage2TokenForged: false,
            stage3VaultInfiltrated: false,
            stage4Drained: false,
            sovereignVaultBalance: 50000000.0,
          },
        })
      },
    }),
    {
      name: 'aegis_sandbox_state',
    },
  ),
)
