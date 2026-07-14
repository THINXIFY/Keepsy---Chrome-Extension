import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export function WalletQr({ address }: { address: string }) { const [src, setSrc] = useState(''); useEffect(() => { QRCode.toDataURL(address, { margin: 1, width: 220, color: { dark: '#010207', light: '#ffffff' } }).then(setSrc).catch(() => setSrc('')) }, [address]); return <div className="rounded-panel border border-line bg-white p-3">{src ? <img src={src} alt="Wallet address QR code" className="mx-auto size-44" /> : <div className="grid size-44 place-items-center text-xs text-midnight">Generating QR...</div>}</div> }
