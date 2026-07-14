import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Gamepad2, Sparkles } from 'lucide-react'
import { loadBestScore } from './tap-the-dot/storage'

export default function GamesHub({ onClose, onPlayTapTheDot }: { onClose: () => void; onPlayTapTheDot: () => void }) {
  const [bestTapTheDot, setBestTapTheDot] = useState<number | null>(null)

  useEffect(() => { loadBestScore().then(setBestTapTheDot) }, [])

  return <div className="absolute inset-0 z-30 flex flex-col bg-midnight">
    <header className="flex items-center gap-2 px-4 pb-3 pt-4"><button onClick={onClose} aria-label="Back" className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-white/[.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"><ArrowLeft size={18} /></button><Gamepad2 size={18} strokeWidth={1.8} className="text-[#81b0ff]" /><h1 className="text-[15px] font-semibold tracking-[-.02em] text-white">Mini Games</h1></header>

    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-6">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="rounded-panel border border-line bg-surface p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-card shadow-[0_8px_20px_rgba(0,87,255,.18)]"><img src="/game-logo-dot.png" alt="Tap the Dot" className="size-full object-contain p-1.5" /></div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5"><h3 className="text-sm font-semibold text-white">Tap the Dot</h3><span className="rounded-md border border-line bg-card px-1.5 py-0.5 text-[9px] font-medium text-muted">Easy</span></div>
            <p className="mt-1 text-[11px] leading-4 text-muted">Tap as many blue dots as possible in 30 seconds.</p>
            <p className="mt-2 text-[10px] text-muted">Best score: <span className="font-semibold text-[#E6E8F0]">{bestTapTheDot === null ? '—' : bestTapTheDot}</span></p>
          </div>
        </div>
        <button onClick={onPlayTapTheDot} className="mt-3 w-full rounded-xl bg-gradient-to-b from-primary to-secondary py-2.5 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.14)] transition hover:brightness-110 active:scale-[.98]">Play</button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: 0.04 }} className="rounded-panel border border-dashed border-line bg-card/40 p-4 text-center">
        <div className="mx-auto grid size-10 place-items-center rounded-xl bg-white/[.04] text-muted"><Sparkles size={16} strokeWidth={1.8} /></div>
        <p className="mt-2 text-xs font-medium text-muted">More games coming soon</p>
      </motion.div>
    </div>
  </div>
}
