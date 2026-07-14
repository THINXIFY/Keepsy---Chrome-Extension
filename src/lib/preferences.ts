import type { ItemType } from '../types'
const KEY = 'keepsy-type-preferences-v1'
const chromeStore = typeof chrome !== 'undefined' && !!chrome.storage?.local
type Pref = { category: string; tags: string[] }
export async function saveTypePreference(type: ItemType, value: Pref) { const current = chromeStore ? (await chrome.storage.local.get(KEY))[KEY] || {} : JSON.parse(localStorage.getItem(KEY) || '{}'); const next = { ...current, [type]: value }; if (chromeStore) await chrome.storage.local.set({ [KEY]: next }); else localStorage.setItem(KEY, JSON.stringify(next)) }
export async function loadTypePreference(type: ItemType): Promise<Pref | null> { const current = chromeStore ? (await chrome.storage.local.get(KEY))[KEY] || {} : JSON.parse(localStorage.getItem(KEY) || '{}'); return current[type] || null }
