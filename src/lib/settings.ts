import type { Filter, SortMode } from '../types'

const KEY = 'keepsy-settings-v1'
export const settingsStorageKey = KEY
const hasChromeStorage = typeof chrome !== 'undefined' && !!chrome.storage?.local

export type HomeView = Exclude<Filter, 'Trash'>
export type AutoEmptyTrash = 'never' | '30' | '60' | '90'

export type Settings = {
  defaultHomeView: HomeView
  defaultSort: SortMode
  confirmBeforeDelete: boolean
  autoEmptyTrash: AutoEmptyTrash
  compactMode: boolean
  animations: boolean
}

export const defaultSettings: Settings = {
  defaultHomeView: 'All',
  defaultSort: 'newest',
  confirmBeforeDelete: false,
  autoEmptyTrash: 'never',
  compactMode: false,
  animations: true,
}

export async function loadSettings(): Promise<Settings> {
  try {
    const stored = hasChromeStorage ? (await chrome.storage.local.get(KEY))[KEY] : JSON.parse(window.localStorage.getItem(KEY) || 'null')
    return stored && typeof stored === 'object' ? { ...defaultSettings, ...stored } : { ...defaultSettings }
  } catch {
    return { ...defaultSettings }
  }
}

export async function saveSettings(settings: Settings) {
  if (hasChromeStorage) await chrome.storage.local.set({ [KEY]: settings })
  else window.localStorage.setItem(KEY, JSON.stringify(settings))
}
