import { useState } from 'react'
import type { KeepsyItem } from '../types'
import { typeIcons } from '../lib/typeIcons'
import { BrandIcon } from './BrandIcon'

function LoadingImage({ src, alt, className, fit }: { src: string; alt: string; className: string; fit: 'cover' | 'contain' }) {
  const [loaded, setLoaded] = useState(false)
  return <span className="relative block size-full">
    {!loaded && <span className="absolute inset-0 animate-pulse rounded-[inherit] bg-white/[.06]" />}
    <img src={src} alt={alt} className={`${className} ${fit === 'cover' ? 'object-cover' : 'object-contain'} transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setLoaded(true)} />
  </span>
}

export function ItemIcon({ item, className = 'size-full' }: { item: KeepsyItem; className?: string }) {
  if (item.customIcon) return <img src={item.customIcon} alt="" className={`${className} object-cover`} />
  if (item.type === 'YouTube' && item.youtubeThumbnail) return <LoadingImage src={item.youtubeThumbnail} alt="" className={className} fit="cover" />
  if (item.type === 'YouTube') return <BrandIcon name="YouTube" className={className} />
  if (item.type === 'Crypto Wallet' && item.walletNetwork) return <BrandIcon network={item.walletNetwork} className={className} />
  if (item.faviconUrl && item.type !== 'Note') return <img src={item.faviconUrl} alt="" className={`${className} object-contain`} />
  return <img src={typeIcons[item.type]} alt={item.type} className={`${className} object-contain`} />
}
