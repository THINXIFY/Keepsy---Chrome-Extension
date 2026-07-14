const KEY = 'keepsy-taxonomy-v1'
export const taxonomyStorageKey = KEY
const hasChromeStorage = typeof chrome !== 'undefined' && !!chrome.storage?.local

export const defaultCategories = ['Personal', 'Work', 'Business', 'Finance', 'Crypto', 'Learning', 'Development', 'Shopping', 'Travel']
export const defaultTags = ['Important', 'Personal', 'Work', 'Client', 'Business', 'Wallet', 'YouTube', 'Tutorial', 'API', 'React', 'AI', 'Urgent', 'Favorite']
export type Taxonomy = { categories: string[]; tags: string[] }

const base: Taxonomy = { categories: defaultCategories, tags: defaultTags }
const unique = (values: string[]) => values.reduce<string[]>((result, value) => {
  const clean = value.trim()
  if (clean && !result.some(item => item.toLocaleLowerCase() === clean.toLocaleLowerCase())) result.push(clean)
  return result
}, [])

async function readStored(): Promise<Taxonomy | null> {
  const value = hasChromeStorage ? (await chrome.storage.local.get(KEY))[KEY] : JSON.parse(window.localStorage.getItem(KEY) || 'null')
  if (!value || !Array.isArray(value.categories) || !Array.isArray(value.tags)) return null
  return { categories: unique(value.categories), tags: unique(value.tags) }
}

export async function saveTaxonomy(value: Taxonomy) {
  if (hasChromeStorage) await chrome.storage.local.set({ [KEY]: value })
  else window.localStorage.setItem(KEY, JSON.stringify(value))
}

export async function loadTaxonomy(): Promise<Taxonomy> {
  try {
    const stored = await readStored()
    return stored || { categories: [...base.categories], tags: [...base.tags] }
  } catch {
    return { categories: [...base.categories], tags: [...base.tags] }
  }
}

export async function addTaxonomy(kind: keyof Taxonomy, value: string) {
  const clean = value.trim()
  if (!clean) return
  const current = await loadTaxonomy()
  const existing = current[kind].find(option => option.toLocaleLowerCase() === clean.toLocaleLowerCase())
  if (existing) return existing
  await saveTaxonomy({ ...current, [kind]: [...current[kind], clean] })
  return clean
}

export async function removeTaxonomy(kind: keyof Taxonomy, value: string) {
  const current = await loadTaxonomy()
  const next = current[kind].filter(option => option.toLocaleLowerCase() !== value.toLocaleLowerCase())
  await saveTaxonomy({ ...current, [kind]: next })
}

export async function useTags(values: string[]) {
  const current = await loadTaxonomy()
  await saveTaxonomy({ ...current, tags: unique([...values, ...current.tags]) })
}

export async function resetTaxonomy() {
  await saveTaxonomy({ categories: [...defaultCategories], tags: [...defaultTags] })
}
