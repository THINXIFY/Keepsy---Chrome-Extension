import type { ItemType } from '../types'

const KEY = 'keepsy-type-preferences-v2'
const hasChromeStorage = typeof chrome !== 'undefined' && !!chrome.storage?.local

type TypeStats = { categories: Record<string, number>; tags: Record<string, number> }
type Store = Partial<Record<string, TypeStats>>

async function readStore(): Promise<Store> {
  try {
    const stored = hasChromeStorage ? (await chrome.storage.local.get(KEY))[KEY] : JSON.parse(localStorage.getItem(KEY) || 'null')
    return stored && typeof stored === 'object' ? stored : {}
  } catch {
    return {}
  }
}

async function writeStore(store: Store) {
  if (hasChromeStorage) await chrome.storage.local.set({ [KEY]: store })
  else localStorage.setItem(KEY, JSON.stringify(store))
}

function topKeys(counts: Record<string, number>, limit: number): string[] {
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([key]) => key)
}

/** Records that the user saved an item of this type with this category/tags, so future suggestions can prioritize what they actually use most. */
export async function recordChoice(type: ItemType, category: string, tags: string[]) {
  const store = await readStore()
  const stats: TypeStats = store[type] || { categories: {}, tags: {} }
  if (category) stats.categories[category] = (stats.categories[category] || 0) + 1
  for (const tag of tags) stats.tags[tag] = (stats.tags[tag] || 0) + 1
  store[type] = stats
  await writeStore(store)
}

/** The user's most frequently used category and tags for this item type, if any have been recorded yet. */
export async function learnedForType(type: ItemType): Promise<{ category: string | null; tags: string[] }> {
  const store = await readStore()
  const stats = store[type]
  if (!stats) return { category: null, tags: [] }
  const [topCategory] = topKeys(stats.categories, 1)
  return { category: topCategory || null, tags: topKeys(stats.tags, 2) }
}
