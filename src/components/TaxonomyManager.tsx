import { useState } from 'react'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { EmptyState } from './EmptyState'
import { labelColor } from '../lib/colorLabels'

type Props = {
  noun: string
  items: string[]
  counts: Record<string, number>
  onCreate: (name: string) => Promise<void>
  onRename: (oldName: string, newName: string) => Promise<void>
  onDelete: (name: string) => Promise<void>
  deleteNote?: (name: string) => string
  showColor?: boolean
}

export function TaxonomyManager({ noun, items, counts, onCreate, onRename, onDelete, deleteNote, showColor }: Props) {
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const create = async () => { if (!newName.trim() || busy) return; setBusy(true); try { await onCreate(newName); setNewName(''); setError('') } catch (reason) { setError((reason as Error).message) } finally { setBusy(false) } }
  const rename = async () => { if (!editing || busy) return; setBusy(true); try { await onRename(editing, editName); setEditing(null); setError('') } catch (reason) { setError((reason as Error).message) } finally { setBusy(false) } }
  const remove = async (name: string) => { if (busy) return; setBusy(true); try { await onDelete(name); setConfirmDelete(null) } finally { setBusy(false) } }

  return <div className="space-y-4">
    <div className="flex gap-2"><input value={newName} onChange={event => setNewName(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); void create() } }} placeholder={`New ${noun.toLowerCase()} name`} className="min-w-0 flex-1 rounded-xl border border-line bg-card px-3 py-2.5 text-xs outline-none transition focus:border-primary/70 focus:ring-4 focus:ring-primary/10" /><button type="button" disabled={!newName.trim() || busy} onClick={() => { void create() }} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-medium text-white transition hover:brightness-110 disabled:opacity-40"><Plus size={14} />Add</button></div>
    {error && <p role="alert" className="text-xs text-[#ff9fb5]">{error}</p>}
    {items.length === 0 ? <EmptyState title={`No ${noun.toLowerCase()}s yet`} detail={`Create your first ${noun.toLowerCase()} to start organizing saved items.`} /> : <div className="max-h-[350px] space-y-1.5 overflow-y-auto">{items.map(name => <div key={name} className="rounded-xl border border-line bg-card p-2.5">
      <div className="flex items-center gap-2">{editing === name ? <><input autoFocus value={editName} onChange={event => setEditName(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); void rename() } }} className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-2 py-1.5 text-xs outline-none focus:border-primary/70" /><button onClick={() => { void rename() }} aria-label={`Save ${name}`} className="grid size-7 place-items-center rounded-lg text-[#81b0ff] transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"><Check size={14} /></button><button onClick={() => setEditing(null)} aria-label="Cancel rename" className="grid size-7 place-items-center rounded-lg text-muted transition hover:bg-white/[.05] focus:outline-none focus:ring-2 focus:ring-primary"><X size={14} /></button></> : <>{showColor && <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: labelColor(name).text }} />}<div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-[#E6E8F0]">{name}</p><p className="mt-0.5 text-[10px] text-muted">{counts[name] || 0} item{counts[name] === 1 ? '' : 's'}</p></div><button onClick={() => { setEditing(name); setEditName(name); setConfirmDelete(null) }} aria-label={`Rename ${name}`} className="grid size-7 place-items-center rounded-lg text-muted transition hover:bg-white/[.05] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"><Pencil size={13} /></button><button onClick={() => setConfirmDelete(current => current === name ? null : name)} aria-label={`Delete ${name}`} className="grid size-7 place-items-center rounded-lg text-muted transition hover:bg-[#ff5577]/10 hover:text-[#ff8ca7] focus:outline-none focus:ring-2 focus:ring-primary"><Trash2 size={13} /></button></>}</div>
      {confirmDelete === name && <div className="mt-2 flex items-center gap-2 border-t border-line pt-2"><p className="flex-1 text-[10px] leading-4 text-muted">{deleteNote ? deleteNote(name) : `Remove “${name}” from ${noun.toLowerCase()}s?`}</p><button onClick={() => { void remove(name) }} className="shrink-0 rounded-lg bg-[#c94166]/15 px-2 py-1.5 text-[10px] font-medium text-[#ff9fb5] transition hover:bg-[#c94166]/25 focus:outline-none focus:ring-2 focus:ring-primary">Delete</button></div>}
    </div>)}</div>}
  </div>
}
