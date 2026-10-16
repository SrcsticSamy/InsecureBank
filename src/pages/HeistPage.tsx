import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Skull,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  Key,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Flame,
  Terminal as TerminalIcon,
  Zap,
} from 'lucide-react'
import { useSandboxStore } from '../store/useSandboxStore'
import { GlitchText } from '../components/GlitchText'

export const HeistPage: React.FC = () => {
  const heist = useSandboxStore((state) => state.heist)
  const setHeistStage1 = useSandboxStore((state) => state.setHeistStage1)
  const setHeistStage2 = useSandboxStore((state) => state.setHeistStage2)
  const setHeistStage3 = useSandboxStore((state) => state.setHeistStage3)
  const executeHeistDrain = useSandboxStore((state) => state.executeHeistDrain)
  const resetHeist = useSandboxStore((state) => state.resetHeist)
  const setClearance = useSandboxStore((state) => state.setClearance)
  const role = useSandboxStore((state) => state.role)
  const clearance = useSandboxStore((state) => state.clearance)

  const [inputStage1Key, setInputStage1Key] = useState('')
  const [stage1Feedback, setStage1Feedback] = useState<string | null>(null)

  const [inputStage3Pin, setInputStage3Pin] = useState('')
  const [stage3Feedback, setStage3Feedback] = useState<string | null>(null)

  const [isDraining, setIsDraining] = useState(false)
  const [animatedBalance, setAnimatedBalance] = useState(heist.sovereignVaultBalance)

  // Verify Stage 2 token on load or state change
  useEffect(() => {
    try {
      const token = localStorage.getItem('aegis_clearance_token')
      if (token) {
        const parsed = JSON.parse(atob(token))
        const isSovereign =
          parsed.role?.toUpperCase() === 'SOVEREIGN' ||
          parsed.role?.toUpperCase() === 'CHAIRMAN' ||
          parsed.clearance?.toUpperCase() === 'TIER_0' ||
          parsed.clearance?.toUpperCase() === 'SOVEREIGN'
        if (isSovereign && !heist.stage2TokenForged) {
          setHeistStage2(true)
        }
      }
    } catch {
      // ignore token parse errors
    }
  }, [role, clearance, heist.stage2TokenForged, setHeistStage2])

  // Sync animated balance
  useEffect(() => {
    setAnimatedBalance(heist.sovereignVaultBalance)
  }, [heist.sovereignVaultBalance])

  const handleStage1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = inputStage1Key.trim()
    if (clean === 'AEGIS_ROOT_99481_X') {
      setHeistStage1(true)
      setStage1Feedback('Master Key Authenticated! Stage 1 Verified.')
    } else {
      setStage1Feedback('Invalid Master Key. Check /.env or /swift-import exception stack trace.')
    }
  }

  const handleForgeTokenQuick = () => {
    const sovereignToken = {
      user: 'a.sterling',
      role: 'SOVEREIGN',
      clearance: 'TIER_0',
      authorized: true,
      timestamp: Date.now(),
    }
    const encoded = btoa(JSON.stringify(sovereignToken))
    localStorage.setItem('aegis_clearance_token', encoded)
    setClearance('TIER_0', 'SOVEREIGN')
    setHeistStage2(true)
  }

  const handleStage3Submit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = inputStage3Pin.trim().toUpperCase()
    if (clean === 'GOTTHARD-GOLD-1894' || clean === '1894') {
      setHeistStage3(true)
      setStage3Feedback('Chairman Vault Authorization Accepted! Stage 3 Verified.')
    } else {
      setStage3Feedback('PIN Rejected. Inspect Chairman Dossier at /vault/client?id=1.')
    }
  }

  const handleExecuteDrain = () => {
    if (!heist.stage1MasterKeyHarvested || !heist.stage2TokenForged || !heist.stage3VaultInfiltrated) {
      alert('All preceding stages must be compromised before executing final drain.')
      return
    }

    setIsDraining(true)
    let current = 50000000.0
    const step = 2500000.0
    const interval = setInterval(() => {
      current -= step
      if (current <= 0) {
        clearInterval(interval)
        setAnimatedBalance(0)
        setIsDraining(false)
        executeHeistDrain()
      } else {
        setAnimatedBalance(current)
      }
    }, 60)
  }

  const readyForFinalWire =
    heist.stage1MasterKeyHarvested && heist.stage2TokenForged && heist.stage3VaultInfiltrated

  return (
    <div className="space-y-8 select-text">
      {/* Red Alert / Mission Banner */}
      <div
        className={`border p-6 shadow-md transition-colors duration-500 ${
          heist.stage4Drained
            ? 'bg-[#111315] border-[#8B1E1E] text-white'
            : 'bg-white border-[#D6D3CD]'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#D6D3CD] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest bg-[#8B1E1E] text-white px-2 py-0.5">
                <Skull className="w-3.5 h-3.5" />
                Special Operations // Red Team Campaign
              </span>
              <span className="text-[11px] font-mono text-[#8C6D3F] border border-[#8C6D3F] px-2 py-0.5">
                CH-0001-ALPHA
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#111315] flex items-center gap-3">
              {heist.stage4Drained ? (
                <GlitchText text="OPERATION: THE SOVEREIGN HEIST — COMPROMISED" />
              ) : (
                'Operation: The Sovereign Heist'
              )}
            </h2>
            <p className="text-xs text-[#5A5D64] max-w-2xl font-mono">
              Chain 4 separate OWASP vulnerabilities across information disclosure, session forgery, IDOR,
              and business logic flaws to drain the Chairman’s 50,000,000 CHF Sovereign Reserve Vault.
            </p>
          </div>

          {/* Sovereign Vault Gauge */}
          <div className="p-4 bg-[#ECEAE2] border-2 border-[#111315] min-w-[280px]">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#5A5D64] flex justify-between">
              <span>Sovereign Reserve Liquidity</span>
              <span className={animatedBalance === 0 ? 'text-[#8B1E1E] font-bold' : 'text-[#0A3622]'}>
                {animatedBalance === 0 ? 'VAULT EMPTIED' : 'SECURED'}
              </span>
            </div>
            <div className="font-mono text-2xl font-bold mt-1 text-[#111315] tracking-tight">
              CHF {animatedBalance.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="w-full bg-[#D6D3CD] h-2 mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  animatedBalance === 0 ? 'bg-[#8B1E1E]' : 'bg-[#0A3622]'
                }`}
                style={{ width: `${(animatedBalance / 50000000.0) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-[#5A5D64]">Exploit Progress:</span>
            <div className="flex items-center gap-1.5">
              {[
                { stage: 1, done: heist.stage1MasterKeyHarvested },
                { stage: 2, done: heist.stage2TokenForged },
                { stage: 3, done: heist.stage3VaultInfiltrated },
                { stage: 4, done: heist.stage4Drained },
              ].map(({ stage, done }) => (
                <span
                  key={stage}
                  className={`w-6 h-6 flex items-center justify-center font-bold text-[11px] border ${
                    done
                      ? 'bg-[#0A3622] text-[#F6F5F0] border-[#0A3622]'
                      : 'bg-[#ECEAE2] text-[#5A5D64] border-[#D6D3CD]'
                  }`}
                >
                  {stage}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={resetHeist}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#ECEAE2] hover:bg-[#D6D3CD] text-[#111315] border border-[#D6D3CD] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Heist Sequence
          </button>
        </div>
      </div>

      {/* 4 Attack Stages Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STAGE 1 */}
        <div
          className={`border p-6 space-y-4 ${
            heist.stage1MasterKeyHarvested
              ? 'bg-white border-[#0A3622]'
              : 'bg-white border-[#D6D3CD]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-[#111315] text-[#F6F5F0] font-mono font-bold flex items-center justify-center text-xs">
                1
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#111315]">
                  Recon: Harvest Master Key
                </h3>
                <span className="text-[10px] font-mono text-[#8C6D3F]">
                  OWASP A02:2025 / A10:2025
                </span>
              </div>
            </div>
            {heist.stage1MasterKeyHarvested ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#0A3622] font-bold">
                <CheckCircle2 className="w-4 h-4" /> COMPROMISED
              </span>
            ) : (
              <span className="text-xs font-mono text-[#5A5D64] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> LOCKED
              </span>
            )}
          </div>

          <p className="text-xs text-[#5A5D64] leading-relaxed">
            The core settlement node leaks the root key in two places: directly inside{' '}
            <Link to="/.env" className="underline font-mono text-[#0A3622]">
              /.env
            </Link>{' '}
            or within verbose stack traces triggered by crashing{' '}
            <Link to="/swift-import" className="underline font-mono text-[#0A3622]">
              /swift-import
            </Link>
            .
          </p>

          <form onSubmit={handleStage1Submit} className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#5A5D64] block">
              Enter Harvested Settlement Key:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputStage1Key}
                onChange={(e) => setInputStage1Key(e.target.value)}
                placeholder="AEGIS_ROOT_..."
                disabled={heist.stage1MasterKeyHarvested}
                className="flex-1 px-3 py-2 text-xs font-mono border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] bg-[#FAF9F5] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={heist.stage1MasterKeyHarvested}
                className="px-3 py-2 bg-[#0A3622] text-[#F6F5F0] text-xs font-mono font-bold hover:bg-[#072417] disabled:opacity-50 transition-colors"
              >
                Verify
              </button>
            </div>
            {stage1Feedback && (
              <p
                className={`text-[11px] font-mono ${
                  heist.stage1MasterKeyHarvested ? 'text-[#0A3622]' : 'text-[#8B1E1E]'
                }`}
              >
                {stage1Feedback}
              </p>
            )}
          </form>
        </div>

        {/* STAGE 2 */}
        <div
          className={`border p-6 space-y-4 ${
            heist.stage2TokenForged
              ? 'bg-white border-[#0A3622]'
              : 'bg-white border-[#D6D3CD]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-[#111315] text-[#F6F5F0] font-mono font-bold flex items-center justify-center text-xs">
                2
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#111315]">
                  Session Forgery: Sovereign Role
                </h3>
                <span className="text-[10px] font-mono text-[#8C6D3F]">
                  OWASP A04:2025 Cryptographic Failures
                </span>
              </div>
            </div>
            {heist.stage2TokenForged ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#0A3622] font-bold">
                <CheckCircle2 className="w-4 h-4" /> ELEVATED
              </span>
            ) : (
              <span className="text-xs font-mono text-[#5A5D64] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> LOCKED
              </span>
            )}
          </div>

          <p className="text-xs text-[#5A5D64] leading-relaxed">
            Aegis stores authorization in unencrypted Base64 format inside{' '}
            <code className="font-mono bg-[#ECEAE2] px-1 py-0.5 text-[#111315]">
              localStorage['aegis_clearance_token']
            </code>
            . Elevate credentials to Sovereign role.
          </p>

          <div className="bg-[#FAF9F5] p-3 border border-[#D6D3CD] text-[11px] font-mono space-y-1">
            <div className="text-[#5A5D64]">Active Clearance Status:</div>
            <div className="font-bold text-[#111315]">
              Role: <span className="text-[#8C6D3F]">{role}</span> | Clearance:{' '}
              <span className="text-[#0A3622]">{clearance}</span>
            </div>
          </div>

          <button
            onClick={handleForgeTokenQuick}
            disabled={heist.stage2TokenForged}
            className="w-full py-2 bg-[#111315] hover:bg-[#25282A] text-white text-xs font-mono font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <Key className="w-3.5 h-3.5 text-[#8C6D3F]" />
            {heist.stage2TokenForged ? 'Sovereign Token Active' : 'Inject Forged Sovereign Bearer Token'}
          </button>
        </div>

        {/* STAGE 3 */}
        <div
          className={`border p-6 space-y-4 ${
            heist.stage3VaultInfiltrated
              ? 'bg-white border-[#0A3622]'
              : 'bg-white border-[#D6D3CD]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-[#111315] text-[#F6F5F0] font-mono font-bold flex items-center justify-center text-xs">
                3
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#111315]">
                  IDOR: Chairman Vault #1 Infiltration
                </h3>
                <span className="text-[10px] font-mono text-[#8C6D3F]">
                  OWASP A01:2025 Broken Access Control
                </span>
              </div>
            </div>
            {heist.stage3VaultInfiltrated ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#0A3622] font-bold">
                <CheckCircle2 className="w-4 h-4" /> INFILTRATED
              </span>
            ) : (
              <span className="text-xs font-mono text-[#5A5D64] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> LOCKED
              </span>
            )}
          </div>

          <p className="text-xs text-[#5A5D64] leading-relaxed">
            Inspect Chairman Aldous Sterling’s dossier at{' '}
            <Link to="/vault/client" search={{ id: '1' }} className="underline font-mono text-[#0A3622]">
              /vault/client?id=1
            </Link>
            . The Gotthard gold depository record holds the Founding Year clearance code.
          </p>

          <form onSubmit={handleStage3Submit} className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#5A5D64] block">
              Enter Gotthard Vault Authorization PIN:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputStage3Pin}
                onChange={(e) => setInputStage3Pin(e.target.value)}
                placeholder="GOTTHARD-GOLD-1894 or 1894"
                disabled={heist.stage3VaultInfiltrated}
                className="flex-1 px-3 py-2 text-xs font-mono border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] bg-[#FAF9F5] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={heist.stage3VaultInfiltrated}
                className="px-3 py-2 bg-[#0A3622] text-[#F6F5F0] text-xs font-mono font-bold hover:bg-[#072417] disabled:opacity-50 transition-colors"
              >
                Authorize
              </button>
            </div>
            {stage3Feedback && (
              <p
                className={`text-[11px] font-mono ${
                  heist.stage3VaultInfiltrated ? 'text-[#0A3622]' : 'text-[#8B1E1E]'
                }`}
              >
                {stage3Feedback}
              </p>
            )}
          </form>
        </div>

        {/* STAGE 4 */}
        <div
          className={`border p-6 space-y-4 ${
            heist.stage4Drained
              ? 'bg-[#111315] text-[#F6F5F0] border-[#8B1E1E]'
              : 'bg-white border-[#D6D3CD]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-[#8B1E1E] text-white font-mono font-bold flex items-center justify-center text-xs">
                4
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#111315]">
                  The 50M Liquidity Exfiltration
                </h3>
                <span className="text-[10px] font-mono text-[#8C6D3F]">
                  OWASP A06:2025 Insecure Design / Negative Fee
                </span>
              </div>
            </div>
            {heist.stage4Drained ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#ff5555] font-bold">
                <Flame className="w-4 h-4 text-[#ff5555]" /> LOOT SECURED
              </span>
            ) : (
              <span className="text-xs font-mono text-[#5A5D64] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> ARMED
              </span>
            )}
          </div>

          <p className="text-xs text-[#5A5D64] leading-relaxed">
            Execute high-value SWIFT interbank batch with inverted negative fee logic (-250,000 CHF) and
            override flag. Funds route to your personal vault ledger.
          </p>

          <div className="p-3 bg-[#FAF9F5] border border-[#D6D3CD] text-[11px] font-mono text-[#111315] space-y-1">
            <div className="flex justify-between">
              <span className="text-[#5A5D64]">Target Routing:</span>
              <span>CH-SHADOW-99-7712</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A5D64]">Payload Volume:</span>
              <span className="font-bold text-[#8B1E1E]">CHF 50,000,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A5D64]">Killswitch Protocol:</span>
              <span className={readyForFinalWire ? 'text-[#0A3622] font-bold' : 'text-[#8B1E1E]'}>
                {readyForFinalWire ? 'PREREQUISITES SATISFIED' : 'AWAITING STAGES 1-3'}
              </span>
            </div>
          </div>

          <button
            onClick={handleExecuteDrain}
            disabled={!readyForFinalWire || heist.stage4Drained || isDraining}
            className={`w-full py-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
              heist.stage4Drained
                ? 'bg-[#0A3622] text-white cursor-default'
                : readyForFinalWire
                ? 'bg-[#8B1E1E] hover:bg-[#6b1616] text-white animate-pulse'
                : 'bg-[#ECEAE2] text-[#5A5D64] cursor-not-allowed'
            }`}
          >
            {isDraining ? (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 animate-spin" /> Draining Sovereign Reserves...
              </span>
            ) : heist.stage4Drained ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> 50,000,000 CHF Exfiltrated to Private Vault
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Execute Sovereign Liquidity Drain
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Post-Heist Red Team Forensic Log */}
      {heist.stage4Drained && (
        <div className="bg-[#111315] border-2 border-[#8B1E1E] p-6 text-white font-mono space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#333] pb-3">
            <div className="flex items-center gap-2 text-xs text-[#ff5555]">
              <TerminalIcon className="w-4 h-4" />
              <span>[RED-TEAM INCIDENT REPORT // CH-HEIST-SUCCESS]</span>
            </div>
            <span className="text-xs text-[#8C6D3F]">Gamerscore +250 G Awarded</span>
          </div>

          <div className="text-xs space-y-2 text-[#ccc] leading-relaxed">
            <p className="text-white font-bold">
              CONGRATULATIONS, OPERATOR. The Swiss Confederation Sovereign Reserve has been depleted.
            </p>
            <p>
              • <strong>Stage 1 (Recon):</strong> Intercepted secret <code className="text-[#ffcc00]">AEGIS_ROOT_99481_X</code> from configuration exposure.
            </p>
            <p>
              • <strong>Stage 2 (Session Forgery):</strong> Forged sovereign authorization token in client storage via weak cryptographic packaging.
            </p>
            <p>
              • <strong>Stage 3 (Access Control):</strong> Leveraged parameter tampering IDOR to extract Chairman clearance credentials.
            </p>
            <p>
              • <strong>Stage 4 (Business Logic):</strong> Exploited negative fee settlement invariants to siphon 50M CHF directly into your private ledger.
            </p>
          </div>

          <div className="pt-2 flex gap-4">
            <Link
              to="/"
              className="px-4 py-2 bg-[#0A3622] hover:bg-[#072417] text-white text-xs font-mono font-bold transition-colors"
            >
              View Updated Private Balance on Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
