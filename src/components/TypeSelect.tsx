import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { itemTypes, type ItemType } from '../types'
import { typeIcons } from '../lib/typeIcons'

export function TypeSelect({ value, onChange }: { value: ItemType; onChange: (value: ItemType) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return <div ref={ref} className="relative">
    <span className="block text-[11px] font-medium text-muted">Type</span>
    <button type="button" onClick={() => setOpen(current => !current)} aria-expanded={open} className="mt-1 flex min-h-[42px] w-full items-center gap-2.5 rounded-xl border border-line bg-card px-3 py-2 text-left text-[13px] transition-all duration-200 hover:border-primary/45 focus:outline-none focus:ring-4 focus:ring-primary/10">
      <img src={typeIcons[value]} alt="" className="size-5 shrink-0 object-contain" />
      <span className="min-w-0 flex-1 truncate text-[#E6E8F0]">{value}</span>
      <ChevronDown size={15} className={`shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {open && <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.15, ease: 'easeOut' }} className="absolute z-30 mt-1.5 max-h-56 w-full origin-top overflow-y-auto rounded-xl border border-line bg-surface p-1.5 shadow-2xl shadow-black/35">
        {itemTypes.map(type => <button key={type} type="button" onClick={() => { onChange(type); setOpen(false) }} className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition hover:bg-white/[.055] ${type === value ? 'bg-primary/10 text-[#81b0ff]' : 'text-[#E6E8F0]'}`}>
          <img src={typeIcons[type]} alt="" className="size-5 shrink-0 object-contain" />
          <span className="flex-1 truncate">{type}</span>
        </button>)}
      </motion.div>}
    </AnimatePresence>
  </div>
}
