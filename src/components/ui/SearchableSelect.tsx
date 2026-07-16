import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Folder, Plus, Search, Tag, Trash2, X } from 'lucide-react'
import { addTaxonomy, loadTaxonomy, removeTaxonomy, type Taxonomy } from '../../lib/taxonomy'
import { labelColor } from '../../lib/colorLabels'

type Props = {
  kind: keyof Taxonomy
  label: string
  value: string | string[]
  onChange: (value: string | string[]) => void
  placeholder: string
  suggested?: string[]
  multiple?: boolean
}

const same = (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase()

export function SearchableSelect({ kind, label, value, onChange, placeholder, suggested = [], multiple = false }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = multiple ? value as string[] : [value as string]
  const createLabel = multiple ? 'Create New Tag' : 'Create New Category'

  const refresh = async () => {
    const taxonomy = await loadTaxonomy()
    setOptions(taxonomy[kind])
  }

  useEffect(() => { void refresh() }, [kind])
  useEffect(() => {
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const results = useMemo(() => options
    .filter(option => option.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    .sort((a, b) => Number(suggested.some(item => same(item, b))) - Number(suggested.some(item => same(item, a)))), [options, query, suggested])

  const choose = (option: string) => {
    if (multiple) onChange(selected.some(item => same(item, option)) ? selected.filter(item => !same(item, option)) : [...selected, option])
    else { onChange(option); setOpen(false); setQuery('') }
  }

  const create = async (name: string) => {
    if (!name.trim() || busy) return
    setBusy(true)
    try {
      const result = await addTaxonomy(kind, name)
      if (!result) return
      await refresh()
      if (multiple) {
        if (!selected.some(item => same(item, result))) onChange([...selected, result])
      } else onChange(result)
      setQuery('')
      setNewName('')
      setCreating(false)
      if (!multiple) setOpen(false)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (option: string) => {
    if (busy) return
    setBusy(true)
    try {
      await removeTaxonomy(kind, option)
      await refresh()
      if (multiple && selected.some(item => same(item, option))) onChange(selected.filter(item => !same(item, option)))
      if (!multiple && selected[0] && same(selected[0], option)) onChange('')
    } finally {
      setBusy(false)
    }
  }

  const exactMatch = options.some(option => same(option, query.trim()))
  const LeadingIcon = kind === 'tags' ? Tag : Folder
  const hasSelection = selected.filter(Boolean).length > 0
  return <div ref={ref} className="relative">
    <span className="block text-[11px] font-medium text-muted">{label}</span>
    <div role="button" tabIndex={0} onClick={() => setOpen(current => !current)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setOpen(current => !current) } }} aria-expanded={open} className="mt-1 flex min-h-[42px] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-xl border border-line bg-card px-3 py-2 text-left text-[13px] transition hover:border-primary/45 focus:outline-none focus:ring-4 focus:ring-primary/10">
      <LeadingIcon size={14} className="shrink-0 text-muted" />
      {multiple
        ? hasSelection
          ? <div className="flex min-w-0 flex-1 flex-wrap gap-1 py-0.5">{selected.map(tag => <span key={tag} className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[11px] text-[#81b0ff]">{tag}<button type="button" onClick={event => { event.stopPropagation(); choose(tag) }} aria-label={`Remove ${tag}`} className="rounded-sm transition hover:text-white"><X size={10} /></button></span>)}</div>
          : <span className="min-w-0 flex-1 truncate text-muted/65">{placeholder}</span>
        : <span className="flex min-w-0 flex-1 items-center gap-1.5">{kind === 'categories' && hasSelection && <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: labelColor(selected[0]).text }} />}<span className={hasSelection ? 'min-w-0 flex-1 truncate text-[#E6E8F0]' : 'min-w-0 flex-1 truncate text-muted/65'}>{selected[0] || placeholder}</span></span>}
      <ChevronDown size={15} className={open ? 'shrink-0 rotate-180 text-muted transition' : 'shrink-0 text-muted transition'} />
    </div>
    <AnimatePresence>
      {open && <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.15, ease: 'easeOut' }} className="absolute z-30 mt-1.5 w-full origin-top overflow-hidden rounded-xl border border-line bg-surface p-2 shadow-2xl shadow-black/35">
        <label className="flex items-center gap-2 rounded-lg border border-line bg-card px-2.5 py-2 transition focus-within:border-primary/60"><Search size={14} className="text-muted" /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${label.toLowerCase()}...`} className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted/60" /></label>
        <div className="mt-1 max-h-32 overflow-y-auto">
          {results.map(option => <div key={option} className="group flex items-center rounded-lg transition hover:bg-white/[.055]">
            <button type="button" onClick={() => choose(option)} className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2 text-left text-xs text-[#E6E8F0]">
              <span className={selected.some(item => same(item, option)) ? 'grid size-4 place-items-center rounded border border-primary bg-primary text-white' : 'grid size-4 place-items-center rounded border border-line'}>{selected.some(item => same(item, option)) && <Check size={11} />}</span>
              {kind === 'categories' && <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: labelColor(option).text }} />}
              <span className="flex-1 truncate">{option}</span>
              {suggested.some(item => same(item, option)) && <span className="text-[9px] text-[#81b0ff]">Suggested</span>}
            </button>
            <button type="button" onClick={() => { void remove(option) }} title={`Delete ${option}`} aria-label={`Delete ${option}`} className="mr-1 grid size-7 shrink-0 place-items-center rounded-md text-muted/60 opacity-50 transition hover:bg-[#ff5577]/10 hover:text-[#ff8ca7] hover:opacity-100 group-hover:opacity-100 focus:opacity-100"><Trash2 size={12} /></button>
          </div>)}
          {!results.length && !query.trim() && <p className="px-2.5 py-3 text-center text-[10px] text-muted">No saved {multiple ? 'tags' : 'categories'} yet.</p>}
          {query.trim() && exactMatch && <p className="px-2.5 py-2 text-[10px] text-muted/70">Already exists — select it above.</p>}
          {query.trim() && !exactMatch && <button type="button" onClick={() => { void create(query) }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-[#81b0ff] transition hover:bg-primary/10"><Plus size={14} />{createLabel}: {query.trim()}</button>}
        </div>
        <div className="mt-1 border-t border-line pt-1">
          {creating ? <div className="flex gap-1"><input autoFocus value={newName} onChange={event => setNewName(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); void create(newName) } }} placeholder={`New ${multiple ? 'tag' : 'category'} name`} className="min-w-0 flex-1 rounded-lg border border-line bg-card px-2 py-1.5 text-xs outline-none focus:border-primary/70" /><button type="button" onClick={() => { void create(newName) }} disabled={!newName.trim() || busy} className="rounded-lg bg-primary px-2 py-1 text-[10px] font-medium text-white disabled:opacity-40">Add</button></div> : <button type="button" onClick={() => setCreating(true)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#81b0ff] transition hover:bg-primary/10"><Plus size={14} />{createLabel}</button>}
        </div>
      </motion.div>}
    </AnimatePresence>
  </div>
}
