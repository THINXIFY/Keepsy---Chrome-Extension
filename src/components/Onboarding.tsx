import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Search, Tag } from 'lucide-react'
import { Button } from './ui/Button'

const features = [
  { icon: Download, title: 'Save Anything', detail: 'Quickly save websites, YouTube videos, emails, notes, wallets, code, and more.' },
  { icon: Tag, title: 'Stay Organized', detail: 'Organize everything with Collections, Categories, Tags, Favorites, and Search.' },
  { icon: Search, title: 'Find Instantly', detail: 'Use powerful search and filters to find anything in seconds.' },
]

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 36 : -36, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -36 : 36, opacity: 0 }),
}
const stepTransition = { type: 'spring' as const, stiffness: 340, damping: 32 }

function Mark() {
  return <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl shadow-[0_10px_28px_rgba(0,87,255,.32)]">
    <img src="/icon128.png" alt="Keepsy" className="size-full object-cover" />
  </div>
}

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = (next: number) => { setDirection(next > step ? 1 : -1); setStep(next) }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'Enter') { event.preventDefault(); step < 2 ? go(step + 1) : onDone() }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); if (step > 0) go(step - 1) }
      else if (event.key === 'Escape') { event.preventDefault(); onDone() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [step])

  return <div className="absolute inset-0 z-40 flex flex-col bg-midnight">
    <div className="flex items-center justify-center gap-1.5 pt-6">
      {[0, 1, 2].map(i => <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : i < step ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-line'}`} />)}
    </div>

    <div className="relative min-h-0 flex-1 overflow-hidden px-6">
      <AnimatePresence mode="wait" custom={direction}>
        {step === 0 && <motion.div key="0" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={stepTransition} className="flex h-full flex-col items-center justify-center text-center">
          <Mark />
          <h1 className="mt-5 text-[19px] font-semibold leading-tight tracking-[-.02em] text-white">Welcome to Keepsy</h1>
          <p className="mt-2.5 max-w-[270px] text-[13px] leading-[1.4] text-muted">Save emails, links, notes, wallets, code, and more—all in one secure place.</p>
        </motion.div>}

        {step === 1 && <motion.div key="1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={stepTransition} className="flex h-full flex-col justify-center">
          <h2 className="text-center text-[17px] font-semibold leading-tight tracking-[-.02em] text-white">How Keepsy Works</h2>
          <div className="mt-5 space-y-2.5">
            {features.map((feature, index) => <motion.div key={feature.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 * index, duration: 0.25, ease: 'easeOut' }} className="flex items-start gap-3 rounded-panel border border-line bg-surface p-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-[#81b0ff]"><feature.icon size={16} strokeWidth={1.8} /></div>
              <div className="min-w-0"><p className="text-[13px] font-medium leading-tight text-[#E6E8F0]">{feature.title}</p><p className="mt-1 text-[11px] leading-[1.35] text-muted">{feature.detail}</p></div>
            </motion.div>)}
          </div>
        </motion.div>}

        {step === 2 && <motion.div key="2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={stepTransition} className="flex h-full flex-col items-center justify-center text-center">
          <Mark />
          <h1 className="mt-5 text-[19px] font-semibold leading-tight tracking-[-.02em] text-white">You're All Set!</h1>
          <p className="mt-2.5 max-w-[270px] text-[13px] leading-[1.4] text-muted">Start saving your important information with Keepsy.</p>
        </motion.div>}
      </AnimatePresence>
    </div>

    <div className="px-6 pb-7 pt-3">
      {step === 0 && <div className="flex flex-col gap-2.5"><Button onClick={() => go(1)} className="w-full py-3">Get Started</Button><Button variant="ghost" onClick={onDone} className="w-full">Skip</Button></div>}
      {step === 1 && <div className="flex gap-2.5"><Button variant="ghost" onClick={() => go(0)} className="flex-1">Back</Button><Button onClick={() => go(2)} className="flex-1">Next</Button></div>}
      {step === 2 && <div className="flex flex-col items-center gap-3"><Button onClick={onDone} className="w-full py-3">Start Using Keepsy</Button><button onClick={() => go(1)} className="text-[11px] font-medium text-[#81b0ff] transition hover:text-white">View Quick Guide</button></div>}
    </div>
  </div>
}
