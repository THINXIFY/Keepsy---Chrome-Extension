import type { WalletNetwork } from '../types'
import type { ItemType } from '../types'

export function detectContent(value: string): Partial<{ type: ItemType; language: string; category: string; tags: string[] }> {
  const text = value.trim()
  if (/^(sk-|pk_|AIza|ghp_|xox[baprs]-)[\w-]{12,}/.test(text)) return { type: 'API Key', category: 'Development', tags: ['API'] }
  if (isYouTubeUrl(text)) return { type: 'YouTube', category: 'Learning', tags: ['YouTube', 'Tutorial'] }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return { type: 'Email', category: 'Personal', tags: ['Personal'] }
  if (/^(?:\+?\d[\d\s().-]{7,}\d)$/.test(text)) return { type: 'Phone', category: 'Personal', tags: ['Personal'] }
  if (/^(0x[a-fA-F0-9]{40}|(?:bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62})$/.test(text)) return { type: 'Crypto Wallet', category: 'Crypto', tags: ['Wallet'] }
  if (/^https?:\/\//.test(text)) return { type: 'Website', category: 'Learning', tags: ['Important'] }
  if (/\b(import|const|function|class|def|SELECT)\b/.test(text)) return { type: 'Code', language: /\bdef\b/.test(text) ? 'Python' : /\bSELECT\b/i.test(text) ? 'SQL' : 'TypeScript', category: 'Development', tags: ['React'] }
  return { type: 'Note', category: 'Personal', tags: ['Personal'] }
}
export function validHttpUrl(value: string) { try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:' } catch { return false } }
export function domainFromUrl(value: string) { try { return new URL(value).hostname.replace(/^www\./, '') } catch { return value } }

export function isYouTubeUrl(value: string) { return /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/i.test(value) }
export async function getYouTubeMetadata(url: string) {
  if (!isYouTubeUrl(url)) return null
  try { const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`); if (!response.ok) return null; const data = await response.json() as { title?: string; thumbnail_url?: string; author_name?: string }; return data.title ? { title: data.title, thumbnail: data.thumbnail_url, channel: data.author_name } : null } catch { return null }
}
export function validWallet(address: string, network: WalletNetwork) { const value = address.trim(); if (network === 'ETH' || ['BNB', 'Polygon', 'Base', 'Arbitrum', 'Optimism', 'Avalanche'].includes(network)) return /^0x[a-fA-F0-9]{40}$/.test(value); if (network === 'BTC') return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(value); if (network === 'SOL') return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value); if (network === 'TRON') return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(value); return value.length > 20 }
export function walletExplorer(network: WalletNetwork, address: string) { const base: Record<WalletNetwork, string> = { BTC: 'https://www.blockchain.com/explorer/addresses/btc/', ETH: 'https://etherscan.io/address/', BNB: 'https://bscscan.com/address/', SOL: 'https://explorer.solana.com/address/', TRON: 'https://tronscan.org/#/address/', Polygon: 'https://polygonscan.com/address/', Base: 'https://basescan.org/address/', Arbitrum: 'https://arbiscan.io/address/', Optimism: 'https://optimistic.etherscan.io/address/', Avalanche: 'https://snowtrace.io/address/' }; return `${base[network]}${address}` }
export function highlightCode(code: string) { return code.split(/(\/\/.*|"[^"]*"|'[^']*'|\b(?:const|let|function|return|if|else|import|from|async|await|class|interface|type|export)\b|\b\d+(?:\.\d+)?\b)/g).map((part, index) => <span key={index} className={part.startsWith('//') ? 'text-muted' : /^['"]/.test(part) ? 'text-[#a8d58a]' : /^(const|let|function|return|if|else|import|from|async|await|class|interface|type|export)$/.test(part) ? 'text-[#81b0ff]' : /^\d/.test(part) ? 'text-[#f5c878]' : ''}>{part}</span>) }
