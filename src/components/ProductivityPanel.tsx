import { Download, Filter, Upload } from 'lucide-react'
import type { ItemType, SortMode } from '../types'
import { Button } from './ui/Button'
import { InlineSelect } from './ui/InlineSelect'

export function ProductivityPanel({ open, types, categories, tags, type, category, tag, favorite, pinned, sort, onChange, onImport, onExport }: { open: boolean; types: ItemType[]; categories: string[]; tags: string[]; type: string; category: string; tag: string; favorite: boolean; pinned: boolean; sort: SortMode; onChange: (value: Partial<{ type: string; category: string; tag: string; favorite: boolean; pinned: boolean; sort: SortMode }>) => void; onImport: (file: File) => void; onExport: () => void }) {
  if (!open) return null
  const typeOptions = [{ value: '', label: 'All types' }, ...types.map(value => ({ value, label: value }))]
  const categoryOptions = [{ value: '', label: 'All categories' }, ...categories.map(value => ({ value, label: value }))]
  const tagOptions = [{ value: '', label: 'All tags' }, ...tags.map(value => ({ value, label: value }))]
  const sortOptions = [{ value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' }, { value: 'updated', label: 'Recently updated' }, { value: 'az', label: 'A-Z' }]
  return <div className="mt-3 rounded-panel border border-line bg-surface p-3">
    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#E6E8F0]"><Filter size={14} className="text-[#81b0ff]" />Filters & sorting</div>
    <div className="grid grid-cols-2 gap-2">
      <InlineSelect value={type} options={typeOptions} onChange={value => onChange({ type: value })} placeholder="All types" />
      <InlineSelect value={category} options={categoryOptions} onChange={value => onChange({ category: value })} placeholder="All categories" />
      <InlineSelect value={tag} options={tagOptions} onChange={value => onChange({ tag: value })} placeholder="All tags" />
      <InlineSelect value={sort} options={sortOptions} onChange={value => onChange({ sort: value as SortMode })} placeholder="Sort" />
    </div>
    <div className="mt-2 flex items-center gap-2">
      <button onClick={() => onChange({ favorite: !favorite })} className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition focus:outline-none focus:ring-2 focus:ring-primary ${favorite ? 'border-primary bg-primary/10 text-[#81b0ff]' : 'border-line text-muted hover:text-white'}`}>Favorites</button>
      <button onClick={() => onChange({ pinned: !pinned })} className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition focus:outline-none focus:ring-2 focus:ring-primary ${pinned ? 'border-primary bg-primary/10 text-[#81b0ff]' : 'border-line text-muted hover:text-white'}`}>Pinned</button>
      <Button variant="ghost" onClick={onExport} className="ml-auto px-2 py-1 text-[11px]"><Download size={13} />Export</Button>
      <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-muted transition hover:bg-white/[.05] hover:text-white"><Upload size={13} />Import<input type="file" accept="application/json" className="hidden" onChange={e => e.target.files?.[0] && onImport(e.target.files[0])} /></label>
    </div>
  </div>
}
