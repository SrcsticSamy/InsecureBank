/**
 * Synthesizes a bright, crisp Xbox-style Achievement chime using the Web Audio API.
 * Arpeggiated chord: A5 (880 Hz) -> E6 (1318.51 Hz) -> A6 (1760 Hz)
 * Zero external audio files or dependencies.
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass()
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    return audioCtx
  } catch {
    return null
  }
}

export function playAchievementChime(): void {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Notes: A5, E6, A6 with slight stagger
    const notes = [
      { freq: 880.0, start: 0.0, duration: 0.8 },      // A5
      { freq: 1318.51, start: 0.08, duration: 0.85 },  // E6
      { freq: 1760.0, start: 0.16, duration: 0.95 },   // A6
    ]

    notes.forEach(({ freq, start, duration }) => {
      const startTime = now + start
      const stopTime = startTime + duration

      // Primary Sine Oscillator for warmth
      const osc1 = ctx.createOscillator()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(freq, startTime)

      // Triangle Oscillator for bright acoustic body
      const osc2 = ctx.createOscillator()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(freq, startTime)

      // Gain Envelope with exponential decay
      const gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(0.0001, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.18, startTime + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, stopTime)

      osc1.connect(gainNode)
      osc2.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc1.start(startTime)
      osc2.start(startTime)
      osc1.stop(stopTime)
      osc2.stop(stopTime)
    })
  } catch {
    // Autoplay policy or unsupported audio environment; fail gracefully
  }
}
