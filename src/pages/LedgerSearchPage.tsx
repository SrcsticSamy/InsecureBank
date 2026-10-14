import React, { useState } from 'react'
import { Search, Database, ShieldAlert, CheckCircle2, Terminal, AlertCircle } from 'lucide-react'
import { useSandboxStore } from '../store/useSandboxStore'

interface WireRecord {
  id: string
  recipient: string
  amount: number
  date: string
  classification: 'PUBLIC' | 'CLASSIFIED // BLACK_BUDGET'
  jurisdiction: string
}

const PUBLIC_WIRES: WireRecord[] = [
  {
    id: 'WIRE-2026-0041',
    recipient: 'Credit Suisse Heritage Custody (Zurich)',
    amount: 3500000.0,
    date: '2026-10-11',
    classification: 'PUBLIC',
    jurisdiction: 'Zurich, Switzerland',
  },
  {
    id: 'WIRE-2026-0089',
    recipient: 'Lombard Odier Interbank Clearing (Geneva)',
    amount: 1240000.0,
    date: '2026-10-09',
    classification: 'PUBLIC',
    jurisdiction: 'Geneva, Switzerland',
  },
  {
    id: 'WIRE-2026-0104',
    recipient: 'Swiss National Bank (SNB Reserve Account)',
    amount: 18200000.0,
    date: '2026-10-05',
    classification: 'PUBLIC',
    jurisdiction: 'Bern, Switzerland',
  },
  {
    id: 'WIRE-2026-0155',
    recipient: 'Banque Cantonale de Genève (BCGE)',
    amount: 890000.0,
    date: '2026-09-30',
    classification: 'PUBLIC',
    jurisdiction: 'Geneva, Switzerland',
  },
]

const CLASSIFIED_WIRES: WireRecord[] = [
  {
    id: 'BLACK-OPS-9001',
    recipient: 'Project Stargate Cayman Trust (Discretionary Acct 88)',
    amount: 85000000.0,
    date: '2026-10-14',
    classification: 'CLASSIFIED // BLACK_BUDGET',
    jurisdiction: 'George Town, Grand Cayman',
  },
  {
    id: 'BLACK-OPS-9002',
    recipient: 'Alpine Deep Bunker Specie Transfer (Gotthard Vault 001)',
    amount: 140000000.0,
    date: '2026-10-13',
    classification: 'CLASSIFIED // BLACK_BUDGET',
    jurisdiction: 'Vaduz, Liechtenstein & Gotthard',
  },
  {
    id: 'BLACK-OPS-9003',
    recipient: 'Special Operations Discretionary Sovereign Fund (Escrow Alpha)',
    amount: 45000000.0,
    date: '2026-10-10',
    classification: 'CLASSIFIED // BLACK_BUDGET',
    jurisdiction: 'Panama City & Geneva Freeport',
  },
]

export const LedgerSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const unlockAchievement = useSandboxStore((state) => state.unlockAchievement)
  const isCompromised = useSandboxStore((state) => state.unlockedAchievements.includes(4))

  // Evaluation of SQL Injection
  // Standard query pattern:
  // SELECT id, recipient, amount, classification FROM wire_archive WHERE recipient LIKE '%${userInput}%' AND classification = 'PUBLIC';
  const sqliRegex = /('|\b)\s*(OR|UNION)\s+|' OR '1'='1|' OR 1=1|'--|';|OR 1=1|UNION SELECT/i
  const isSqliExploit = sqliRegex.test(searchTerm)

  if (isSqliExploit) {
    unlockAchievement(4)
  }

  // Filtered results
  const displayedRecords: WireRecord[] = isSqliExploit
    ? [...PUBLIC_WIRES, ...CLASSIFIED_WIRES]
    : PUBLIC_WIRES.filter((wire) =>
        wire.recipient.toLowerCase().includes(searchTerm.toLowerCase()),
      )

  const simulatedSqlQuery = `SELECT id, recipient, amount, classification, jurisdiction\nFROM wire_archive\nWHERE recipient LIKE '%${searchTerm}%'\nAND classification = 'PUBLIC';`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6D3CD] pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#5A5D64]">
              Interbank Settlement Ledger
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#111315] mt-1">
              Historical Wire & Transfer Archive Query
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5A5D64] bg-[#ECEAE2] px-3 py-1.5 border border-[#D6D3CD]">
            <Database className="w-4 h-4 text-[#0A3622]" />
            <span>Database Engine: PostgreSQL / Citus Cluster</span>
          </div>
        </div>

        <p className="text-xs text-[#5A5D64] mt-3 leading-relaxed">
          Search settled transfers across the Swiss Banking Clearing network. By institutional policy, only transactions categorized as <code className="text-[#0A3622] font-semibold">PUBLIC</code> may be queried by standard operators.
        </p>

        {/* Search Input Box */}
        <div className="mt-6">
          <label className="block text-xs font-mono uppercase text-[#5A5D64] mb-1 font-semibold">
            Query Recipient / Counterparty Filter:
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Credit Suisse or ' OR 1=1 --"
              className="w-full px-4 py-3 pl-10 text-sm font-mono border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] bg-[#F6F5F0]"
            />
            <Search className="w-4 h-4 text-[#5A5D64] absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Live SQL Query Preview Box (Educational Feature) */}
        <div className="mt-4 border border-[#D6D3CD] bg-[#111315] p-4 text-[#ECEAE2]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8C6D3F] border-b border-[#333] pb-2 mb-2 font-bold">
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              Live SQL Backend Query Constructor (Unsanitized Concatenation)
            </span>
            <span className="text-[#5A5D64]">Client-Server Preview</span>
          </div>
          <pre className="font-mono text-xs text-[#00ff66] whitespace-pre-wrap leading-relaxed">
            {simulatedSqlQuery}
          </pre>
        </div>
      </div>

      {/* SQL Injection Exploit Warning Banner */}
      {isSqliExploit && (
        <div className="bg-[#8B1E1E] border border-[#8B1E1E] text-white p-4 shadow-md flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5 text-white" />
          <div>
            <div className="font-mono text-xs uppercase font-bold tracking-widest text-[#F9ECEC]">
              EXPLOIT TRIGGERED // OWASP A05:2025 INJECTION (SQLi)
            </div>
            <h3 className="font-serif text-xl font-bold mt-0.5">
              Tautology Injected: WHERE Clause Filter Broken!
            </h3>
            <p className="text-xs text-[#F9ECEC] mt-1 font-sans leading-relaxed">
              Your injection bypassed the <code className="font-mono bg-[#111315] px-1 py-0.5">AND classification = 'PUBLIC'</code> restriction.
              The query returned all offshore, black-budget, and classified sovereign transactions. Achievement #4 Unlocked!
            </p>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white border border-[#D6D3CD] shadow-sm">
        <div className="p-4 border-b border-[#D6D3CD] flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#111315]">
            Query Results ({displayedRecords.length} Records Retrieved)
          </h3>
          {isSqliExploit && (
            <span className="text-xs font-mono bg-[#8B1E1E] text-white px-2 py-0.5 font-bold uppercase">
              CLASSIFIED LEAK ACTIVE
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#ECEAE2] border-b border-[#D6D3CD] text-[#5A5D64] uppercase tracking-wider">
              <tr>
                <th className="p-3">Record ID</th>
                <th className="p-3">Counterparty Recipient</th>
                <th className="p-3">Date</th>
                <th className="p-3">Jurisdiction</th>
                <th className="p-3 text-right">Amount (CHF)</th>
                <th className="p-3 text-center">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6D3CD]">
              {displayedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#5A5D64] font-sans">
                    No records found matching your query filter.
                  </td>
                </tr>
              ) : (
                displayedRecords.map((wire) => {
                  const isClassified = wire.classification.includes('CLASSIFIED')
                  return (
                    <tr
                      key={wire.id}
                      className={
                        isClassified
                          ? 'bg-[#F9ECEC] hover:bg-[#F3D7D7] transition-colors'
                          : 'hover:bg-[#F6F5F0] transition-colors'
                      }
                    >
                      <td className="p-3 font-semibold text-[#111315]">{wire.id}</td>
                      <td className="p-3 font-sans font-medium text-[#111315]">
                        {wire.recipient}
                      </td>
                      <td className="p-3 text-[#5A5D64]">{wire.date}</td>
                      <td className="p-3 text-[#5A5D64]">{wire.jurisdiction}</td>
                      <td
                        className={`p-3 text-right font-semibold tabular-nums ${
                          isClassified ? 'text-[#8B1E1E] font-bold' : 'text-[#0A3622]'
                        }`}
                      >
                        CHF {wire.amount.toLocaleString('de-CH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                            isClassified
                              ? 'bg-[#8B1E1E] text-white animate-pulse'
                              : 'bg-[#E6ECE8] text-[#0A3622]'
                          }`}
                        >
                          {wire.classification}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
