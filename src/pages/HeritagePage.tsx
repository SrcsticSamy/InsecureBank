import React, { useEffect, useRef, useState } from 'react'
import { Landmark, Shield, Clock, BookOpen, ChevronDown, ChevronUp, Code } from 'lucide-react'
import { GlitchText } from '../components/GlitchText'

export const HeritagePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showMetadata, setShowMetadata] = useState(false)

  // Real DOM HTML Comment injection (React JSX strips comments, so useEffect DOM manipulation ensures it is in the real DOM tree)
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

  return (
    <div ref={containerRef} className="space-y-8 select-text">
      {/* Header */}
      <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6D3CD] pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#5A5D64]">
              Institutional Governance & Archives
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#111315] mt-1">
              The Heritage of Aegis Private Wealth
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#0A3622] bg-[#E6ECE8] px-3 py-1.5 border border-[#0A3622]">
            <Clock className="w-4 h-4" />
            <span>132 Years of Sovereign Confidentiality</span>
          </div>
        </div>

        <p className="text-sm font-serif italic text-[#5A5D64] mt-3 leading-relaxed">
          "Discretion is not an attribute of our institution; it is the stone from which our vaults were cut."
        </p>
      </div>

      {/* Main Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm space-y-4 text-sm leading-relaxed text-[#111315]">
            <h3 className="font-serif text-2xl font-bold text-[#111315] border-b border-[#D6D3CD] pb-2">
              The Geneva Charter of 1894
            </h3>
            <p>
              In the winter of <strong className="text-[#0A3622] font-semibold">1894</strong>, against the backdrop of burgeoning continental commerce, Aegis Private Wealth & Trust Bank S.A. received its sovereign charter in the historic banking quarter of Geneva. Founded by a consortium of Swiss private bankers and patricians, Aegis established an unbending doctrine: inviolable client sovereignty, total reserve segregation, and unyielding neutrality.
            </p>
            <p>
              To construct the bank's subterranean deep vaults beneath the Old Town of Geneva and later in the granite depths of the St. Gotthard massif, the founders retained the legendary Swiss vault engineer and architect <strong className="text-[#0A3622] font-semibold">Heinrich Keller</strong>. Keller designed the three-key rotary time locks and gravity-assisted hydraulic vault gates that remain operational to this day.
            </p>
            <p>
              Under Keller's structural blueprints, every safety deposit chamber was numbered rather than named, ensuring that even under extreme international diplomatic pressure, the custody of assets could never be coerced.
            </p>
          </div>

          <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm space-y-4 text-sm leading-relaxed text-[#111315]">
            <h3 className="font-serif text-2xl font-bold text-[#111315] border-b border-[#D6D3CD] pb-2">
              Sovereign Board Continuity & Governance
            </h3>
            <p>
              Governance of Aegis is entrusted solely to the Sovereign Board of Directors, presently chaired by Aldous Sterling. The Board retains supreme oversight of all numbered vault classifications and emergency liquidity reserves.
            </p>
            <p className="text-xs text-[#5A5D64] font-mono">
              Regulatory Note: <GlitchText text="Finanzmarktaufsicht FINMA Compliance ID 88-109" /> • Swiss Federal Banking Act Article 47.
            </p>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="space-y-6">
          <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm space-y-3">
            <h4 className="font-serif text-lg font-bold text-[#111315] flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#8C6D3F]" />
              Archival Fast Facts
            </h4>
            <div className="text-xs font-mono space-y-2 border-t border-[#D6D3CD] pt-3 text-[#5A5D64]">
              <div>
                <span className="text-[#111315] font-semibold">Year Chartered:</span> 1894 (Geneva, CH)
              </div>
              <div>
                <span className="text-[#111315] font-semibold">Chief Architect:</span> Heinrich Keller
              </div>
              <div>
                <span className="text-[#111315] font-semibold">Vault Domicile:</span> Geneva & Gotthard Pass
              </div>
              <div>
                <span className="text-[#111315] font-semibold">Auditor:</span> Inspectorate of Sovereign Trusts
              </div>
            </div>
          </div>

          {/* Footnote with hint to inspect DOM elements */}
          <div className="bg-[#ECEAE2] border border-[#D6D3CD] p-4 text-xs font-mono space-y-2">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="flex items-center justify-between w-full font-bold text-[#0A3622] hover:underline"
            >
              <span className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                Archival Source Metadata
              </span>
              {showMetadata ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showMetadata && (
              <div className="pt-2 text-[11px] text-[#5A5D64] leading-relaxed border-t border-[#D6D3CD]">
                <p>
                  Archival documents ingested into modern DOM structures may retain legacy source comments from administrative digitization.
                </p>
                <p className="mt-1 italic text-[#111315]">
                  Tip: Open DevTools Elements tab (<code className="font-bold">F12</code>) to inspect HTML comments embedded in this page!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
