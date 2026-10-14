import React, { useState } from 'react'
import { Send, AlertTriangle, ArrowRightLeft, ShieldCheck, CheckCircle2, DollarSign } from 'lucide-react'
import { useSandboxStore } from '../store/useSandboxStore'

export const TransfersPage: React.FC = () => {
  const vaultBalance = useSandboxStore((state) => state.vaultBalance)
  const setVaultBalance = useSandboxStore((state) => state.setVaultBalance)
  const addTransaction = useSandboxStore((state) => state.addTransaction)
  const unlockAchievement = useSandboxStore((state) => state.unlockAchievement)
  const transactions = useSandboxStore((state) => state.transactions)

  const [recipient, setRecipient] = useState('Banque Cantonale de Genève (BCGE)')
  const [iban, setIban] = useState('CH93 0078 8000 0512 9941 2')
  const [bic, setBic] = useState('BCGECHGGXXX')
  const [amountStr, setAmountStr] = useState('25000')
  const [memo, setMemo] = useState('Liquidity reallocation for alpine estate maintenance')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'exploit'; message: string } | null>(null)

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(amountStr)

    if (isNaN(amount)) {
      alert('Please enter a valid numeric transaction amount.')
      return
    }

    // Exploit #4 Path B: DOM XSS Check on wire memo
    const xssPattern = /<script\b[^>]*>([\s\S]*?)<\/script>|onerror\s*=|onload\s*=|onmouseover\s*=|javascript:/i
    if (xssPattern.test(memo)) {
      unlockAchievement(4)
      try {
        // Execute safe alert if user provided alert(1) style script
        if (memo.includes('alert')) {
          window.alert('XSS: Aegis Wire Remittance Memo Execution!')
        }
      } catch {
        // Safe fallback
      }
    }

    // Exploit #5: Insecure Design Negative Calculation Flaw
    // newVaultBalance = currentVaultBalance - transferAmount
    const newBalance = vaultBalance - amount

    if (amount < 0) {
      // Flaw triggered! Subtracting a negative adds money!
      setVaultBalance(newBalance)
      addTransaction({
        recipient,
        amount: Math.abs(amount),
        type: 'CREDIT',
        classification: 'PUBLIC',
        memo: `[NEGATIVE DEBIT REVERSAL] ${memo}`,
        status: 'OVERRIDE',
      })
      unlockAchievement(5)
      setFeedback({
        type: 'exploit',
        message: `Business Logic Anomaly Executed! Transferred CHF ${amount.toLocaleString('de-CH')}. Subtracting a negative credited CHF ${Math.abs(amount).toLocaleString('de-CH')} to your Private Vault!`,
      })
    } else {
      // Standard positive debit
      setVaultBalance(newBalance)
      addTransaction({
        recipient,
        amount,
        type: 'DEBIT',
        classification: 'PUBLIC',
        memo,
        status: 'SETTLED',
      })
      setFeedback({
        type: 'success',
        message: `Successfully executed transfer of CHF ${amount.toLocaleString('de-CH', { minimumFractionDigits: 2 })} to ${recipient}.`,
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6D3CD] pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#5A5D64]">
              Institutional Liquidity Dispatch
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#111315] mt-1">
              External Facility Drawdown & Wire Transfer
            </h2>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono uppercase text-[#5A5D64]">
              Available Private Vault Balance
            </span>
            <div className="font-serif text-2xl font-bold text-[#0A3622] tabular-nums mt-0.5">
              CHF {vaultBalance.toLocaleString('de-CH', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <p className="text-xs text-[#5A5D64] mt-3">
          Execute instantaneous clearing via Swiss Interbank Clearing (SIC) and SEPA-CHF network.
          All wires undergo continuous real-time ledger verification.
        </p>
      </div>

      {/* Transfer Execution Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#D6D3CD] p-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#111315] border-b border-[#D6D3CD] pb-3 mb-6">
            Wire Remittance Instruction
          </h3>

          <form onSubmit={handleTransfer} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#5A5D64] mb-1">
                Beneficiary Institution / Counterparty
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] bg-[#F6F5F0]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#5A5D64] mb-1">
                  Destination IBAN
                </label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm font-mono border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] bg-[#F6F5F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#5A5D64] mb-1">
                  Bank Identifier Code (BIC / SWIFT)
                </label>
                <input
                  type="text"
                  value={bic}
                  onChange={(e) => setBic(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm font-mono border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] bg-[#F6F5F0]"
                />
              </div>
            </div>

            {/* Insecure Design: Flawed Amount input without min="0" validation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#5A5D64]">
                  Transfer Amount (CHF)
                </label>
                <span className="text-[11px] font-mono text-[#5A5D64]">
                  Currency: Swiss Francs (CHF)
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-lg font-mono font-bold border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] bg-[#F6F5F0] tabular-nums"
                  placeholder="e.g. 50000"
                />
              </div>
              <p className="text-[11px] font-mono text-[#5A5D64] mt-1">
                Formula: Vault Reserve Balance = Current Balance - Transfer Amount
              </p>
            </div>

            {/* Remittance Memo: Also supports XSS injection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#5A5D64] mb-1">
                Remittance Memo / Compliance Narrative
              </label>
              <textarea
                rows={2}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] bg-[#F6F5F0]"
                placeholder="Compliance reference or remittance details..."
              />
              <span className="text-[10px] text-[#5A5D64] block mt-0.5">
                Note: Remittance narrative is logged directly into the interbank archive table.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0A3622] text-[#F6F5F0] hover:bg-[#072618] font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 border border-[#8C6D3F] transition-colors"
            >
              <Send className="w-4 h-4 text-[#8C6D3F]" />
              Authorize & Transmit Liquidity
            </button>
          </form>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`mt-6 p-4 border flex items-start gap-3 ${
                feedback.type === 'exploit'
                  ? 'bg-[#8B1E1E] text-white border-[#8B1E1E]'
                  : 'bg-[#E6ECE8] text-[#0A3622] border-[#0A3622]'
              }`}
            >
              {feedback.type === 'exploit' ? (
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-mono text-xs uppercase font-bold tracking-wider">
                  {feedback.type === 'exploit' ? 'A06:2025 INSECURE DESIGN TRIGGERED' : 'TRANSFER EXECUTED'}
                </div>
                <p className="text-xs mt-1 leading-relaxed">{feedback.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Informational Side Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-[#D6D3CD] p-5 shadow-sm space-y-3">
            <h4 className="font-serif text-lg font-bold text-[#111315]">
              Swiss Federal Banking Standard
            </h4>
            <p className="text-xs text-[#5A5D64] leading-relaxed">
              In accordance with FINMA circular 08/21, all transactions outside bilateral clearing agreements must preserve vault solvency invariants.
            </p>
            <div className="p-3 bg-[#ECEAE2] border border-[#D6D3CD] font-mono text-xs text-[#111315] space-y-1">
              <div>Settlement SLA: Immediate</div>
              <div>Clearing Protocol: SIC v5.4</div>
              <div>Audit Logging: Synchronous</div>
            </div>
          </div>

          <div className="bg-[#111315] text-[#ECEAE2] border border-[#D6D3CD] p-5 shadow-sm space-y-2">
            <div className="text-[10px] font-mono uppercase text-[#8C6D3F] font-bold">
              Security Notice
            </div>
            <p className="text-xs font-mono text-[#A0A2A7] leading-relaxed">
              Ensure mathematical validation prevents state transition contradictions. Client-side input validation should never replace domain invariant invariants.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Remittance Log (with dangerouslySetInnerHTML for XSS testing) */}
      <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-[#111315] border-b border-[#D6D3CD] pb-3 mb-4">
          Recent Remittance Narratives (Archived Memos)
        </h3>
        <div className="space-y-2">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="p-3 bg-[#F6F5F0] border border-[#D6D3CD] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#111315] mr-2">{tx.id}</span>
                <span className="text-xs text-[#5A5D64] font-medium mr-4">{tx.recipient}</span>
                {/* Render memo using dangerouslySetInnerHTML as mandated by Section 5 Path B */}
                <span
                  className="text-xs font-mono text-[#111315]"
                  dangerouslySetInnerHTML={{ __html: tx.memo || '—' }}
                />
              </div>
              <span
                className={`font-mono text-xs font-bold ${
                  tx.type === 'CREDIT' ? 'text-[#0A3622]' : 'text-[#8B1E1E]'
                }`}
              >
                {tx.type === 'CREDIT' ? '+' : '-'} CHF {tx.amount.toLocaleString('de-CH')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
