import { useEffect, useRef, useState } from 'react'
import {
  Check,
  Copy,
  ExternalLink,
  Heart,
  Layers3,
  MoreVertical,
  Pencil,
  Pin,
  Trash2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { KeepsyItem } from '../types'
import { Badge } from './ui/Badge'
import { BrandIcon } from './BrandIcon'
import { ItemIcon } from './ItemIcon'
import { labelColor } from '../lib/colorLabels'
import { domainFromUrl } from '../lib/specialized'

type Props = {
  item: KeepsyItem
  index: number
  collectionNames: string[]
  onView: () => void
  onCopy: () => void
  onOpen: () => void
  onToggle: (field: 'favorite' | 'pinned') => void
  onEditCollections: () => void
  onEdit: () => void
  onDelete: () => void
  selected?: boolean
  onSelect?: () => void
  compact?: boolean
}

export function SaveItemCard({ item, index, collectionNames, onView, onCopy, onOpen, onToggle, onEditCollections, onEdit, onDelete, selected, onSelect, compact }: Props) {
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const summary = item.type === 'API Key'
    ? '•'.repeat(16)
    : item.type === 'Code'
      ? `${item.language || 'Code'} snippet`
      : item.type === 'Website' && item.url
        ? domainFromUrl(item.url)
        : item.type === 'YouTube' && item.youtubeChannel
          ? item.youtubeChannel
          : item.url || item.email || item.phone || item.walletAddress || item.content || item.code || 'Custom item'

  useEffect(() => {
    if (!moreOpen) return
    const close = (event: MouseEvent) => { if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [moreOpen])

  const actionsShown = moreOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-1 opacity-0 pointer-events-none group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto'

  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: index * 0.025 }}
      className={`group relative flex items-center gap-3 rounded-panel border bg-card shadow-[0_1px_2px_rgba(0,0,0,.14)] transition-all duration-200 hover:border-[#2B7FFF]/45 hover:bg-[#141924] hover:shadow-[0_10px_24px_rgba(0,0,0,.2)] ${compact ? 'px-2.5 py-2' : 'px-3.5 py-3'} ${selected ? 'border-primary/80 bg-primary/[.06]' : 'border-line'}`}
    >
      {onSelect && (
        <button
          type="button"
          onClick={onSelect}
          aria-label={selected ? `Deselect ${item.title}` : `Select ${item.title}`}
          aria-pressed={selected}
          className={`grid size-4 shrink-0 place-items-center rounded border transition ${selected ? 'border-primary bg-primary text-white' : 'border-line text-transparent hover:border-primary/70'}`}
        >
          {selected && <Check size={11} strokeWidth={2.5} />}
        </button>
      )}

      <button
        onClick={onView}
        className={`grid shrink-0 place-items-center overflow-hidden rounded-xl transition hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-primary ${compact ? 'size-9' : 'size-11'}`}
        aria-label={`View ${item.title}`}
      >
        <ItemIcon item={item} className="size-full" />
      </button>

      <button onClick={onView} className="min-w-0 flex-1 text-left focus:outline-none">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-[13px] font-medium leading-5 text-[#E6E8F0]">{item.title}</h3>
          {item.pinned && <Pin size={11} className="shrink-0 text-[#75a4ff]" />}
        </div>
        {!compact && <p className="mt-0.5 truncate text-[11px] leading-4 text-muted">{summary}</p>}
        <div className={`flex items-center gap-1.5 ${compact ? 'mt-1' : 'mt-1.5'}`}>
          <Badge tone="blue">{item.type}</Badge>
          {item.walletNetwork && <span title={`${item.walletNetwork} network`}><BrandIcon network={item.walletNetwork} className="size-3.5" /></span>}
          {collectionNames.slice(0, 2).map(name => <Badge key={name} color={labelColor(name)}><Layers3 size={10} /><span className="max-w-[64px] truncate">{name}</span></Badge>)}
          {collectionNames.length > 2 && <Badge>+{collectionNames.length - 2}</Badge>}
          {collectionNames.length === 0 && <Badge color={labelColor(item.category)}><span className="max-w-[96px] truncate">{item.category}</span></Badge>}
        </div>
      </button>

      <div className={`absolute right-2 top-1/2 z-10 -translate-y-1/2 transition-all duration-200 ${actionsShown}`}>
        <div className="flex items-center gap-0.5 rounded-xl border border-line bg-surface/95 p-0.5 shadow-lg shadow-black/30 backdrop-blur-sm">
          <button
            onClick={onEditCollections}
            className="grid size-7 place-items-center rounded-lg text-muted transition hover:bg-white/[.07] hover:text-[#81b0ff] focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`Edit collections for ${item.title}`}
            title="Quick edit Collections"
          >
            <Layers3 size={14} />
          </button>
          <button onClick={() => onToggle('pinned')} className={`grid size-7 place-items-center rounded-lg transition hover:bg-white/[.07] focus:outline-none focus:ring-2 focus:ring-primary ${item.pinned ? 'text-[#75a4ff]' : 'text-muted'}`} aria-label={item.pinned ? 'Unpin item' : 'Pin item'}><Pin size={14} fill={item.pinned ? 'currentColor' : 'none'} /></button>
          <button onClick={() => onToggle('favorite')} className={`grid size-7 place-items-center rounded-lg transition hover:bg-white/[.07] focus:outline-none focus:ring-2 focus:ring-primary ${item.favorite ? 'text-[#ff8ca7]' : 'text-muted'}`} aria-label={item.favorite ? 'Remove favorite' : 'Add favorite'}><Heart size={14} fill={item.favorite ? 'currentColor' : 'none'} /></button>
          <button onClick={onCopy} className="grid size-7 place-items-center rounded-lg text-muted transition hover:bg-white/[.07] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary" aria-label={`Copy ${item.title}`}><Copy size={14} /></button>
          {item.url && <button onClick={onOpen} className="grid size-7 place-items-center rounded-lg text-muted transition hover:bg-white/[.07] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary" aria-label={`Open ${item.title}`}><ExternalLink size={14} /></button>}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(value => !value)}
              className={`grid size-7 place-items-center rounded-lg transition hover:bg-white/[.07] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary ${moreOpen ? 'bg-white/[.07] text-white' : 'text-muted'}`}
              aria-label="More actions"
              aria-expanded={moreOpen}
            >
              <MoreVertical size={14} />
            </button>
            {moreOpen && <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-2xl shadow-black/40">
              <button onClick={() => { setMoreOpen(false); onEdit() }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#E6E8F0] transition hover:bg-white/[.06]"><Pencil size={13} />Edit</button>
              <button onClick={() => { setMoreOpen(false); onDelete() }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#ff9fb5] transition hover:bg-[#ff5577]/10"><Trash2 size={13} />Delete</button>
            </div>}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
