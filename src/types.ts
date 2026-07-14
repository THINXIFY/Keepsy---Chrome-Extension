export const itemTypes = ['Note', 'Email', 'Phone', 'Website', 'YouTube', 'Crypto Wallet', 'API Key', 'Code', 'Address', 'Custom'] as const
export type ItemType = (typeof itemTypes)[number]

export type KeepsyItem = {
  id: string
  type: ItemType
  title: string
  content?: string
  url?: string
  faviconUrl?: string
  email?: string
  phone?: string
  walletAddress?: string
  walletName?: string
  walletNetwork?: WalletNetwork
  apiKey?: string
  code?: string
  language?: string
  youtubeThumbnail?: string
  youtubeChannel?: string
  customIcon?: string
  emoji?: string
  category: string
  tags: string[]
  collectionIds: string[]
  favorite: boolean
  pinned: boolean
  createdAt: string
  updatedAt: string
  viewedAt?: string
  deletedAt?: string
}

export type ItemDraft = Omit<KeepsyItem, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'favorite' | 'pinned' | 'collectionIds'> & Partial<Pick<KeepsyItem, 'favorite' | 'pinned' | 'collectionIds'>>
export type Filter = 'All' | 'Recent' | 'Favorites' | 'Pinned' | 'Trash'
export type SortMode = 'newest' | 'oldest' | 'updated' | 'az'
export const walletNetworks = ['BTC', 'ETH', 'BNB', 'SOL', 'TRON', 'Polygon', 'Base', 'Arbitrum', 'Optimism', 'Avalanche'] as const
export type WalletNetwork = (typeof walletNetworks)[number]

export type CapturePayload = {
  title: string
  type: ItemType
  category: string
  tags: string[]
  content?: string
  url?: string
  faviconUrl?: string
  email?: string
  phone?: string
  walletAddress?: string
  source: 'selection' | 'page' | 'link'
}

export type KeepsyCollection = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  lastUsedAt?: string
}
