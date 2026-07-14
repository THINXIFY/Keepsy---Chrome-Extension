import { motion } from 'framer-motion'

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label?: string }) {
  return <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${checked ? 'border-primary/60 bg-primary/40' : 'border-line bg-card'}`}
  >
    <motion.span
      layout
      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      className={`absolute top-0.5 size-5 rounded-full shadow-sm ${checked ? 'left-[18px] bg-white' : 'left-0.5 bg-muted'}`}
    />
  </button>
}
