import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const dialog = useRef<HTMLElement>(null)
  useEffect(() => { if (open) dialog.current?.focus() }, [open])
  return <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex items-end bg-black/75 p-3 backdrop-blur-sm" onClick={onClose} onKeyDown={e => e.key === 'Escape' && onClose()}>
    <motion.section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }} transition={{ duration: .18, ease: 'easeOut' }} className="max-h-full w-full overflow-y-auto rounded-panel border border-line bg-surface p-5 shadow-2xl shadow-black/40 focus:outline-none" onClick={(event) => event.stopPropagation()}>
      <header className="mb-5 flex items-center justify-between"><h2 className="text-[15px] font-semibold tracking-[-.02em] text-white">{title}</h2><button onClick={onClose} aria-label="Close dialog" className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-white/[.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"><X size={17} /></button></header>{children}
    </motion.section>
  </motion.div>}</AnimatePresence>
}
