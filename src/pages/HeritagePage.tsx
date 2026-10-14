import React from 'react'
import { Landmark } from 'lucide-react'

export const HeritagePage: React.FC = () => {
  return (
    <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#D6D3CD] pb-4">
        <Landmark className="w-6 h-6 text-[#8C6D3F]" />
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#111315]">
            Institutional Heritage & Governance
          </h2>
          <p className="text-xs font-mono text-[#5A5D64]">
            Established 1894, Geneva • Swiss Private Banking Tradition
          </p>
        </div>
      </div>
    </div>
  )
}
