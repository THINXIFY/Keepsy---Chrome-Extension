import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadItems, saveItems } from '../lib/storage'
import type { ItemDraft, KeepsyItem } from '../types'

const stamp = () => new Date().toISOString()
const newId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`

export function useItems() {
  const [items, setItems] = useState<KeepsyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { loadItems().then(setItems).catch((e: Error) => setError(e.message)).finally(() => setLoading(false)) }, [])
  const commit = useCallback(async (next: KeepsyItem[]) => { setItems(next); try { await saveItems(next) } catch (e) { setError((e as Error).message); throw e } }, [])
  const add = useCallback(async (draft: ItemDraft) => { const time = stamp(); await commit([{ ...draft, collectionIds: draft.collectionIds || [], id: newId(), favorite: !!draft.favorite, pinned: !!draft.pinned, createdAt: time, updatedAt: time }, ...items]) }, [commit, items])
  const update = useCallback(async (id: string, draft: ItemDraft) => await commit(items.map(item => item.id === id ? { ...item, ...draft, updatedAt: stamp() } : item)), [commit, items])
  const trash = useCallback(async (id: string) => await commit(items.map(item => item.id === id ? { ...item, deletedAt: stamp() } : item)), [commit, items])
  const restore = useCallback(async (id: string) => await commit(items.map(item => item.id === id ? { ...item, deletedAt: undefined, updatedAt: stamp() } : item)), [commit, items])
  const remove = useCallback(async (id: string) => await commit(items.filter(item => item.id !== id)), [commit, items])
  const toggle = useCallback(async (id: string, field: 'favorite' | 'pinned') => await commit(items.map(item => item.id === id ? { ...item, [field]: !item[field], updatedAt: stamp() } : item)), [commit, items])
  const bulk = useCallback(async (ids: string[], change: { category?: string; addTags?: string[]; removeTags?: string[]; addCollections?: string[]; removeCollections?: string[]; trash?: boolean }) => await commit(items.map(item => ids.includes(item.id) ? { ...item, ...(change.category ? { category: change.category } : {}), tags: Array.from(new Set([...(item.tags || []), ...(change.addTags || [])])).filter(tag => !(change.removeTags || []).includes(tag)), collectionIds: Array.from(new Set([...(item.collectionIds || []), ...(change.addCollections || [])])).filter(collectionId => !(change.removeCollections || []).includes(collectionId)), ...(change.trash ? { deletedAt: stamp() } : {}), updatedAt: stamp() } : item)), [commit, items])
  const replace = useCallback(async (next: KeepsyItem[]) => await commit(next), [commit])
  const viewed = useCallback(async (id: string) => await commit(items.map(item => item.id === id ? { ...item, viewedAt: stamp() } : item)), [commit, items])
  return useMemo(() => ({ items, loading, error, setError, add, update, trash, restore, remove, toggle, bulk, replace, viewed }), [items, loading, error, add, update, trash, restore, remove, toggle, bulk, replace, viewed])
}
