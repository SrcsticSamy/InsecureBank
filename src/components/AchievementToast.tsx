import React, { useEffect } from 'react'
import { Trophy, X } from 'lucide-react'
import { useSandboxStore } from '../store/useSandboxStore'

export const AchievementToast: React.FC = () => {
  const toastQueue = useSandboxStore((state) => state.toastQueue)
  const dismissToast = useSandboxStore((state) => state.dismissToast)

  const currentToast = toastQueue[0]

  useEffect(() => {
    if (!currentToast) return

    const timer = setTimeout(() => {
      dismissToast(currentToast.toastId)
    }, 5500)

    return () => clearTimeout(timer)
  }, [currentToast, dismissToast])

  if (!currentToast) return null

  return (
    <aside
      aria-label="Achievement notification"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      <div className="animate-toast bg-[#111315] border-2 border-[#0A3622] text-[#F6F5F0] shadow-2xl p-4 min-w-[340px] max-w-md flex items-center gap-4">
        {/* Glowing Trophy Icon */}
        <div className="w-12 h-12 bg-[#0A3622] border border-[#8C6D3F] flex items-center justify-center shrink-0">
          <Trophy className="w-6 h-6 text-[#8C6D3F]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C6D3F] font-bold">
              ACHIEVEMENT UNLOCKED
            </span>
            <span className="text-[10px] font-mono bg-[#0A3622] text-[#F6F5F0] px-1.5 py-0.5 border border-[#8C6D3F]/40">
              +{currentToast.points} G
            </span>
          </div>

          <h4 className="font-serif text-lg leading-tight text-white truncate mt-0.5">
            {currentToast.title}
          </h4>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-mono text-[#A0A2A7]">
              {currentToast.owaspCode}
            </span>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => dismissToast(currentToast.toastId)}
          className="text-[#5A5D64] hover:text-[#F6F5F0] p-1 border border-transparent hover:border-[#5A5D64] transition-colors"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  )
}
