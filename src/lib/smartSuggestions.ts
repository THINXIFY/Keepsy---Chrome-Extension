import type { ItemType } from '../types'
import { learnedForType } from './preferences'

export type Suggestion = { category: string; tags: string[] }

type Rule = { match: string[]; category: string; tags: string[] }

/**
 * Keyword/domain rules checked against title + URL (lowercased). First match wins,
 * so more specific entries should stay above broader ones. This table is intentionally
 * a plain, inspectable data structure — a future AI-backed suggester can slot in
 * alongside or ahead of it without changing the `suggest()` contract below.
 */
const rules: Rule[] = [
  // Development
  { match: ['github.com', 'github'], category: 'Development', tags: ['Code'] },
  { match: ['gitlab.com'], category: 'Development', tags: ['Code'] },
  { match: ['bitbucket.org'], category: 'Development', tags: ['Code'] },
  { match: ['stackoverflow.com', 'stack overflow'], category: 'Development', tags: ['Code'] },
  { match: ['react.dev', 'reactjs.org', 'react documentation', 'react docs'], category: 'Development', tags: ['React'] },
  { match: ['npmjs.com'], category: 'Development', tags: ['Code'] },
  { match: ['developer.mozilla.org', 'mdn'], category: 'Development', tags: ['Code'] },
  { match: ['vercel.com'], category: 'Development', tags: ['Hosting'] },
  { match: ['netlify.com'], category: 'Development', tags: ['Hosting'] },

  // Business & hosting
  { match: ['hostinger.com', 'hostinger'], category: 'Business', tags: ['Hosting'] },
  { match: ['godaddy.com', 'godaddy'], category: 'Business', tags: ['Hosting'] },
  { match: ['aws.amazon.com', 'amazon web services'], category: 'Business', tags: ['Hosting'] },
  { match: ['digitalocean.com', 'digital ocean'], category: 'Business', tags: ['Hosting'] },
  { match: ['cloudflare.com'], category: 'Business', tags: ['Hosting'] },

  // Crypto
  { match: ['binance.com', 'binance'], category: 'Crypto', tags: ['Wallet'] },
  { match: ['coinbase.com', 'coinbase'], category: 'Crypto', tags: ['Wallet'] },
  { match: ['metamask.io', 'metamask'], category: 'Crypto', tags: ['Wallet'] },
  { match: ['kraken.com'], category: 'Crypto', tags: ['Wallet'] },
  { match: ['etherscan.io'], category: 'Crypto', tags: ['Wallet'] },

  // Email & productivity
  { match: ['mail.google.com', 'gmail.com', 'gmail'], category: 'Personal', tags: ['Email'] },
  { match: ['outlook.com', 'outlook'], category: 'Personal', tags: ['Email'] },
  { match: ['notion.so', 'notion'], category: 'Work', tags: ['Productivity'] },
  { match: ['slack.com', 'slack'], category: 'Work', tags: ['Productivity'] },
  { match: ['trello.com'], category: 'Work', tags: ['Productivity'] },
  { match: ['asana.com'], category: 'Work', tags: ['Productivity'] },

  // AI
  { match: ['openai.com', 'openai', 'chatgpt.com', 'chat.openai.com'], category: 'AI', tags: ['Productivity'] },
  { match: ['anthropic.com', 'claude.ai'], category: 'AI', tags: ['Productivity'] },
  { match: ['perplexity.ai'], category: 'AI', tags: ['Productivity'] },
  { match: ['midjourney.com'], category: 'AI', tags: ['Productivity'] },

  // Design
  { match: ['figma.com', 'figma'], category: 'Design', tags: ['UI/UX'] },
  { match: ['dribbble.com'], category: 'Design', tags: ['UI/UX'] },
  { match: ['behance.net'], category: 'Design', tags: ['UI/UX'] },
  { match: ['canva.com'], category: 'Design', tags: ['UI/UX'] },

  // Learning
  { match: ['udemy.com'], category: 'Learning', tags: ['Tutorial'] },
  { match: ['coursera.org'], category: 'Learning', tags: ['Tutorial'] },
  { match: ['khanacademy.org'], category: 'Learning', tags: ['Tutorial'] },

  // Shopping
  { match: ['amazon.com', 'amazon'], category: 'Shopping', tags: ['Important'] },
  { match: ['ebay.com'], category: 'Shopping', tags: ['Important'] },
  { match: ['aliexpress.com'], category: 'Shopping', tags: ['Important'] },

  // Social & travel
  { match: ['linkedin.com'], category: 'Work', tags: ['Client'] },
  { match: ['booking.com'], category: 'Travel', tags: ['Important'] },
  { match: ['airbnb.com'], category: 'Travel', tags: ['Important'] },
]

const typeDefaults: Record<ItemType, Suggestion> = {
  Note: { category: 'Personal', tags: ['Personal'] },
  Email: { category: 'Personal', tags: ['Email'] },
  Phone: { category: 'Personal', tags: ['Personal'] },
  Website: { category: 'Personal', tags: ['Important'] },
  YouTube: { category: 'Learning', tags: ['YouTube', 'Tutorial'] },
  'Crypto Wallet': { category: 'Crypto', tags: ['Wallet'] },
  'API Key': { category: 'Development', tags: ['API'] },
  Code: { category: 'Development', tags: ['React'] },
  Address: { category: 'Personal', tags: ['Travel'] },
  Custom: { category: 'Personal', tags: ['Personal'] },
}

/** Looks for a domain/keyword match in the title or URL. Returns null when nothing matches. */
export function suggestFromContent(input: { title?: string; url?: string }): Suggestion | null {
  const haystack = `${input.title || ''} ${input.url || ''}`.toLocaleLowerCase().trim()
  if (!haystack) return null
  for (const rule of rules) {
    if (rule.match.some(keyword => haystack.includes(keyword))) return { category: rule.category, tags: [...rule.tags] }
  }
  return null
}

/** The generic fallback suggestion for a type, used when no content rule and no learned habit apply. */
export function defaultForType(type: ItemType): Suggestion {
  return typeDefaults[type]
}

/**
 * Single entry point for suggestion resolution: a direct content match wins outright,
 * otherwise the user's most frequently used category/tags for this type, falling back
 * to the generic type default. This is the seam a future AI suggester would plug into.
 */
export async function suggest(input: { type: ItemType; title?: string; url?: string }): Promise<Suggestion> {
  const content = suggestFromContent(input)
  if (content) return content
  const learned = await learnedForType(input.type)
  const fallback = defaultForType(input.type)
  return { category: learned.category || fallback.category, tags: learned.tags.length ? learned.tags : fallback.tags }
}
