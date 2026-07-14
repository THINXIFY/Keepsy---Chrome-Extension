import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, HelpCircle, PartyPopper, Volume2, VolumeX } from 'lucide-react'
import { loadBestScore, loadGuideDismissed, loadMuted, saveBestScore, saveGuideDismissed, saveMuted } from './storage'
import { sounds } from './sound'

const BOARD = 320
const PAD = 10
const DURATION = 30
const BASE_SIZE = 64
const MIN_SIZE = 30
const SHRINK_STEP = 6
const BASE_POP_MS = 220
const MIN_POP_MS = 90

function sizeForScore(score: number) { return Math.max(MIN_SIZE, BASE_SIZE - Math.floor(score / 10) * SHRINK_STEP) }
function popDurationForScore(score: number) { return Math.max(MIN_POP_MS, BASE_POP_MS - score * 3) / 1000 }
function randomPosition(size: number, avoid?: { x: number; y: number }) {
  const max = BOARD - PAD * 2 - size
  let x = PAD + Math.random() * max
  let y = PAD + Math.random() * max
  if (avoid) {
    let attempts = 0
    while (Math.hypot(x - avoid.x, y - avoid.y) < size * 1.4 && attempts < 6) { x = PAD + Math.random() * max; y = PAD + Math.random() * max; attempts++ }
  }
  return { x, y }
}

function primaryButton(extra = '') { return `inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-primary to-secondary px-4 py-2.5 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.14)] transition hover:brightness-110 active:scale-[.97] ${extra}` }
function ghostButton(extra = '') { return `inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-medium text-muted transition hover:bg-white/[.06] hover:text-white ${extra}` }

const guideSteps = [
  'Click the blue dot.',
  'Every click gives 1 point.',
  'The dot moves after every click.',
  'You have 30 seconds.',
  'Beat your best score!',
]

type Dot = { key: number; x: number; y: number; size: number }

export default function TapTheDot({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'over'>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [muted, setMuted] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [dot, setDot] = useState<Dot | null>(null)
  const dotKey = useRef(0)

  useEffect(() => { loadBestScore().then(setBest) }, [])
  useEffect(() => { loadMuted().then(setMuted) }, [])
  useEffect(() => { loadGuideDismissed().then(dismissed => setShowGuide(!dismissed)) }, [])

  const play = (name: keyof typeof sounds) => { if (!muted) sounds[name]() }

  const spawnDot = (currentScore: number, previous?: { x: number; y: number }) => {
    const size = sizeForScore(currentScore)
    const pos = randomPosition(size, previous)
    dotKey.current += 1
    setDot({ key: dotKey.current, size, ...pos })
  }

  const startGame = () => {
    setScore(0)
    setTimeLeft(DURATION)
    setStatus('playing')
    play('start')
    spawnDot(0)
  }

  const handleTap = () => {
    if (status !== 'playing' || !dot) return
    const nextScore = score + 1
    setScore(nextScore)
    play('tap')
    spawnDot(nextScore, dot)
  }

  useEffect(() => {
    if (status !== 'playing') return
    const interval = window.setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => window.clearInterval(interval)
  }, [status])

  useEffect(() => {
    if (status !== 'playing' || timeLeft !== 0) return
    setStatus('over')
    setDot(null)
    play('end')
    setBest(current => { if (score > current) { void saveBestScore(score); return score } return current })
  }, [timeLeft, status])

  return <div className="absolute inset-0 z-30 flex flex-col bg-midnight">
    <header className="flex items-center justify-between px-4 pb-2 pt-4">
      <div className="flex items-center gap-2"><button onClick={onClose} aria-label="Back to Keepsy" className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-white/[.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"><ArrowLeft size={18} /></button><img src="/game-logo-dot.png" alt="" className="size-6 object-contain" /><h1 className="text-[15px] font-semibold tracking-[-.02em] text-white">Tap the Dot</h1></div>
      <div className="flex items-center gap-1">
        <button onClick={() => setShowGuide(true)} aria-label="How to play" title="How to play" className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-white/[.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"><HelpCircle size={16} /></button>
        <button onClick={() => { const next = !muted; setMuted(next); void saveMuted(next) }} aria-label={muted ? 'Unmute sound' : 'Mute sound'} className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-white/[.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary">{muted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
      </div>
    </header>

    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
      <div className="flex gap-2">
        <div className="flex-1 rounded-xl border border-line bg-card px-2 py-2 text-center"><p className="text-[9px] font-semibold uppercase tracking-[.08em] text-muted">Score</p><p className="mt-0.5 text-lg font-bold text-white">{score}</p></div>
        <div className="flex-1 rounded-xl border border-line bg-card px-2 py-2 text-center"><p className="text-[9px] font-semibold uppercase tracking-[.08em] text-muted">Best</p><p className="mt-0.5 text-lg font-bold text-white">{best}</p></div>
        <div className="flex-1 rounded-xl border border-line bg-card px-2 py-2 text-center"><p className="text-[9px] font-semibold uppercase tracking-[.08em] text-muted">Time</p><p className={`mt-0.5 text-lg font-bold ${timeLeft <= 5 && status === 'playing' ? 'text-[#ff9fb5]' : 'text-white'}`}>{timeLeft}</p></div>
      </div>

      <div className="relative mx-auto mt-4 overflow-hidden rounded-2xl border border-line bg-card" style={{ width: BOARD, height: BOARD }}>
        <AnimatePresence>
          {status === 'playing' && dot && <motion.button
            key={dot.key}
            onClick={handleTap}
            initial={{ x: dot.x, y: dot.y, scale: 0.4, opacity: 0 }}
            animate={{ x: dot.x, y: dot.y, scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: popDurationForScore(score), ease: 'easeOut' }}
            className="absolute left-0 top-0 rounded-full bg-gradient-to-br from-primary to-secondary focus:outline-none focus:ring-2 focus:ring-white/70"
            style={{ width: dot.size, height: dot.size, boxShadow: '0 0 22px rgba(0,87,255,.65), 0 0 4px rgba(0,87,255,.85)' }}
            aria-label="Tap the dot"
          />}
        </AnimatePresence>

        {status === 'idle' && <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div>
            <img src="/game-logo-dot.png" alt="Tap the Dot" className="mx-auto size-24 object-contain" style={{ filter: 'drop-shadow(0 0 18px rgba(0,87,255,.5))' }} />
            <p className="mt-4 text-sm font-semibold text-white">Ready to play?</p>
            <p className="mt-1 text-[11px] leading-5 text-muted">Tap as many dots as you can in 30 seconds.</p>
            <button onClick={startGame} className={primaryButton('mt-4')}>Start Game</button>
          </div>
        </div>}

        <AnimatePresence>
          {status === 'over' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 grid place-items-center bg-midnight/90 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.85, opacity: 0, y: 6 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 360, damping: 26 }} className="text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-b from-primary to-secondary text-white"><PartyPopper size={24} /></div>
              <p className="mt-3 text-base font-semibold text-white">Great Job!</p>
              <p className="mt-1 text-xs text-muted">Score: <span className="font-semibold text-[#E6E8F0]">{score}</span></p>
              <p className="text-xs text-muted">Best Score: <span className="font-semibold text-[#E6E8F0]">{best}</span></p>
              <div className="mt-4 flex gap-2"><button onClick={onClose} className={ghostButton()}>Back to Keepsy</button><button onClick={startGame} className={primaryButton()}>Play Again</button></div>
            </motion.div>
          </motion.div>}

          {showGuide && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 grid place-items-center bg-midnight/95 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 8 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 340, damping: 28 }} className="w-full max-w-[260px] rounded-2xl border border-line bg-surface p-4">
              <h2 className="text-sm font-semibold text-white">How to Play</h2>
              <ol className="mt-3 space-y-2">{guideSteps.map((step, index) => <li key={step} className="flex items-start gap-2 text-[11px] leading-5 text-muted"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[10px] font-semibold text-[#81b0ff]">{index + 1}</span>{step}</li>)}</ol>
              <div className="mt-4 flex flex-col gap-2">
                <button onClick={() => setShowGuide(false)} className={primaryButton('w-full')}>Start Playing</button>
                <button onClick={() => { setShowGuide(false); void saveGuideDismissed(true) }} className={ghostButton('w-full')}>Don't Show Again</button>
              </div>
            </motion.div>
          </motion.div>}
        </AnimatePresence>
      </div>

      <p className="mt-3 text-center text-[10px] text-muted">Tap the glowing dot as fast as you can</p>
    </div>
  </div>
}
