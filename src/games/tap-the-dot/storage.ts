const BEST_KEY = 'keepsy-tapdot-best-v1'
const MUTE_KEY = 'keepsy-tapdot-muted-v1'
const GUIDE_KEY = 'keepsy-tapdot-guide-dismissed-v1'
const hasChromeStorage = typeof chrome !== 'undefined' && !!chrome.storage?.local

export async function loadBestScore(): Promise<number> {
  try {
    const stored = hasChromeStorage ? (await chrome.storage.local.get(BEST_KEY))[BEST_KEY] : window.localStorage.getItem(BEST_KEY)
    const value = Number(stored)
    return Number.isFinite(value) ? value : 0
  } catch {
    return 0
  }
}

export async function saveBestScore(value: number) {
  if (hasChromeStorage) await chrome.storage.local.set({ [BEST_KEY]: value })
  else window.localStorage.setItem(BEST_KEY, String(value))
}

export async function loadMuted(): Promise<boolean> {
  try {
    const stored = hasChromeStorage ? (await chrome.storage.local.get(MUTE_KEY))[MUTE_KEY] : window.localStorage.getItem(MUTE_KEY)
    return !!stored
  } catch {
    return false
  }
}

export async function saveMuted(value: boolean) {
  if (hasChromeStorage) await chrome.storage.local.set({ [MUTE_KEY]: value })
  else window.localStorage.setItem(MUTE_KEY, value ? 'true' : '')
}

export async function loadGuideDismissed(): Promise<boolean> {
  try {
    const stored = hasChromeStorage ? (await chrome.storage.local.get(GUIDE_KEY))[GUIDE_KEY] : window.localStorage.getItem(GUIDE_KEY)
    return !!stored
  } catch {
    return false
  }
}

export async function saveGuideDismissed(value: boolean) {
  if (hasChromeStorage) await chrome.storage.local.set({ [GUIDE_KEY]: value })
  else window.localStorage.setItem(GUIDE_KEY, value ? 'true' : '')
}
