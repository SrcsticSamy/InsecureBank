/// <reference types="vite/client" />

interface ManualInterface {
  help: () => void
  missions: () => void
  heist: () => void
  hint: (id: number, tier?: 1 | 2 | 3) => void
  status: () => void
  reset: () => void
}

declare global {
  interface Window {
    manual: ManualInterface
    help: () => void
    hint: (id: number, tier?: 1 | 2 | 3) => void
    heist: () => void
    webkitAudioContext?: typeof AudioContext
  }
}

export {}
