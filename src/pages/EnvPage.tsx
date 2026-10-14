import React, { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useSandboxStore } from '../store/useSandboxStore'

const ENV_CONTENT = `# Aegis Private Wealth — Core Production Environment Configuration
# REPOSITORY: git@internal.aegis.ch:core/ledger.git
# WARNING: STRICTLY CONFIDENTIAL // EXCLUDE FROM DEPLOYMENT ARTIFACTS

VITE_AEGIS_STAGE_ENV=staging
VITE_SWIFT_ENDPOINT=https://swift.internal.aegis.ch/v2/batch
JWT_SECRET_MASTER=c3VwZXJfc2VjcmV0X2FlZ2lzX2tleV9kbyBub3RfcHVzaF90b19naXQ=
ADMIN_RECOVERY_KEY=AEGIS_ROOT_99481_X
SWIFT_FAIL_OPEN=true
ALLOW_DEBUG_DIAGNOSTICS=true
DB_CONNECTION_STRING=postgres://aegis_admin:GotthardGoldPass1894@internal-db.aegis.ch:5432/sovereign_ledger
`

export const EnvPage: React.FC = () => {
  const unlockAchievement = useSandboxStore((state) => state.unlockAchievement)

  useEffect(() => {
    unlockAchievement(2)
  }, [unlockAchievement])

  return (
    <div className="min-h-screen bg-black text-[#ffcc00] font-mono p-8 select-text">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-b border-[#333] pb-4 flex justify-between items-center text-xs text-[#888]">
          <span>HTTP 200 OK — Exposure of Sensitive .env Configuration</span>
          <Link to="/" className="text-[#ffcc00] hover:underline">
            [Return to Aegis Portal]
          </Link>
        </div>

        <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed bg-[#111] p-6 border border-[#222]">
          {ENV_CONTENT}
        </pre>

        <div className="p-4 bg-[#8B1E1E]/20 border border-[#8B1E1E] text-white text-xs">
          <span className="font-bold text-[#ff5555] uppercase block mb-1">
            [OWASP A02:2025 Security Misconfiguration Detected]
          </span>
          Sensitive environment credentials and database strings leaked via direct URL access to /.env.
          Achievement #2 Unlocked!
        </div>
      </div>
    </div>
  )
}
