import { FolderHeart } from 'lucide-react'

export function EmptyState({ title = 'Nothing saved here yet', detail = 'Your next great find is waiting to be saved.' }: { title?: string; detail?: string }) {
  return <div className="rounded-panel border border-dashed border-line bg-card/60 px-6 py-10 text-center"><div className="mx-auto grid size-11 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-[#7eaeff]"><FolderHeart size={19} strokeWidth={1.7} /></div><h3 className="mt-3 text-sm font-medium tracking-[-.01em] text-[#E6E8F0]">{title}</h3><p className="mx-auto mt-1 max-w-[230px] text-xs leading-5 text-muted">{detail}</p></div>
}
