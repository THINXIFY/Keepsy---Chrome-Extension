import type { CapturePayload, KeepsyItem } from '../types'

const KEY = 'keepsy-items-v1'
const PENDING_CAPTURE_KEY = 'keepsy-pending-capture-v1'
const hasChromeStorage = typeof chrome !== 'undefined' && !!chrome.storage?.local

export async function loadItems(): Promise<KeepsyItem[]> {
  try {
    if (hasChromeStorage) {
      const result = await chrome.storage.local.get(KEY)
      if (Array.isArray(result[KEY])) {
        const items = (result[KEY] as KeepsyItem[]).filter(item => !item.id.startsWith('sample-')).map(item => ({ ...item, collectionIds: item.collectionIds || [] }))
        if (items.length !== result[KEY].length) await chrome.storage.local.set({ [KEY]: items })
        return items
      }
      return []
    }
    const stored = window.localStorage.getItem(KEY)
    if (stored) {
      const items = (JSON.parse(stored) as KeepsyItem[]).filter(item => !item.id.startsWith('sample-')).map(item => ({ ...item, collectionIds: item.collectionIds || [] }))
      if (items.length !== JSON.parse(stored).length) window.localStorage.setItem(KEY, JSON.stringify(items))
      return items
    }
    return []
  } catch (error) { throw new Error('Keepsy could not load your saved items. Please try again.') }
}

export async function saveItems(items: KeepsyItem[]) {
  try {
    if (hasChromeStorage) await chrome.storage.local.set({ [KEY]: items })
    else window.localStorage.setItem(KEY, JSON.stringify(items))
  } catch (error) { throw new Error('Keepsy could not save your changes. Please try again.') }
}

export async function loadPendingCapture(): Promise<CapturePayload | null> {
  if (!hasChromeStorage) return null
  const result = await chrome.storage.local.get(PENDING_CAPTURE_KEY)
  return (result[PENDING_CAPTURE_KEY] as CapturePayload | undefined) ?? null
}

export async function clearPendingCapture() {
  if (hasChromeStorage) await chrome.storage.local.remove(PENDING_CAPTURE_KEY)
}

export const storageKeys = { items: KEY, pendingCapture: PENDING_CAPTURE_KEY }
