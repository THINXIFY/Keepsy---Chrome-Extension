import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadCollections, saveCollections } from '../lib/collections'
import type { KeepsyCollection } from '../types'

const stamp = () => new Date().toISOString()
const newId = () => crypto.randomUUID?.() ?? `collection-${Date.now()}-${Math.random()}`
const sameName = (a: string, b: string) => a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase()

export function useCollections() {
  const [collections, setCollections] = useState<KeepsyCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { loadCollections().then(setCollections).catch(() => setError('Collections could not be loaded.')).finally(() => setLoading(false)) }, [])
  const commit = useCallback(async (next: KeepsyCollection[]) => { setCollections(next); try { await saveCollections(next) } catch { setError('Collections could not be saved.'); throw new Error('Collections could not be saved.') } }, [])

  const create = useCallback(async (name: string) => {
    const clean = name.trim()
    if (!clean) throw new Error('Enter a collection name.')
    const existing = collections.find(collection => sameName(collection.name, clean))
    if (existing) return existing
    const time = stamp()
    const collection = { id: newId(), name: clean, createdAt: time, updatedAt: time, lastUsedAt: time }
    await commit([...collections, collection])
    return collection
  }, [collections, commit])

  const rename = useCallback(async (id: string, name: string) => {
    const clean = name.trim()
    if (!clean) throw new Error('Enter a collection name.')
    if (collections.some(collection => collection.id !== id && sameName(collection.name, clean))) throw new Error('A collection with this name already exists.')
    await commit(collections.map(collection => collection.id === id ? { ...collection, name: clean, updatedAt: stamp() } : collection))
  }, [collections, commit])

  const remove = useCallback(async (id: string) => { await commit(collections.filter(collection => collection.id !== id)) }, [collections, commit])
  const touch = useCallback(async (ids: string[]) => { if (!ids.length) return; const time = stamp(); await commit(collections.map(collection => ids.includes(collection.id) ? { ...collection, lastUsedAt: time } : collection)) }, [collections, commit])
  const replace = useCallback(async (next: KeepsyCollection[]) => { await commit(next) }, [commit])

  return useMemo(() => ({ collections, loading, error, setError, create, rename, remove, touch, replace }), [collections, loading, error, create, rename, remove, touch, replace])
}
