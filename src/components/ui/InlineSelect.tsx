import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function InlineSelect({ value, options, onChange, placeholder }: { value: string; options: { value: string; label: string }[]; onChange: (value: string) => void; placeholder: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const current = options.find(option => option.value === value)
  return <div ref={ref} className="relative">
    <button type="button" onClick={() => setOpen(current => !current)} aria-expanded={open} className="flex min-h-[42px] w-full items-center gap-1.5 rounded-xl border border-line bg-card px-3 py-2 text-left text-[13px] transition-all duration-200 hover:border-primary/45 focus:outline-none focus:ring-4 focus:ring-primary/10">
      <span className={`min-w-0 flex-1 truncate ${current?.value ? 'text-[#E6E8F0]' : 'text-muted/65'}`}>{current?.label || placeholder}</span>
      <ChevronDown size={15} className={`shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {open && <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.15, ease: 'easeOut' }} className="absolute z-30 mt-1.5 max-h-48 w-full origin-top overflow-y-auto rounded-xl border border-line bg-surface p-1.5 shadow-2xl shadow-black/35">
        {options.map(option => <button key={option.value || 'all'} type="button" onClick={() => { onChange(option.value); setOpen(false) }} className={`flex w-full items-center rounded-lg px-2.5 py-2 text-left text-xs transition hover:bg-white/[.055] ${value === option.value ? 'bg-primary/10 text-[#81b0ff]' : 'text-[#E6E8F0]'}`}>{option.label}</button>)}
      </motion.div>}
    </AnimatePresence>
  </div>
}
