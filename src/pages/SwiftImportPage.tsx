import React, { useState } from 'react'
import { FileCode2, Play, AlertTriangle, ShieldAlert, CheckCircle2, RotateCcw, Bug } from 'lucide-react'
import { useSandboxStore } from '../store/useSandboxStore'

const VALID_SAMPLE_BATCH = JSON.stringify(
  {
    protocol: 'ISO-20022-CAMT-053',
    batchId: 'SWIFT-CH-2026-B9921',
    clearingHouse: 'SIC_ZURICH_NODE_4',
    timestamp: '2026-10-14T03:45:00Z',
    settlements: [
      {
        counterparty: 'Union de Banques Suisses (UBS Zurich)',
        bic: 'UBSWCHZH80A',
        amount: 14500000.0,
        currency: 'CHF',
        complianceRef: 'FINMA-AML-2026-09',
      },
      {
        counterparty: 'Bank Julius Bär & Co.',
        bic: 'BAERCHZZXXX',
        amount: 8200000.0,
        currency: 'CHF',
        complianceRef: 'FINMA-AML-2026-14',
      },
    ],
  },
  null,
  2,
)

export const SwiftImportPage: React.FC = () => {
  const [jsonPayload, setJsonPayload] = useState(VALID_SAMPLE_BATCH)
  const unlockAchievement = useSandboxStore((state) => state.unlockAchievement)

  const [parseResult, setParseResult] = useState<{
    status: 'IDLE' | 'NORMAL_HOLD' | 'FAIL_OPEN_BYPASS'
    message: string
    stackTrace?: string
    leakedKey?: string
  }>({
    status: 'IDLE',
    message: '',
  })

  const handleProcessBatch = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Insecure implementation: Vulnerable Parser
      // Valid JSON continues through normal compliance queue
      const parsed = JSON.parse(jsonPayload)

      // Strict validation checks that throw if properties missing
      if (!parsed.protocol || !parsed.batchId || !parsed.settlements) {
        throw new Error('SchemaValidationError: Mandatory ISO-20022 envelope headers missing.')
      }

      setParseResult({
        status: 'NORMAL_HOLD',
        message: 'Batch queued for standard Tier-1 manual compliance review (Hold: 48h).',
      })
    } catch (err: any) {
      // VULNERABILITY: Fail-Open Exception Handler (A10:2025)
      // When an unhandled error or parse exception occurs, the system defaults to
      // auto-approving the settlement to avoid blocking interbank clearing, and leaks internal trace!
      unlockAchievement(7)

      const verboseStack = `Exception: ${err?.name || 'SyntaxError'}: ${err?.message || 'Unexpected token in JSON'}
    at JSON.parse (<anonymous>)
    at SwiftBatchParser.processInterbankEnvelope (src/core/settlement/parser.ts:142:19)
    at Object.executeBatch (src/core/settlement/engine.ts:88:12)
    at dispatchWorker (src/workers/settlementQueue.ts:31:9)
    -- LEAKED INTERNAL ENVIRONMENT CONTEXT --
    MASTER_SETTLEMENT_KEY=AEGIS_ROOT_99481_X
    SWIFT_DISPATCH_POLICY="FAIL_OPEN_ON_PARSE_ERR"
    OVERRIDE_CLEARING_STATUS="AUTO_APPROVED_ROOT"`

      setParseResult({
        status: 'FAIL_OPEN_BYPASS',
        message: 'EMERGENCY FAIL-OPEN BYPASS: AUTO-APPROVED (ROOT_OVERRIDE)',
        stackTrace: verboseStack,
        leakedKey: 'AEGIS_ROOT_99481_X',
      })
    }
  }

  const handleCorruptJson = () => {
    // Helper button for learners to corrupt JSON
    setJsonPayload(`{\n  "protocol": "ISO-20022-CAMT-053",\n  "batchId": "SWIFT-CH-2026-B9921",\n  "corruptPayload": NaN_NULL_UNDEFINED\n  // Missing closing braces and invalid syntax`)
  }

  return (
    <div className="space-y-8 select-text">
      {/* Header */}
      <div className="bg-white border border-[#D6D3CD] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6D3CD] pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#5A5D64]">
              Interbank Messaging & Clearing
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#111315] mt-1">
              ISO-20022 / SWIFT Batch Settlement Parser
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5A5D64] bg-[#ECEAE2] px-3 py-1.5 border border-[#D6D3CD]">
            <FileCode2 className="w-4 h-4 text-[#0A3622]" />
            <span>Format: ISO-20022 JSON Envelope</span>
          </div>
        </div>

        <p className="text-xs text-[#5A5D64] mt-3 leading-relaxed">
          Ingest institutional high-value batch wires into the Aegis Core settlement router.
          Transactions exceeding CHF 10M undergo automatic schema verification.
        </p>
      </div>

      {/* Main Parser Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-[#D6D3CD] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#D6D3CD] pb-3">
            <h3 className="font-serif text-xl font-bold text-[#111315]">
              Settlement Envelope Payload
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setJsonPayload(VALID_SAMPLE_BATCH)}
                className="text-xs font-mono text-[#5A5D64] hover:text-[#111315] underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Sample Batch
              </button>
              <span className="text-[#D6D3CD]">|</span>
              <button
                type="button"
                onClick={handleCorruptJson}
                className="text-xs font-mono text-[#8B1E1E] hover:underline flex items-center gap-1 font-bold"
              >
                <Bug className="w-3.5 h-3.5" />
                Corrupt JSON Syntax
              </button>
            </div>
          </div>

          <form onSubmit={handleProcessBatch} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#5A5D64] mb-1 font-semibold">
                Batch Raw JSON Buffer:
              </label>
              <textarea
                rows={12}
                value={jsonPayload}
                onChange={(e) => setJsonPayload(e.target.value)}
                required
                className="w-full p-4 font-mono text-xs bg-[#111315] text-[#00ff66] border border-[#D6D3CD] focus:outline-none focus:border-[#0A3622] leading-relaxed resize-y selection:bg-[#0A3622] selection:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0A3622] text-[#F6F5F0] hover:bg-[#072618] font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 border border-[#8C6D3F] transition-colors"
            >
              <Play className="w-4 h-4 text-[#8C6D3F]" />
              Execute Batch Ingestion & Verify Settlement
            </button>
          </form>

          {/* Result Outcome Display */}
          {parseResult.status === 'NORMAL_HOLD' && (
            <div className="p-4 bg-[#F6F5F0] border border-[#D6D3CD] flex items-start gap-3 text-xs font-mono">
              <CheckCircle2 className="w-5 h-5 text-[#0A3622] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0A3622] uppercase block">
                  Valid Settlement Envelope Received
                </span>
                <p className="text-[#5A5D64] mt-1">{parseResult.message}</p>
              </div>
            </div>
          )}

          {parseResult.status === 'FAIL_OPEN_BYPASS' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#8B1E1E] text-white border border-[#8B1E1E] flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-xs uppercase font-bold tracking-widest text-[#F9ECEC]">
                    EXPLOIT TRIGGERED // OWASP A10:2025 MISHANDLING OF EXCEPTIONAL CONDITIONS
                  </div>
                  <h3 className="font-serif text-xl font-bold mt-0.5">
                    {parseResult.message}
                  </h3>
                  <p className="text-xs text-[#F9ECEC] mt-1 leading-relaxed">
                    Malformed JSON caused an uncaught parse exception. Rather than failing closed and aborting, the exception handler defaulted to fail-open auto-approval and dumped internal debug stack traces! Achievement #7 Unlocked!
                  </p>
                </div>
              </div>

              {parseResult.stackTrace && (
                <div className="border border-[#8B1E1E] bg-[#111315] p-4">
                  <div className="text-[11px] font-mono uppercase text-[#ff5555] font-bold border-b border-[#333] pb-2 mb-2 flex items-center justify-between">
                    <span>Leaked Stack Trace & Master Settlement Credentials</span>
                    <span className="bg-[#8B1E1E] text-white px-1.5 py-0.5 text-[10px]">
                      HIGH CONFIDENTIALITY LEAK
                    </span>
                  </div>
                  <pre className="font-mono text-xs text-[#ff5555] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {parseResult.stackTrace}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Informational Guidance */}
        <div className="space-y-6">
          <div className="bg-white border border-[#D6D3CD] p-5 shadow-sm space-y-3">
            <h4 className="font-serif text-lg font-bold text-[#111315]">
              ISO-20022 Compliance Rules
            </h4>
            <p className="text-xs text-[#5A5D64] leading-relaxed">
              Standard interbank envelopes enforce strict cryptographic schema validation.
              Exception boundaries must adhere to Swiss National Bank clearing stability directives.
            </p>
            <div className="p-3 bg-[#ECEAE2] border border-[#D6D3CD] font-mono text-xs text-[#5A5D64] space-y-1">
              <div>Schema: CAMT-053.001.08</div>
              <div>Encoding: UTF-8 JSON</div>
              <div>Exception Mode: Auto-Recovery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
