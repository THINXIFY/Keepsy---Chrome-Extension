import type { ItemType } from '../types'

export function suggestedCollectionNames(type: ItemType): string[] {
  if (type === 'Crypto Wallet') return ['Crypto', 'Finance']
  if (type === 'YouTube' || type === 'Website') return ['Learning']
  if (type === 'API Key' || type === 'Code') return ['Work', 'Learning']
  if (type === 'Email') return ['Work', 'Clients']
  if (type === 'Address') return ['Personal', 'Travel']
  return ['Personal']
}
