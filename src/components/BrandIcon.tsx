import { siBitcoin, siBnbchain, siEthereum, siOptimism, siPolygon, siSolana, siYoutube, type SimpleIcon } from 'simple-icons'
import type { WalletNetwork } from '../types'
import bitcoin from 'cryptocurrency-icons/svg/color/btc.svg'
import ethereum from 'cryptocurrency-icons/svg/color/eth.svg'
import bnb from 'cryptocurrency-icons/svg/color/bnb.svg'
import solana from 'cryptocurrency-icons/svg/color/sol.svg'
import tron from 'cryptocurrency-icons/svg/color/trx.svg'
import polygon from 'cryptocurrency-icons/svg/color/matic.svg'
import avalanche from 'cryptocurrency-icons/svg/color/avax.svg'

const networks: Partial<Record<WalletNetwork, SimpleIcon>> = { BTC: siBitcoin, ETH: siEthereum, BNB: siBnbchain, SOL: siSolana, Polygon: siPolygon, Optimism: siOptimism }
const networkAssets: Partial<Record<WalletNetwork, string>> = { BTC: bitcoin, ETH: ethereum, BNB: bnb, SOL: solana, TRON: tron, Polygon: polygon, Avalanche: avalanche }

export function BrandIcon({ name, network, className = 'size-4' }: { name?: 'YouTube'; network?: WalletNetwork; className?: string }) {
  const icon = name === 'YouTube' ? siYoutube : network ? networks[network] : undefined
  const asset = network ? networkAssets[network] : undefined
  if (asset) return <img src={asset} alt={`${network} network`} className={className} />
  if (!icon) return <span aria-label={network ? `${network} network` : undefined} className={`grid place-items-center rounded-full bg-white/[.08] text-[8px] font-bold text-white ${className}`}>{network?.slice(0, 2)}</span>
  return <svg viewBox="0 0 24 24" aria-label={icon.title} role="img" className={className} fill={`#${icon.hex}`}><path d={icon.path} /></svg>
}
