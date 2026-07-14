import { useEffect, useRef, useState } from 'react'
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
    <button type="button" onClick={() => setOpen(current => !current)} aria-expanded={open} className="flex w-full items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 py-2 text-left text-xs transition hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary">
      <span className={`min-w-0 flex-1 truncate ${current?.value ? 'text-[#E6E8F0]' : 'text-muted/65'}`}>{current?.label || placeholder}</span>
      <ChevronDown size={13} className={`shrink-0 text-muted transition ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div className="absolute z-30 mt-1.5 max-h-48 w-full overflow-y-auto rounded-xl border border-line bg-surface p-1.5 shadow-2xl shadow-black/35">
      {options.map(option => <button key={option.value || 'all'} type="button" onClick={() => { onChange(option.value); setOpen(false) }} className={`flex w-full items-center rounded-lg px-2.5 py-2 text-left text-xs transition hover:bg-white/[.055] ${value === option.value ? 'bg-primary/10 text-[#81b0ff]' : 'text-[#E6E8F0]'}`}>{option.label}</button>)}
    </div>}
  </div>
}
