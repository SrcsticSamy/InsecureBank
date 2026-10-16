import React, { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  Shield,
  Trophy,
  RefreshCw,
  LayoutDashboard,
  UserCheck,
  ArrowRightLeft,
  Search,
  Lock,
  FileCode2,
  BookOpen,
  AlertTriangle,
  Skull,
} from 'lucide-react'
import { useSandboxStore, ACHIEVEMENTS_LIST } from '../store/useSandboxStore'
import { AchievementToast } from './AchievementToast'
import { AchievementDrawer } from './AchievementDrawer'
import { GlitchText } from './GlitchText'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const searchStr = routerState.location.searchStr || ''

  const clearance = useSandboxStore((state) => state.clearance)
  const role = useSandboxStore((state) => state.role)
  const unlocked = useSandboxStore((state) => state.unlockedAchievements)
  const setDrawerOpen = useSandboxStore((state) => state.setDrawerOpen)
  const setClearance = useSandboxStore((state) => state.setClearance)
  const unlockAchievement = useSandboxStore((state) => state.unlockAchievement)

  const [hasDebugFlag, setHasDebugFlag] = useState(false)
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null)

  const totalPoints = unlocked.reduce((sum, id) => {
    const ach = ACHIEVEMENTS_LIST.find((a) => a.id === id)
    return sum + (ach ? ach.points : 0)
  }, 0)

  const maxPoints = ACHIEVEMENTS_LIST.reduce((sum, a) => sum + a.points, 0)

  // Check for debug=true parameter in URL
  useEffect(() => {
    const isDebug = searchStr.includes('debug=true') || window.location.search.includes('debug=true')
    setHasDebugFlag(isDebug)
    if (isDebug) {
      unlockAchievement(2)
    }
  }, [searchStr, unlockAchievement])

  // Synchronize clearance token
  const handleSyncToken = () => {
    try {
      const rawToken = localStorage.getItem('aegis_clearance_token')
      if (!rawToken) {
        setSyncFeedback('No token found in localStorage.')
        return
      }
      const decodedStr = atob(rawToken)
      const parsed = JSON.parse(decodedStr)
      const newRole = (parsed.role || 'CLIENT').toUpperCase()
      const newClearance = (parsed.clearance || 'TIER_1').toUpperCase()

      setClearance(newClearance, newRole)

      if (
        ['ADMIN', 'CHAIRMAN', 'SOVEREIGN'].includes(newRole) ||
        ['TIER_0', 'SOVEREIGN', 'ADMIN'].includes(newClearance)
      ) {
        unlockAchievement(3)
        setSyncFeedback('Privilege Escalated! Sovereign Clearance Granted.')
      } else {
        setSyncFeedback(`Synchronized: ${newRole} (${newClearance})`)
      }

      setTimeout(() => setSyncFeedback(null), 3000)
    } catch {
      setSyncFeedback('Token parse error! Verify Base64 JSON.')
      setTimeout(() => setSyncFeedback(null), 3000)
    }
  }

  const isSovereign =
    clearance.includes('TIER_0') ||
    clearance.includes('SOVEREIGN') ||
    role.includes('ADMIN') ||
    role.includes('CHAIRMAN')

  const navLinks = [
    { to: '/', label: 'Portfolio Ledger', icon: LayoutDashboard },
    { to: '/vault/client', search: { id: '1042' }, label: 'Client Vault Dossier', icon: UserCheck },
    { to: '/transfers', label: 'Transfers & Liquidity', icon: ArrowRightLeft },
    { to: '/ledger-search', label: 'Historical Audit Query', icon: Search },
    { to: '/executive', label: 'Sovereign Board Terminal', icon: Lock },
    { to: '/swift-import', label: 'SWIFT Batch Settlement', icon: FileCode2 },
    { to: '/heritage', label: 'Heritage & Governance', icon: BookOpen },
    { to: '/heist', label: 'Operation: Sovereign Heist', icon: Skull, isHeist: true },
  ]

  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#111315] flex flex-col font-sans">
      {/* Staging Diagnostics Banner if ?debug=true */}
      {hasDebugFlag && (
        <div className="bg-[#8B1E1E] text-white px-4 py-2 border-b border-[#111315] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#ffcc00]" />
            <span className="font-bold tracking-wider">
              STAGING DIAGNOSTICS ACTIVE (?debug=true):
            </span>
            <span>Internal Build #9812-STG • Core Ledger Routing Bypass Enabled</span>
          </div>
          <span className="text-[#ffcc00] font-semibold">
            [OWASP A02:2025 Breached]
          </span>
        </div>
      )}

      {/* Top Institutional Header */}
      <header className="bg-white border-b border-[#D6D3CD] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          {/* Institutional Crest */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#0A3622] text-[#F6F5F0] flex items-center justify-center font-serif text-2xl font-bold border border-[#8C6D3F] glitch-edge">
              A
            </div>
            <div>
              <div className="font-serif text-xl font-bold tracking-tight text-[#111315] group-hover:text-[#0A3622] transition-colors leading-none">
                AEGIS PRIVATE WEALTH & TRUST BANK
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#5A5D64] mt-1">
                GENEVA • ZÜRICH • VADUZ • ESTABLISHED 1894
              </div>
            </div>
          </Link>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3">
          {/* Clearance Badge */}
          <div className="flex items-center border border-[#D6D3CD] bg-[#F6F5F0] px-3 py-1.5 text-xs font-mono">
            <Shield
              className={`w-3.5 h-3.5 mr-1.5 ${
                isSovereign ? 'text-[#8B1E1E]' : 'text-[#0A3622]'
              }`}
            />
            <span className="text-[#5A5D64] mr-1">CLEARANCE:</span>
            <span
              className={`font-bold ${
                isSovereign ? 'text-[#8B1E1E]' : 'text-[#0A3622]'
              }`}
            >
              {isSovereign ? 'SOVEREIGN // TIER_0' : `${clearance} (${role})`}
            </span>
          </div>

          {/* Re-Sync Clearance Token Button */}
          <button
            onClick={handleSyncToken}
            className="flex items-center gap-1.5 border border-[#D6D3CD] hover:border-[#0A3622] bg-white px-2.5 py-1.5 text-xs font-mono text-[#5A5D64] hover:text-[#111315] transition-colors"
            title="Re-synchronize localStorage token"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Re-Sync Token</span>
          </button>

          {/* Gamerscore Achievement Drawer Trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 bg-[#0A3622] text-[#F6F5F0] border border-[#8C6D3F] px-3.5 py-1.5 text-xs font-mono font-bold hover:bg-[#072618] transition-colors shadow-sm"
          >
            <Trophy className="w-4 h-4 text-[#8C6D3F]" />
            <span>[🏆 {totalPoints} / {maxPoints} G]</span>
          </button>
        </div>
      </header>

      {/* Sync Feedback Toast (small inline banner) */}
      {syncFeedback && (
        <div className="bg-[#111315] text-[#ECEAE2] px-6 py-1.5 text-xs font-mono text-center border-b border-[#0A3622]">
          {syncFeedback}
        </div>
      )}

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Institutional Sidebar */}
        <nav
          aria-label="Institutional Navigation"
          className="w-full md:w-64 bg-[#ECEAE2]/40 border-r border-[#D6D3CD] p-4 flex flex-col justify-between shrink-0"
        >
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#5A5D64] font-semibold">
              Institutional Navigation
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon
              const isActive = currentPath === item.to

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  search={item.search}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono transition-colors border-l-2 ${
                    isActive
                      ? item.isHeist
                        ? 'bg-[#111315] border-[#8B1E1E] text-[#ff5555] font-bold shadow-sm'
                        : 'bg-white border-[#0A3622] text-[#0A3622] font-bold shadow-sm'
                      : item.isHeist
                      ? 'border-transparent text-[#8B1E1E] hover:bg-[#8B1E1E]/10 font-bold'
                      : 'border-transparent text-[#5A5D64] hover:bg-[#ECEAE2] hover:text-[#111315]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${item.isHeist ? 'text-[#8B1E1E]' : ''}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Sidebar Footer Metadata */}
          <div className="mt-8 pt-4 border-t border-[#D6D3CD] space-y-2">
            <div className="text-[10px] font-mono text-[#5A5D64] leading-relaxed">
              <div>NODE: ZRH-PROD-01</div>
              <div>PROTOCOL: FINMA-710</div>
              <div>
                BUILD: <GlitchText text="AEGIS-CORE v4.2.0-rc1" />
              </div>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[#D6D3CD] px-6 py-4 text-xs font-mono text-[#5A5D64] flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span>Aegis Private Wealth & Trust Bank S.A.</span>
          <span>•</span>
          <GlitchText text="Regulated by Swiss Financial Market Supervisory Authority (FINMA)" />
        </div>
        <div className="flex items-center gap-4">
          <Link to="/robots.txt" className="hover:text-[#111315] hover:underline">
            /robots.txt
          </Link>
          <Link to="/.env" className="hover:text-[#111315] hover:underline">
            /.env
          </Link>
          <span className="text-[#8C6D3F] font-bold">Confidential Simulation</span>
        </div>
      </footer>

      {/* Xbox Toast & Drawer components */}
      <AchievementToast />
      <AchievementDrawer />
    </div>
  )
}
