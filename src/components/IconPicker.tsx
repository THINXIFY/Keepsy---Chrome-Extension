import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, X } from 'lucide-react'
import type { ItemType } from '../types'
import { typeIcons } from '../lib/typeIcons'

export function IconPicker({ type, icon, onChange }: { type: ItemType; icon?: string; onChange: (value: { customIcon?: string }) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = (file?: File) => {
    if (!file || !['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(file.type) || file.size > 1024 * 1024) return
    if (file.type === 'image/svg+xml') { const r = new FileReader(); r.onload = () => onChange({ customIcon: String(r.result) }); r.readAsDataURL(file); return }
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128
      const size = Math.min(image.width, image.height); const x = (image.width - size) / 2; const y = (image.height - size) / 2
      canvas.getContext('2d')?.drawImage(image, x, y, size, size, 0, 0, 128, 128)
      URL.revokeObjectURL(url)
      onChange({ customIcon: canvas.toDataURL('image/webp', .82) })
    }
    image.src = url
  }
  return <div>
    <div className="mb-1 text-[11px] font-medium text-muted">Icon</div>
    <div className="flex items-center gap-3 rounded-xl border border-line bg-card p-2.5 transition-colors duration-200">
      <div className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-primary/20 bg-primary/10">
        <AnimatePresence mode="wait">
          {icon
            ? <motion.img key="custom" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }} src={icon} alt="Custom icon preview" className="size-full object-cover" />
            : <motion.img key="default" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }} src={typeIcons[type]} alt="" className="size-full object-contain p-1" />}
        </AnimatePresence>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-2 text-[11px] font-medium text-[#81b0ff] transition hover:border-primary/40 hover:bg-primary/10 focus:outline-none focus:ring-4 focus:ring-primary/10 active:scale-[.97]">
          <ImagePlus size={13} />Upload Custom Icon
        </button>
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={e => upload(e.target.files?.[0])} />
        {icon && <button type="button" title="Remove custom icon" aria-label="Remove custom icon" onClick={() => onChange({ customIcon: undefined })} className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-white/[.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary active:scale-[.94]"><X size={14} /></button>}
      </div>
    </div>
    <p className="mt-1.5 text-[9px] text-muted/70">PNG, JPG, SVG or WebP. Optimized and stored locally. Remove to restore the default {type} icon.</p>
  </div>
}
