import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, ArrowDownLeft, Shield, Landmark, Vault, CreditCard, ChevronRight } from 'lucide-react'
import { useSandboxStore } from '../store/useSandboxStore'
import { GlitchText } from '../components/GlitchText'

export const DashboardPage: React.FC = () => {
  const vaultBalance = useSandboxStore((state) => state.vaultBalance)
  const clientName = useSandboxStore((state) => state.clientName)
  const clearance = useSandboxStore((state) => state.clearance)
  const role = useSandboxStore((state) => state.role)
  const transactions = useSandboxStore((state) => state.transactions)

  return (
    <div className="space-y-8">
      {/* Top Welcome & Dossier Summary */}
      <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6D3CD] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#5A5D64]">
                Account Classification:
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-[#0A3622] text-[#F6F5F0]">
                {clearance} // {role}
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#111315] mt-1">
              {clientName}
            </h2>
            <p className="text-xs font-mono text-[#5A5D64] mt-0.5">
              Custody Portfolio Reference: <span className="text-[#111315] font-semibold">CH-84-0029-1042-8819</span> • Domicile: Zürich, CH
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5A5D64]">
              Total Liquid Wealth (Vault Reserve)
            </span>
            <div className="font-serif text-4xl font-bold text-[#0A3622] tabular-nums mt-0.5">
              CHF {vaultBalance.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] font-mono text-[#0A3622] flex items-center justify-end gap-1 mt-1">
              <Shield className="w-3.5 h-3.5" /> 100% Fully Backed by Physical Allocated Gold
            </span>
          </div>
        </div>

        {/* Wealth Allocation Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="border border-[#D6D3CD] p-4 bg-[#F6F5F0]">
            <div className="flex items-center justify-between text-[#5A5D64]">
              <span className="text-xs font-mono uppercase">Allocated Bullion</span>
              <Vault className="w-4 h-4 text-[#8C6D3F]" />
            </div>
            <div className="font-serif text-2xl font-bold text-[#111315] mt-1 tabular-nums">
              CHF 250,000.00
            </div>
            <div className="text-[11px] font-mono text-[#5A5D64] mt-1">
              12.5 kg 999.9 Fine Gold • St. Gotthard Deep Vault
            </div>
          </div>

          <div className="border border-[#D6D3CD] p-4 bg-[#F6F5F0]">
            <div className="flex items-center justify-between text-[#5A5D64]">
              <span className="text-xs font-mono uppercase">Sovereign Bonds</span>
              <Landmark className="w-4 h-4 text-[#0A3622]" />
            </div>
            <div className="font-serif text-2xl font-bold text-[#111315] mt-1 tabular-nums">
              CHF 120,500.00
            </div>
            <div className="text-[11px] font-mono text-[#5A5D64] mt-1">
              Swiss Confederation 1.25% 2034 • AAA Rated
            </div>
          </div>

          <div className="border border-[#D6D3CD] p-4 bg-[#F6F5F0]">
            <div className="flex items-center justify-between text-[#5A5D64]">
              <span className="text-xs font-mono uppercase">Lombard Credit Facility</span>
              <CreditCard className="w-4 h-4 text-[#8B1E1E]" />
            </div>
            <div className="font-serif text-2xl font-bold text-[#111315] mt-1 tabular-nums">
              CHF 50,000.00
            </div>
            <div className="text-[11px] font-mono text-[#5A5D64] mt-1">
              Available Drawdown Line • 1.15% Margin Rate
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Navigation Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/vault/client"
          search={{ id: '1042' }}
          className="border border-[#D6D3CD] bg-white p-4 hover:border-[#0A3622] transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="font-serif text-lg font-bold text-[#111315] group-hover:text-[#0A3622]">
              Inspect Client Vault Dossier
            </div>
            <div className="text-xs text-[#5A5D64] font-mono mt-0.5">
              Review confidential numbered holdings (?id=1042)
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#5A5D64] group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/transfers"
          className="border border-[#D6D3CD] bg-white p-4 hover:border-[#0A3622] transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="font-serif text-lg font-bold text-[#111315] group-hover:text-[#0A3622]">
              Execute Liquidity Transfer
            </div>
            <div className="text-xs text-[#5A5D64] font-mono mt-0.5">
              External facility wire & remittance memo
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#5A5D64] group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/ledger-search"
          className="border border-[#D6D3CD] bg-white p-4 hover:border-[#0A3622] transition-colors flex items-center justify-between group"
        >
          <div>
            <div className="font-serif text-lg font-bold text-[#111315] group-hover:text-[#0A3622]">
              Audit Historical Archives
            </div>
            <div className="text-xs text-[#5A5D64] font-mono mt-0.5">
              Search wire records across Zurich clearing
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#5A5D64] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent Ledger Entries */}
      <div className="bg-white border border-[#D6D3CD] shadow-sm">
        <div className="p-4 border-b border-[#D6D3CD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-[#111315]">
              Core Custody Ledger Entries
            </h3>
            <span className="text-[11px] font-mono text-[#5A5D64]">
              (Last {transactions.length} Records)
            </span>
          </div>
          <span className="text-xs font-mono text-[#0A3622] bg-[#E6ECE8] px-2 py-0.5">
            <GlitchText text="Cryptographic Proof: Validated" />
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#ECEAE2] border-b border-[#D6D3CD] text-[#5A5D64] uppercase tracking-wider">
              <tr>
                <th className="p-3">Reference</th>
                <th className="p-3">Timestamp (CET)</th>
                <th className="p-3">Counterparty / Description</th>
                <th className="p-3">Memo</th>
                <th className="p-3 text-right">Amount (CHF)</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6D3CD]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F6F5F0] transition-colors">
                  <td className="p-3 font-semibold text-[#111315]">{tx.id}</td>
                  <td className="p-3 text-[#5A5D64]">{tx.date}</td>
                  <td className="p-3 text-[#111315] font-sans font-medium">{tx.recipient}</td>
                  <td className="p-3 text-[#5A5D64] italic max-w-xs truncate">{tx.memo || '—'}</td>
                  <td
                    className={`p-3 text-right font-semibold tabular-nums ${
                      tx.type === 'CREDIT' ? 'text-[#0A3622]' : 'text-[#8B1E1E]'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? '+' : '-'} {tx.amount.toLocaleString('de-CH', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                        tx.status === 'SETTLED'
                          ? 'bg-[#E6ECE8] text-[#0A3622]'
                          : tx.status === 'OVERRIDE'
                          ? 'bg-[#F9ECEC] text-[#8B1E1E]'
                          : 'bg-[#ECEAE2] text-[#5A5D64]'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
