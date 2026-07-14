import type { KeepsyCollection } from '../types'

const KEY = 'keepsy-collections-v1'
const hasChromeStorage = typeof chrome !== 'undefined' && !!chrome.storage?.local
const names = ['Work', 'Personal', 'Learning', 'Clients', 'Finance', 'Crypto', 'Shopping', 'Travel']
const initialDate = '2026-01-01T00:00:00.000Z'

export const defaultCollections: KeepsyCollection[] = names.map(name => ({
  id: `default-${name.toLocaleLowerCase()}`,
  name,
  createdAt: initialDate,
  updatedAt: initialDate,
}))

export async function loadCollections(): Promise<KeepsyCollection[]> {
  try {
    const stored = hasChromeStorage ? (await chrome.storage.local.get(KEY))[KEY] : JSON.parse(window.localStorage.getItem(KEY) || 'null')
    return Array.isArray(stored) ? stored : defaultCollections
  } catch {
    return defaultCollections
  }
}

export async function saveCollections(collections: KeepsyCollection[]) {
  if (hasChromeStorage) await chrome.storage.local.set({ [KEY]: collections })
  else window.localStorage.setItem(KEY, JSON.stringify(collections))
}

export const collectionsStorageKey = KEY
