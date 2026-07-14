import { useMemo, useRef, useState, useEffect } from 'react'
import { Check, ChevronDown, Layers3, Plus, Search, X } from 'lucide-react'
import type { KeepsyCollection } from '../types'

type Props = {
  collections: KeepsyCollection[]
  value: string[]
  onChange: (ids: string[]) => void
  onCreate: (name: string) => Promise<KeepsyCollection>
  suggestedIds?: string[]
  label?: string
}

export function CollectionSelect({ collections, value, onChange, onCreate, suggestedIds = [], label = 'Collections' }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [busy, setBusy] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const results = useMemo(() => [...collections]
    .filter(collection => collection.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    .sort((a, b) => {
      const suggested = Number(suggestedIds.includes(b.id)) - Number(suggestedIds.includes(a.id))
      return suggested || (b.lastUsedAt || '').localeCompare(a.lastUsedAt || '') || a.name.localeCompare(b.name)
    }), [collections, query, suggestedIds])

  const toggle = (id: string) => onChange(value.includes(id) ? value.filter(collectionId => collectionId !== id) : [...value, id])
  const create = async () => {
    if (!newName.trim() || busy) return
    setBusy(true)
    try {
      const collection = await onCreate(newName)
      if (!value.includes(collection.id)) onChange([...value, collection.id])
      setNewName('')
      setQuery('')
      setCreating(false)
    } finally { setBusy(false) }
  }

  const exactMatch = collections.some(collection => collection.name.toLocaleLowerCase() === query.trim().toLocaleLowerCase())
  const selectedCollections = value.map(id => collections.find(collection => collection.id === id)).filter((collection): collection is KeepsyCollection => !!collection)

  return <div ref={ref} className="relative">
    <span className="block text-[11px] font-medium text-muted">{label}</span>
    <button type="button" onClick={() => setOpen(current => !current)} aria-expanded={open} className="mt-1 flex min-h-[42px] w-full items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 text-left text-[13px] transition hover:border-primary/45 focus:outline-none focus:ring-4 focus:ring-primary/10">
      <Layers3 size={14} className="shrink-0 text-[#81b0ff]" /><span className={value.length ? 'min-w-0 flex-1 truncate text-[#E6E8F0]' : 'min-w-0 flex-1 truncate text-muted/65'}>{value.length ? `${value.length} collection${value.length === 1 ? '' : 's'} selected` : 'Choose collections'}</span><ChevronDown size={15} className={`text-muted transition ${open ? 'rotate-180' : ''}`} />
    </button>
    {selectedCollections.length > 0 && <div className="mt-1.5 flex flex-wrap gap-1">{selectedCollections.map(collection => <button type="button" key={collection.id} onClick={() => toggle(collection.id)} className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] text-[#81b0ff]">{collection.name}<X size={10} /></button>)}</div>}
    {open && <div className="absolute z-40 mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-surface p-2 shadow-2xl shadow-black/35">
      <label className="flex items-center gap-2 rounded-lg border border-line bg-card px-2.5 py-2"><Search size={14} className="text-muted" /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search collections..." className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted/60" /></label>
      <div className="mt-1 max-h-36 overflow-y-auto">{results.map(collection => <button type="button" key={collection.id} onClick={() => toggle(collection.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-[#E6E8F0] transition hover:bg-white/[.055]"><span className={value.includes(collection.id) ? 'grid size-4 place-items-center rounded border border-primary bg-primary text-white' : 'grid size-4 place-items-center rounded border border-line'}>{value.includes(collection.id) && <Check size={11} />}</span><span className="min-w-0 flex-1 truncate">{collection.name}</span>{suggestedIds.includes(collection.id) && <span className="text-[9px] text-[#81b0ff]">Suggested</span>}</button>)}{!results.length && !query.trim() && <p className="px-2 py-3 text-center text-[10px] text-muted">No collections yet.</p>}{query.trim() && !exactMatch && <button type="button" onClick={() => { setNewName(query.trim()); setCreating(true) }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-[#81b0ff] hover:bg-primary/10"><Plus size={14} />Create “{query.trim()}”</button>}</div>
      <div className="mt-1 border-t border-line pt-1">{creating ? <div className="flex gap-1"><input autoFocus value={newName} onChange={event => setNewName(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); void create() } }} placeholder="New collection name" className="min-w-0 flex-1 rounded-lg border border-line bg-card px-2 py-1.5 text-xs outline-none focus:border-primary/70" /><button type="button" onClick={() => { void create() }} disabled={!newName.trim() || busy} className="rounded-lg bg-primary px-2 py-1 text-[10px] font-medium text-white disabled:opacity-40">Add</button></div> : <button type="button" onClick={() => setCreating(true)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#81b0ff] hover:bg-primary/10"><Plus size={14} />Create New Collection</button>}</div>
    </div>}
  </div>
}
