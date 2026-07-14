import { X } from 'lucide-react'
import type { KeepsyItem } from '../types'
import { EmptyState } from './EmptyState'

export function CustomIconsGallery({ items, onRemove }: { items: KeepsyItem[]; onRemove: (id: string) => void }) {
  if (items.length === 0) return <EmptyState title="No custom icons yet" detail="Icons you upload for saved items will show up here." />
  return <div className="max-h-[400px] space-y-1.5 overflow-y-auto">
    {items.map(item => <div key={item.id} className="flex items-center gap-3 rounded-xl border border-line bg-card p-2.5">
      <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg"><img src={item.customIcon} alt="" className="size-full object-cover" /></div>
      <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-[#E6E8F0]">{item.title}</p><p className="mt-0.5 text-[10px] text-muted">{item.type}</p></div>
      <button onClick={() => onRemove(item.id)} aria-label={`Remove custom icon from ${item.title}`} title="Remove custom icon" className="grid size-7 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-[#ff5577]/10 hover:text-[#ff8ca7] focus:outline-none focus:ring-2 focus:ring-primary"><X size={14} /></button>
    </div>)}
  </div>
}
