import type { LucideIcon } from 'lucide-react'

export function CounterCard({ icon: Icon, label, count, active, onClick }: { icon: LucideIcon; label: string; count: number; active?: boolean; onClick?: () => void }) {
  return <button onClick={onClick} className={`group flex min-w-0 flex-1 flex-col rounded-2xl border p-3 text-left transition duration-200 ${active ? 'border-primary/60 bg-primary/10' : 'border-line bg-card hover:border-primary/45 hover:bg-[#202a4f]'}`}>
    <div className={`mb-3 grid size-7 place-items-center rounded-lg ${active ? 'bg-primary/20 text-[#9eb4ff]' : 'bg-white/[.06] text-muted group-hover:text-white'}`}><Icon size={14} /></div>
    <span className="text-lg font-semibold tracking-[-.04em]">{count}</span><span className="mt-0.5 text-[10px] font-medium text-muted">{label}</span>
  </button>
}
