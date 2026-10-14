import React from 'react'
import { GlitchText } from './components/GlitchText'
import { playAchievementChime } from './lib/sound'

export function App() {
  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#111315] p-8">
      <header className="border-b border-[#D6D3CD] pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight">
            AEGIS PRIVATE WEALTH & TRUST BANK
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#5A5D64] mt-1">
            Institutional Sovereign Ledger • Geneva, Est. 1894
          </p>
        </div>
        <button
          onClick={() => playAchievementChime()}
          className="border border-[#0A3622] bg-[#0A3622] text-[#F6F5F0] px-4 py-2 text-xs uppercase tracking-wider hover:bg-[#072618]"
        >
          Test Synth Audio
        </button>
      </header>

      <main className="border border-[#D6D3CD] p-6 bg-white">
        <p className="text-sm text-[#5A5D64]">
          System Status: Operational • <GlitchText text="Cryptographic Vault Subsystem Verified" />
        </p>
      </main>
    </div>
  )
}
