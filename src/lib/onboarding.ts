const KEY = 'keepsy-onboarding-v1'
const hasChromeStorage = typeof chrome !== 'undefined' && !!chrome.storage?.local

export async function loadOnboardingCompleted(): Promise<boolean> {
  try {
    const stored = hasChromeStorage ? (await chrome.storage.local.get(KEY))[KEY] : window.localStorage.getItem(KEY)
    return !!stored
  } catch {
    return false
  }
}

export async function setOnboardingCompleted(value: boolean) {
  if (hasChromeStorage) await chrome.storage.local.set({ [KEY]: value })
  else window.localStorage.setItem(KEY, value ? 'true' : '')
}
