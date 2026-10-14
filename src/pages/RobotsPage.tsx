import React, { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useSandboxStore } from '../store/useSandboxStore'

const ROBOTS_CONTENT = `User-agent: *
Disallow: /executive
Disallow: /swift-import
Disallow: /.env
Disallow: /api/v1/debug-config
# Note to DevOps: Do not forget to strip ?debug=true from production builds
`

export const RobotsPage: React.FC = () => {
  const unlockAchievement = useSandboxStore((state) => state.unlockAchievement)

  useEffect(() => {
    unlockAchievement(2)
  }, [unlockAchievement])

  return (
    <div className="min-h-screen bg-black text-[#00ff66] font-mono p-8 select-text">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-b border-[#333] pb-4 flex justify-between items-center text-xs text-[#888]">
          <span>HTTP 200 OK — Content-Type: text/plain</span>
          <Link to="/" className="text-[#00ff66] hover:underline">
            [Return to Aegis Portal]
          </Link>
        </div>

        <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed bg-[#111] p-6 border border-[#222]">
          {ROBOTS_CONTENT}
        </pre>

        <div className="p-4 bg-[#8B1E1E]/20 border border-[#8B1E1E] text-white text-xs">
          <span className="font-bold text-[#ff5555] uppercase block mb-1">
            [OWASP A02:2025 Security Misconfiguration Detected]
          </span>
          You inspected the crawler policy file and revealed hidden institutional routes (/executive, /swift-import, /.env, and ?debug=true flag).
          Achievement #2 Unlocked!
        </div>
      </div>
    </div>
  )
}
