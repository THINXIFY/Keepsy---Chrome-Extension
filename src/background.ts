const ITEMS_KEY = 'keepsy-items-v1'
const PENDING_KEY = 'keepsy-pending-capture-v1'
type CaptureType = 'Note' | 'Email' | 'Phone' | 'Website' | 'YouTube' | 'Crypto Wallet'

function detect(value: string, url?: string): CaptureType {
  const source = value.trim()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(source)) return 'Email'
  if (/^(?:\+?\d[\d\s().-]{7,}\d)$/.test(source)) return 'Phone'
  if (/^(0x[a-fA-F0-9]{40}|(?:bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62})$/.test(source)) return 'Crypto Wallet'
  if (/youtube\.com|youtu\.be/i.test(url || source)) return 'YouTube'
  if (/^https?:\/\//i.test(source) || url) return 'Website'
  return 'Note'
}

function categoryFor(type: CaptureType) { return type === 'Email' || type === 'Phone' ? 'People' : type === 'YouTube' ? 'Learning' : type === 'Website' ? 'Research' : 'General' }

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: 'keepsy-save-selection', title: 'Save Selected Text', contexts: ['selection'] })
    chrome.contextMenus.create({ id: 'keepsy-save-page', title: 'Save Current Page', contexts: ['page'] })
    chrome.contextMenus.create({ id: 'keepsy-save-link', title: 'Save Link', contexts: ['link'] })
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const source = info.menuItemId === 'keepsy-save-link' ? 'link' : info.menuItemId === 'keepsy-save-page' ? 'page' : 'selection'
  const selected = (info.selectionText || '').trim()
  const url = source === 'link' ? info.linkUrl : source === 'page' ? info.pageUrl : /^https?:\/\//i.test(selected) ? selected : undefined
  const raw = selected || url || tab?.title || 'Untitled capture'
  const type = detect(raw, url)
  const title = source === 'page' || source === 'link' ? (tab?.title || raw) : raw.slice(0, 80)
  const payload = {
    title,
    type,
    category: categoryFor(type),
    tags: [],
    source,
    ...(type === 'Email' ? { email: raw } : type === 'Phone' ? { phone: raw } : type === 'Crypto Wallet' ? { walletAddress: raw } : type === 'Note' ? { content: raw } : { url }),
    ...(tab?.favIconUrl ? { faviconUrl: tab.favIconUrl } : {}),
  }
  await chrome.storage.local.set({ [PENDING_KEY]: payload })
  try { await chrome.action.openPopup() } catch { await chrome.action.setBadgeText({ text: '1', tabId: tab?.id }) }
})

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes[ITEMS_KEY]) chrome.action.setBadgeText({ text: '' })
})
