let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    return ctx
  } catch {
    return null
  }
}

function beep(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.05, delay = 0) {
  const context = getContext()
  if (!context) return
  try {
    const start = context.currentTime + delay
    const osc = context.createOscillator()
    const gain = context.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, start)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    osc.connect(gain)
    gain.connect(context.destination)
    osc.start(start)
    osc.stop(start + duration)
  } catch {
    /* audio unavailable, ignore */
  }
}

export const sounds = {
  tap: () => beep(660, 0.06, 'sine', 0.04),
  start: () => { beep(440, 0.08, 'sine', 0.05); beep(660, 0.1, 'sine', 0.05, 0.08) },
  end: () => { beep(523, 0.1, 'sine', 0.05); beep(392, 0.16, 'sine', 0.05, 0.1) },
}
