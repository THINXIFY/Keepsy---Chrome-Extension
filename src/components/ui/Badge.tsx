import type { ReactNode } from 'react'
import type { LabelColor } from '../../lib/colorLabels'

export function Badge({ children, tone = 'default', color }: { children: ReactNode; tone?: 'default' | 'blue'; color?: LabelColor }) {
  if (color) return <span className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium tracking-[.01em]" style={{ borderColor: color.border, backgroundColor: color.bg, color: color.text }}>{children}</span>
  return <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium tracking-[.01em] ${tone === 'blue' ? 'border-primary/25 bg-primary/10 text-[#81b0ff]' : 'border-white/[.06] bg-white/[.035] text-muted'}`}>{children}</span>
}
