import React from 'react'
import { Lock } from 'lucide-react'

export const ExecutivePage: React.FC = () => {
  return (
    <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#D6D3CD] pb-4">
        <Lock className="w-6 h-6 text-[#8B1E1E]" />
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#111315]">
            Sovereign Board Terminal
          </h2>
          <p className="text-xs font-mono text-[#5A5D64]">
            Restricted Hardware-Key Access Only
          </p>
        </div>
      </div>
    </div>
  )
}
