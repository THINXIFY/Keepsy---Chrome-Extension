import { useEffect, useState } from 'react'
import { AlertTriangle, LoaderCircle, Plus } from 'lucide-react'
import { walletNetworks, type ItemDraft, type ItemType, type KeepsyCollection, type KeepsyItem, type WalletNetwork } from '../types'
import { Button } from './ui/Button'
import { IconPicker } from './IconPicker'
import { TypeSelect } from './TypeSelect'
import { SearchableSelect } from './ui/SearchableSelect'
import { InlineSelect } from './ui/InlineSelect'
import { getYouTubeMetadata, validHttpUrl, validWallet } from '../lib/specialized'
import { recordChoice } from '../lib/preferences'
import { defaultForType, suggest, type Suggestion } from '../lib/smartSuggestions'
import { addTaxonomy, useTags } from '../lib/taxonomy'
import { CollectionSelect } from './CollectionSelect'
import { suggestedCollectionNames } from '../lib/collectionSuggestions'

const inputStyle = 'mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13px] text-[#E6E8F0] outline-none transition-all duration-200 placeholder:text-muted/60 focus:border-primary/70 focus:ring-4 focus:ring-primary/10'
const codeLanguages = ['TypeScript', 'JavaScript', 'Python', 'JSON', 'HTML', 'CSS', 'SQL', 'Bash']

export function ItemForm({ item, collections, onCreateCollection, onSave, onCancel }: { item?: KeepsyItem; collections: KeepsyCollection[]; onCreateCollection: (name: string) => Promise<KeepsyCollection>; onSave: (draft: ItemDraft) => Promise<void>; onCancel: () => void }) {
  const [draft, setDraft] = useState<ItemDraft>(() => item ? { ...item, collectionIds: item.collectionIds || [] } : { type: 'Note', title: '', content: '', category: 'Personal', tags: ['Personal'], collectionIds: [] })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [fetchingYoutube, setFetchingYoutube] = useState(false)
  const [suggestion, setSuggestion] = useState<Suggestion>(() => defaultForType(draft.type))
  const [suggestionLocked, setSuggestionLocked] = useState(false)

  const refreshSuggestion = async (type: ItemType, title: string, url?: string) => {
    const result = await suggest({ type, title, url })
    setSuggestion(result)
    if (!item && !suggestionLocked) setDraft(current => ({ ...current, category: result.category, tags: result.tags }))
  }

  useEffect(() => {
    if (item) return
    void refreshSuggestion(draft.type, draft.title, draft.url)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (item || suggestionLocked) return
    const timeout = window.setTimeout(() => { void refreshSuggestion(draft.type, draft.title, draft.url) }, 350)
    return () => window.clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.title, draft.url, suggestionLocked])

  const set = <K extends keyof ItemDraft>(key: K, value: ItemDraft[K]) => setDraft(current => ({ ...current, [key]: value }))

  const field = (label: string, key: keyof ItemDraft, placeholder: string, type = 'text') => (
    <label className="block text-[11px] font-medium text-muted">
      {label}
      <input type={type} value={(draft[key] as string) || ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} className={inputStyle} />
    </label>
  )

  const fetchYoutube = async () => {
    if (!draft.url) return
    setFetchingYoutube(true)
    try {
      const metadata = await getYouTubeMetadata(draft.url)
      const applyOrganize = !item && !suggestionLocked
      if (metadata) setDraft(current => ({ ...current, title: current.title || metadata.title, youtubeThumbnail: metadata.thumbnail, youtubeChannel: metadata.channel, type: 'YouTube', category: applyOrganize ? 'Learning' : current.category, tags: applyOrganize ? Array.from(new Set([...current.tags, 'YouTube', 'Tutorial'])) : current.tags }))
    } finally {
      setFetchingYoutube(false)
    }
  }

  const detailsField = (() => {
    if (draft.type === 'Code') return (
      <>
        <div>
          <span className="block text-[11px] font-medium text-muted">Language</span>
          <div className="mt-1"><InlineSelect value={draft.language || 'TypeScript'} options={codeLanguages.map(language => ({ value: language, label: language }))} onChange={value => set('language', value)} placeholder="Language" /></div>
        </div>
        <label className="block text-[11px] font-medium text-muted">Snippet<textarea value={draft.code || ''} onChange={e => set('code', e.target.value)} placeholder="Paste your snippet" className={`${inputStyle} min-h-28 font-mono text-xs`} /></label>
      </>
    )
    if (draft.type === 'Crypto Wallet') return (
      <>
        {field('Wallet name', 'walletName', 'Main wallet')}
        <div>
          <span className="block text-[11px] font-medium text-muted">Network</span>
          <div className="mt-1"><InlineSelect value={draft.walletNetwork || 'ETH'} options={walletNetworks.map(network => ({ value: network, label: network }))} onChange={value => set('walletNetwork', value as WalletNetwork)} placeholder="Network" /></div>
        </div>
        {field('Address', 'walletAddress', '0x...')}
      </>
    )
    if (draft.type === 'API Key') return field('API key', 'apiKey', 'Paste API key', 'password')
    if (draft.type === 'Email') return field('Email', 'email', 'name@example.com', 'email')
    if (draft.type === 'Phone') return field('Phone', 'phone', '+1 555...', 'tel')
    if (draft.type === 'Website' || draft.type === 'YouTube') return (
      <label className="block text-[11px] font-medium text-muted">
        URL
        <span className="relative mt-1 block">
          <input value={draft.url || ''} onChange={e => set('url', e.target.value)} onBlur={() => { void fetchYoutube() }} placeholder="https://" type="url" className={`${inputStyle} mt-0 ${fetchingYoutube ? 'pr-9' : ''}`} />
          {fetchingYoutube && <LoaderCircle size={15} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#81b0ff]" />}
        </span>
      </label>
    )
    return <label className="block text-[11px] font-medium text-muted">Details<textarea value={draft.content || ''} onChange={e => set('content', e.target.value)} placeholder="Add any details worth remembering" className={`${inputStyle} min-h-20`} /></label>
  })()

  const suggestedCollectionIds = collections.filter(collection => suggestedCollectionNames(draft.type).some(name => name.toLocaleLowerCase() === collection.name.toLocaleLowerCase())).map(collection => collection.id)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.title.trim()) return setError('Add a title before saving.')
    if ((draft.type === 'Website' || draft.type === 'YouTube') && draft.url && !validHttpUrl(draft.url)) return setError('Use a valid http or https link.')
    if (draft.type === 'Crypto Wallet' && draft.walletAddress && !validWallet(draft.walletAddress, draft.walletNetwork || 'ETH')) return setError(`Enter a valid ${draft.walletNetwork || 'ETH'} wallet address.`)
    setSaving(true)
    try {
      await recordChoice(draft.type, draft.category, draft.tags)
      await addTaxonomy('categories', draft.category)
      await useTags(draft.tags)
      await onSave({ ...draft, title: draft.title.trim() })
    } catch {
      setError('Could not save this item.')
    } finally {
      setSaving(false)
    }
  }

  const selectType = (type: ItemType) => {
    setDraft(current => ({ ...current, type }))
    void refreshSuggestion(type, draft.title, draft.url)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <TypeSelect value={draft.type} onChange={selectType} />
      <label className="block text-[11px] font-medium text-muted">Title<input value={draft.title} onChange={e => set('title', e.target.value)} placeholder="Give it a clear name" className={inputStyle} /></label>
      <div className="space-y-3">{detailsField}</div>
      <IconPicker type={draft.type} icon={draft.customIcon} onChange={value => setDraft(current => ({ ...current, ...value }))} />

      <div className="space-y-3 border-t border-line pt-4">
        <div className="text-[10px] font-semibold uppercase tracking-[.08em] text-muted">Organize</div>
        <div className="grid grid-cols-2 gap-3">
          <SearchableSelect kind="categories" label="Category" value={draft.category} onChange={value => { setSuggestionLocked(true); set('category', value as string) }} placeholder="Choose category" suggested={[suggestion.category]} />
          <SearchableSelect kind="tags" label="Tags" multiple value={draft.tags} onChange={value => { setSuggestionLocked(true); set('tags', value as string[]) }} placeholder="Choose tags" suggested={suggestion.tags} />
        </div>
        <CollectionSelect collections={collections} value={draft.collectionIds || []} onChange={value => set('collectionIds', value)} onCreate={onCreateCollection} suggestedIds={suggestedCollectionIds} />
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-[#6d3043] bg-[#21121a] px-3 py-2.5 text-xs leading-5 text-[#ffb2c3]">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving || fetchingYoutube}>
          <Plus size={15} />
          {saving ? 'Saving...' : fetchingYoutube ? 'Fetching...' : item ? 'Save changes' : 'Save item'}
        </Button>
      </div>
    </form>
  )
}
