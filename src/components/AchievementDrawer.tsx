import React, { useState } from 'react'
import { Trophy, X, ShieldAlert, CheckCircle2, Lock, ChevronDown, ChevronUp, Terminal, RotateCcw } from 'lucide-react'
import { ACHIEVEMENTS_LIST, useSandboxStore } from '../store/useSandboxStore'
import { HINTS_DATABASE, REMEDIATIONS } from '../lib/hintsData'

export const AchievementDrawer: React.FC = () => {
  const isOpen = useSandboxStore((state) => state.drawerOpen)
  const setDrawerOpen = useSandboxStore((state) => state.setDrawerOpen)
  const unlocked = useSandboxStore((state) => state.unlockedAchievements)
  const resetSandbox = useSandboxStore((state) => state.resetSandbox)

  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [activeHintTier, setActiveHintTier] = useState<Record<number, number>>({})

  const totalPoints = unlocked.reduce((sum, id) => {
    const ach = ACHIEVEMENTS_LIST.find((a) => a.id === id)
    return sum + (ach ? ach.points : 0)
  }, 0)

  if (!isOpen) return null

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const cycleHintTier = (id: number) => {
    setActiveHintTier((prev) => {
      const current = prev[id] || 0
      const next = current >= 3 ? 1 : current + 1
      if (typeof window !== 'undefined' && window.manual) {
        window.manual.hint(id, next as 1 | 2 | 3)
      }
      return { ...prev, [id]: next }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111315]/60 transition-opacity"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-[#F6F5F0] border-l-2 border-[#D6D3CD] h-full shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#D6D3CD] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A3622] flex items-center justify-center text-[#8C6D3F]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-bold tracking-tight text-[#111315]">
                  Security Dossier
                </h3>
                <span className="font-mono text-xs bg-[#0A3622] text-[#F6F5F0] px-2 py-0.5 border border-[#8C6D3F]">
                  {totalPoints} / 1000 G
                </span>
              </div>
              <p className="text-xs text-[#5A5D64] uppercase tracking-wider font-mono">
                OWASP Top 10 (2025) Compromise Scorecard
              </p>
            </div>
          </div>

          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 border border-[#D6D3CD] hover:bg-[#ECEAE2] transition-colors"
            title="Close Drawer"
            aria-label="Close Drawer"
          >
            <X className="w-5 h-5 text-[#111315]" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#ECEAE2] h-2">
          <div
            className="bg-[#0A3622] h-full transition-all duration-500"
            style={{ width: `${(totalPoints / 1000) * 100}%` }}
          />
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = unlocked.includes(ach.id)
            const isExpanded = expandedId === ach.id
            const currentTier = activeHintTier[ach.id] || 0
            const hints = HINTS_DATABASE[ach.id]
            const remediation = REMEDIATIONS[ach.id]

            return (
              <div
                key={ach.id}
                className={`border transition-colors ${
                  isUnlocked
                    ? 'border-[#0A3622] bg-white'
                    : 'border-[#D6D3CD] bg-[#ECEAE2]/40'
                }`}
              >
                {/* Header item */}
                <div
                  className="p-4 flex items-start justify-between cursor-pointer select-none"
                  onClick={() => toggleExpand(ach.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isUnlocked ? (
                        <CheckCircle2 className="w-5 h-5 text-[#0A3622]" />
                      ) : (
                        <Lock className="w-5 h-5 text-[#5A5D64]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#8C6D3F]">
                          {ach.owaspCode}
                        </span>
                        <span className="font-mono text-[11px] bg-[#111315] text-white px-1.5 py-0.2">
                          {ach.points} G
                        </span>
                        {isUnlocked && (
                          <span className="text-[10px] font-mono uppercase bg-[#0A3622] text-[#F6F5F0] px-1">
                            COMPROMISED
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#111315] mt-0.5">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-[#5A5D64] mt-0.5 font-sans">
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#5A5D64]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#5A5D64]" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-[#D6D3CD] bg-white space-y-4">
                    {/* If unlocked: Show Post-Exploit Remediation Debrief */}
                    {isUnlocked && remediation && (
                      <div className="space-y-3">
                        <div className="p-3 bg-[#E6ECE8] border-l-2 border-[#0A3622]">
                          <div className="flex items-center gap-2 text-[#0A3622] font-semibold text-xs font-mono uppercase">
                            <ShieldAlert className="w-4 h-4" />
                            Post-Exploit Remediation Analysis
                          </div>
                          <p className="text-xs text-[#111315] mt-1.5 leading-relaxed">
                            {remediation.mechanismExplanation}
                          </p>
                        </div>

                        <div>
                          <span className="text-[11px] font-mono font-bold text-[#5A5D64] uppercase">
                            Secure Production Code Pattern:
                          </span>
                          <pre className="mt-1 p-3 bg-[#111315] text-[#ECEAE2] font-mono text-[11px] leading-relaxed overflow-x-auto border border-[#D6D3CD]">
                            {remediation.remediationCode}
                          </pre>
                        </div>

                        <p className="text-xs italic text-[#5A5D64] border-t border-[#ECEAE2] pt-2">
                          {remediation.remediationSummary}
                        </p>
                      </div>
                    )}

                    {/* If locked: Progressive Hints Console runner */}
                    {!isUnlocked && hints && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase text-[#8C6D3F] font-bold">
                            Interactive Red-Team Hint System
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              cycleHintTier(ach.id)
                            }}
                            className="flex items-center gap-1.5 text-xs font-mono bg-[#0A3622] text-[#F6F5F0] px-2.5 py-1 hover:bg-[#072618] transition-colors"
                          >
                            <Terminal className="w-3.5 h-3.5" />
                            {currentTier === 0
                              ? 'Request Hint (Tier 1)'
                              : currentTier === 1
                              ? 'Escalate Hint (Tier 2)'
                              : currentTier === 2
                              ? 'Full Exploit Path (Tier 3)'
                              : 'Re-read Hint (Tier 1)'}
                          </button>
                        </div>

                        {currentTier > 0 && (
                          <div className="p-3 bg-[#ECEAE2] border border-[#D6D3CD] space-y-2">
                            {currentTier >= 1 && (
                              <div>
                                <span className="text-[10px] font-mono uppercase text-[#5A5D64] font-bold">
                                  Tier 1 (Orientation):
                                </span>
                                <p className="text-xs text-[#111315] italic mt-0.5">
                                  "{hints.tier1}"
                                </p>
                              </div>
                            )}
                            {currentTier >= 2 && (
                              <div className="border-t border-[#D6D3CD] pt-2">
                                <span className="text-[10px] font-mono uppercase text-[#8C6D3F] font-bold">
                                  Tier 2 (Tactical Direction):
                                </span>
                                <p className="text-xs text-[#111315] italic mt-0.5">
                                  "{hints.tier2}"
                                </p>
                              </div>
                            )}
                            {currentTier >= 3 && (
                              <div className="border-t border-[#D6D3CD] pt-2">
                                <span className="text-[10px] font-mono uppercase text-[#8B1E1E] font-bold">
                                  Tier 3 (Exploit Specifics):
                                </span>
                                <p className="text-xs text-[#111315] italic mt-0.5">
                                  "{hints.tier3}"
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-[11px] font-mono text-[#5A5D64]">
                          Tip: You can also run <code className="text-[#0A3622] font-bold">manual.hint({ach.id}, 1)</code> in DevTools console (F12).
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#D6D3CD] flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Reset all achievements and sandbox state back to defaults?')) {
                resetSandbox()
              }
            }}
            className="flex items-center gap-1.5 text-xs font-mono text-[#8B1E1E] hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Sandbox State
          </button>
          <span className="text-xs font-mono text-[#5A5D64]">
            Aegis Core Security Audit Matrix
          </span>
        </div>
      </div>
    </div>
  )
}
