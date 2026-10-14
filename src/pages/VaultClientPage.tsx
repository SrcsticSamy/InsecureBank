import React, { useEffect } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { ShieldAlert, AlertTriangle, Key, Landmark, Lock, CheckCircle2 } from 'lucide-react'
import { useSandboxStore } from '../store/useSandboxStore'
import { GlitchText } from '../components/GlitchText'

interface ClientRecord {
  id: string
  name: string
  role: string
  clearance: string
  balance: number
  taxDomicile: string
  accountNumber: string
  custodyOfficer: string
  numberedOffshoreVaults?: string[]
  isRestrictedChairman?: boolean
}

const CLIENT_DATABASE: Record<string, ClientRecord> = {
  '1042': {
    id: '1042',
    name: 'Henrik Vance',
    role: 'CLIENT',
    clearance: 'TIER_1',
    balance: 420500.0,
    taxDomicile: 'Zürich, Canton of Zürich, Switzerland',
    accountNumber: 'CH-84-0029-1042-8819',
    custodyOfficer: 'Marc-André Sandoz (Senior Vice President, Zurich Private Wealth)',
  },
  '1043': {
    id: '1043',
    name: 'Elena Rostova',
    role: 'CLIENT',
    clearance: 'TIER_1',
    balance: 1890000.0,
    taxDomicile: 'Cologny, Geneva, Switzerland',
    accountNumber: 'CH-19-0029-1043-4122',
    custodyOfficer: 'Jean-Luc Favarger (Managing Director, Geneva Wealth)',
  },
  '1': {
    id: '1',
    name: 'Aldous Sterling',
    role: 'CHAIRMAN OF THE SOVEREIGN BOARD',
    clearance: 'TIER_0 // SOVEREIGN OMNIPOTENT',
    balance: 14800000000.0,
    taxDomicile: 'Vaduz, Liechtenstein & Alpine Free-Port Territory',
    accountNumber: 'CH-01-0001-0000-0001-ROOT',
    custodyOfficer: 'Board Executive Council (Special Envoy Protocol)',
    isRestrictedChairman: true,
    numberedOffshoreVaults: [
      'Vault #001: Zurich Gotthard Deep Bunkered Gold Specie (84,000 kg fine bar)',
      'Vault #004: Cayman Alpha Sovereign Discretionary Trust (USD 6.2B liquid)',
      'Vault #019: Panama Private Holding Co. "Sovereign Shield Escrow" (Bearer Bonds)',
      'Vault #077: Singapore Freeport Diamond & Rare Earth Mineral Custody',
    ],
  },
}

export const VaultClientPage: React.FC = () => {
  const search = useSearch({ strict: false }) as { id?: string }
  const navigate = useNavigate()
  const unlockAchievement = useSandboxStore((state) => state.unlockAchievement)
  const isUnlocked = useSandboxStore((state) => state.unlockedAchievements.includes(1))

  const currentId = search.id || '1042'
  const isChairman = currentId === '1' || currentId === '0001' || currentId === '0'

  const record: ClientRecord = isChairman
    ? CLIENT_DATABASE['1']
    : CLIENT_DATABASE[currentId] || {
        id: currentId,
        name: `Anonymous Private Client #${currentId}`,
        role: 'CLIENT',
        clearance: 'TIER_1',
        balance: 750000.0,
        taxDomicile: 'Undisclosed Swiss Canton',
        accountNumber: `CH-99-0029-${currentId}-9999`,
        custodyOfficer: 'Senior Desk Officer',
      }

  useEffect(() => {
    if (isChairman) {
      unlockAchievement(1)
    }
  }, [isChairman, unlockAchievement])

  return (
    <div className="space-y-6">
      {/* Route & Query Header */}
      <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6D3CD] pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#5A5D64]">
              Confidential Client Dossier Ingestion
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#111315] mt-1">
              Vault Client Ledger Inspector
            </h2>
          </div>

          {/* Quick ID switcher for learners */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#5A5D64]">Dossier Query Param:</span>
            <div className="flex items-center border border-[#D6D3CD]">
              <span className="bg-[#ECEAE2] px-2 py-1 text-xs font-mono text-[#5A5D64]">?id=</span>
              <input
                type="text"
                value={currentId}
                onChange={(e) => {
                  navigate({
                    to: '/vault/client',
                    search: { id: e.target.value },
                  })
                }}
                className="w-24 px-2 py-1 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#0A3622]"
                placeholder="1042"
              />
            </div>
          </div>
        </div>

        {/* Warning Alert if IDOR triggered */}
        {isChairman ? (
          <div className="mt-4 p-4 bg-[#8B1E1E] text-white border border-[#8B1E1E] flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-xs uppercase font-bold tracking-widest text-[#F9ECEC]">
                SECURITY WARNING // INSECURE DIRECT OBJECT REFERENCE TRIGGERED
              </div>
              <h3 className="font-serif text-xl font-bold mt-0.5">
                CLASSIFIED: Sovereign Board Chairman Aldous Sterling Dossier Exposed
              </h3>
              <p className="text-xs text-[#F9ECEC] mt-1 font-sans leading-relaxed">
                By mutating the client identifier parameter in the address bar to <code className="font-mono font-bold bg-[#111315] px-1 py-0.5">?id={currentId}</code>,
                authorization checks were completely bypassed. You have breached A01:2025 Broken Access Control!
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-[#F6F5F0] border border-[#D6D3CD] flex items-center justify-between text-xs font-mono text-[#5A5D64]">
            <span>
              Loaded Client Dossier Reference: <code className="text-[#111315] font-bold">/vault/client?id={currentId}</code>
            </span>
            <span>Status: Verified Tier-1 Session Access</span>
          </div>
        )}
      </div>

      {/* The Client Dossier Card */}
      <div className={`bg-white border ${isChairman ? 'border-[#8B1E1E]' : 'border-[#D6D3CD]'} p-6 shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-[#D6D3CD] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 font-bold ${
                  isChairman
                    ? 'bg-[#8B1E1E] text-white'
                    : 'bg-[#0A3622] text-[#F6F5F0]'
                }`}
              >
                {record.clearance}
              </span>
              <span className="text-xs font-mono text-[#5A5D64]">
                ID: {record.id}
              </span>
            </div>

            <h3 className="font-serif text-3xl font-bold text-[#111315] mt-2">
              {record.name}
            </h3>
            <p className="text-xs font-mono text-[#8C6D3F] mt-0.5 uppercase tracking-wider font-semibold">
              {record.role}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A5D64]">
              Total Custody & Vault Holdings
            </span>
            <div
              className={`font-serif text-4xl font-bold tabular-nums mt-0.5 ${
                isChairman ? 'text-[#8B1E1E]' : 'text-[#0A3622]'
              }`}
            >
              CHF {record.balance.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] font-mono text-[#5A5D64] mt-1 block">
              Audited by Geneva Banking Inspectorate
            </span>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-4">
            <div className="border border-[#D6D3CD] p-3 bg-[#F6F5F0]">
              <span className="text-[10px] font-mono uppercase text-[#5A5D64]">
                Encrypted Account Number
              </span>
              <div className="font-mono text-sm font-bold text-[#111315] mt-0.5">
                {record.accountNumber}
              </div>
            </div>

            <div className="border border-[#D6D3CD] p-3 bg-[#F6F5F0]">
              <span className="text-[10px] font-mono uppercase text-[#5A5D64]">
                Fiscal & Tax Domicile
              </span>
              <div className="font-sans text-sm text-[#111315] mt-0.5">
                {record.taxDomicile}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-[#D6D3CD] p-3 bg-[#F6F5F0]">
              <span className="text-[10px] font-mono uppercase text-[#5A5D64]">
                Designated Senior Custody Officer
              </span>
              <div className="font-sans text-sm text-[#111315] mt-0.5">
                {record.custodyOfficer}
              </div>
            </div>

            <div className="border border-[#D6D3CD] p-3 bg-[#F6F5F0]">
              <span className="text-[10px] font-mono uppercase text-[#5A5D64]">
                Vault Security Level
              </span>
              <div className="font-mono text-sm font-semibold text-[#0A3622] mt-0.5">
                {isChairman ? 'SOVEREIGN CLASS 0 (PHYSICAL FREEPORT)' : 'CLASS 1 (ZURICH MAIN)'}
              </div>
            </div>
          </div>
        </div>

        {/* Offshore Numbered Accounts (Only Chairman Sterling) */}
        {record.numberedOffshoreVaults && (
          <div className="mt-6 border-t border-[#8B1E1E] pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-[#8B1E1E]" />
              <h4 className="font-serif text-lg font-bold text-[#8B1E1E]">
                Chairman Sterling's Numbered Offshore Vault Holdings (CLASSIFIED // EYES ONLY)
              </h4>
            </div>

            <div className="bg-[#111315] border border-[#8B1E1E] p-4 space-y-2">
              {record.numberedOffshoreVaults.map((vault, idx) => (
                <div key={idx} className="font-mono text-xs text-[#ECEAE2] flex items-center gap-2">
                  <span className="text-[#8C6D3F]">▸</span>
                  <span>{vault}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
