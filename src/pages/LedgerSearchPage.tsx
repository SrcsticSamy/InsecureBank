import React from 'react'
import { Search } from 'lucide-react'

export const LedgerSearchPage: React.FC = () => {
  return (
    <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#D6D3CD] pb-4">
        <Search className="w-6 h-6 text-[#0A3622]" />
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#111315]">
            Historical Interbank Ledger Search
          </h2>
          <p className="text-xs font-mono text-[#5A5D64]">
            Query Zurich and Geneva wire archives
          </p>
        </div>
      </div>
    </div>
  )
}
