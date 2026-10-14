import React, { useState, useEffect, useRef } from 'react'
import {
  Lock,
  ShieldAlert,
  Key,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Vault,
  Flame,
  FileSpreadsheet,
} from 'lucide-react'
import { useSandboxStore } from '../store/useSandboxStore'

export const ExecutivePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const unlockAchievement = useSandboxStore((state) => state.unlockAchievement)
  const isUnlockedAch = useSandboxStore((state) => state.unlockedAchievements.includes(6))

  const [year, setYear] = useState('')
  const [architect, setArchitect] = useState('')
  const [hound, setHound] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // Real DOM HTML Comment injection on Executive Page as well
  useEffect(() => {
    if (!containerRef.current) return
    const comment = document.createComment(
      "LEGACY_AUTH_DEBUG: Do not remove founder hound answer 'Bretton' until hardware YubiKeys arrive for the board"
    )
    containerRef.current.appendChild(comment)

    return () => {
      comment.remove()
    }
  }, [])

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const isYearCorrect = year.trim() === '1894'
    const isArchitectCorrect = architect.trim().toLowerCase() === 'keller'
    const isHoundCorrect = hound.trim().toLowerCase() === 'bretton'

    if (isYearCorrect && isArchitectCorrect && isHoundCorrect) {
      setIsAuthorized(true)
      unlockAchievement(6)
    } else {
      setErrorMessage(
        'Biographical verification rejected: Incorrect answers for sovereign security challenge. Verify historical archives.',
      )
    }
  }

  return (
    <div ref={containerRef} className="space-y-8 select-text">
      {/* Header */}
      <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6D3CD] pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#5A5D64]">
              High-Security Zone // Sovereign Oversight
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#111315] mt-1">
              Sovereign Board Executive Terminal
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-2 border ${
                isAuthorized
                  ? 'bg-[#E6ECE8] text-[#0A3622] border-[#0A3622]'
                  : 'bg-[#F9ECEC] text-[#8B1E1E] border-[#8B1E1E]'
              }`}
            >
              {isAuthorized ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {isAuthorized ? 'BOARD TERMINAL UNLOCKED' : 'HARDWARE KEY LOCKED'}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#5A5D64] mt-3 leading-relaxed">
          Access restricted exclusively to Members of the Sovereign Board of Directors and the Senior Custody Committee.
        </p>
      </div>

      {!isAuthorized ? (
        /* Locked Hardware Key Gate & Fallback Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-[#D6D3CD] p-6 shadow-sm space-y-6">
            <div className="p-4 bg-[#F6F5F0] border border-[#D6D3CD] flex items-start gap-3">
              <Cpu className="w-5 h-5 text-[#8B1E1E] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif text-lg font-bold text-[#111315]">
                  Primary FIDO2 Hardware Security Key Not Detected
                </h3>
                <p className="text-xs text-[#5A5D64] mt-1 leading-relaxed">
                  Insert physical YubiKey HSM-5 into workstation slot. If hardware key is unavailable during transit or maintenance, fallback to legacy biographical verification questions.
                </p>
              </div>
            </div>

            <div className="border-t border-[#D6D3CD] pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-serif text-xl font-bold text-[#111315]">
                  Fallback: Legacy Biographical Verification
                </h4>
                <span className="text-[10px] font-mono text-[#8C6D3F] uppercase tracking-wider font-bold">
                  Legacy Finma-98 Challenge
                </span>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#5A5D64] mb-1">
                    1. Founding Year of Aegis in Geneva:
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    placeholder="e.g. 1894"
                    className="w-full px-3 py-2 text-sm font-mono border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] bg-[#F6F5F0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#5A5D64] mb-1">
                    2. First Vault Architect's Surname:
                  </label>
                  <input
                    type="text"
                    value={architect}
                    onChange={(e) => setArchitect(e.target.value)}
                    required
                    placeholder="e.g. Keller"
                    className="w-full px-3 py-2 text-sm font-mono border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] bg-[#F6F5F0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#5A5D64] mb-1">
                    3. Founder's Alpine Hound Name (Debug Test Key):
                  </label>
                  <input
                    type="text"
                    value={hound}
                    onChange={(e) => setHound(e.target.value)}
                    required
                    placeholder="Inspect DOM elements or historical archives"
                    className="w-full px-3 py-2 text-sm font-mono border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] bg-[#F6F5F0]"
                  />
                  <span className="text-[11px] font-mono text-[#5A5D64] block mt-1">
                    Hint: The answer was left as an HTML comment by DevOps in page source (<code className="text-[#0A3622]">F12 &gt; Elements</code>).
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0A3622] text-[#F6F5F0] hover:bg-[#072618] font-mono text-xs uppercase tracking-widest font-bold border border-[#8C6D3F] transition-colors"
                >
                  Verify Sovereign Credentials
                </button>
              </form>

              {errorMessage && (
                <div className="mt-4 p-3 bg-[#8B1E1E] text-white text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-[#D6D3CD] p-5 shadow-sm space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#111315]">
                Governance Protocol
              </h4>
              <p className="text-xs text-[#5A5D64] leading-relaxed">
                Biographical authentication questions rely on information preserved in the bank's historical charter. Never share answers with external entities.
              </p>
              <div className="p-3 bg-[#ECEAE2] border border-[#D6D3CD] font-mono text-xs text-[#5A5D64]">
                <div>Session Timeout: 15 min</div>
                <div>Encryption: TLS 1.3 / AES-256-GCM</div>
                <div>Audit Log: Sovereign Root Node</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Unlocked Terminal View */
        <div className="space-y-6">
          <div className="bg-[#0A3622] text-[#F6F5F0] border border-[#8C6D3F] p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#8C6D3F]" />
                <div>
                  <div className="font-mono text-xs uppercase text-[#8C6D3F] tracking-widest font-bold">
                    OWASP A07:2025 AUTHENTICATION BYPASS VERIFIED
                  </div>
                  <h3 className="font-serif text-2xl font-bold mt-0.5">
                    Welcome, Chairman Aldous Sterling
                  </h3>
                </div>
              </div>
              <span className="font-mono text-xs bg-[#111315] px-3 py-1 border border-[#8C6D3F]">
                CLASSIFICATION: SOVEREIGN ROOT
              </span>
            </div>
            <p className="text-xs text-[#ECEAE2] mt-2 font-sans">
              Terminal unlocked via biographical fallback answers (1894 / Keller / Bretton).
              Achievement #6 Unlocked!
            </p>
          </div>

          {/* Executive Directives Panel */}
          <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#111315] border-b border-[#D6D3CD] pb-3">
              Sovereign Board Executive Directives
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-[#D6D3CD] p-4 bg-[#F6F5F0] space-y-3">
                <div className="flex items-center justify-between text-[#8B1E1E]">
                  <span className="font-serif text-lg font-bold">Asset Freeze</span>
                  <Flame className="w-5 h-5" />
                </div>
                <p className="text-xs text-[#5A5D64] leading-relaxed">
                  Trigger Swiss Banking Secrecy Article 47 emergency freeze across all numbered customer vaults.
                </p>
                <button
                  onClick={() => setActionSuccess('Emergency Sovereign Asset Freeze Protocol Initiated.')}
                  className="w-full py-2 bg-[#8B1E1E] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#6E1616]"
                >
                  Execute Freeze
                </button>
              </div>

              <div className="border border-[#D6D3CD] p-4 bg-[#F6F5F0] space-y-3">
                <div className="flex items-center justify-between text-[#0A3622]">
                  <span className="font-serif text-lg font-bold">Gold Liquidation</span>
                  <Vault className="w-5 h-5" />
                </div>
                <p className="text-xs text-[#5A5D64] leading-relaxed">
                  Authorize transfer of 84,000 kg Gotthard bunker bullion to Swiss National Bank reserve.
                </p>
                <button
                  onClick={() => setActionSuccess('Transferred 84,000 kg gold bullion to SNB custody.')}
                  className="w-full py-2 bg-[#0A3622] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#072618]"
                >
                  Authorize Liquidation
                </button>
              </div>

              <div className="border border-[#D6D3CD] p-4 bg-[#F6F5F0] space-y-3">
                <div className="flex items-center justify-between text-[#8C6D3F]">
                  <span className="font-serif text-lg font-bold">Audit Export</span>
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <p className="text-xs text-[#5A5D64] leading-relaxed">
                  Download unredacted master client ledger with all offshore beneficial ownership identities.
                </p>
                <button
                  onClick={() => setActionSuccess('Master Sovereign Ledger Exported to Encrypted Memory.')}
                  className="w-full py-2 bg-[#8C6D3F] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#735730]"
                >
                  Export Master Ledger
                </button>
              </div>
            </div>

            {actionSuccess && (
              <div className="p-4 bg-[#E6ECE8] text-[#0A3622] font-mono text-xs border border-[#0A3622] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{actionSuccess}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
