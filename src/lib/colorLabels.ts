export type LabelColor = { text: string; bg: string; border: string }

const hexPalette: Record<string, string> = {
  finance: '#34D399',
  crypto: '#FB923C',
  work: '#60A5FA',
  learning: '#C084FC',
  personal: '#22D3EE',
  business: '#818CF8',
  development: '#2DD4BF',
  shopping: '#F472B6',
  travel: '#38BDF8',
}
const fallbackHexes = Object.values(hexPalette)

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function hashCode(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0
  return Math.abs(hash)
}

export function labelColor(name: string): LabelColor {
  const key = name.trim().toLowerCase()
  const hex = hexPalette[key] ?? fallbackHexes[hashCode(key) % fallbackHexes.length]
  return { text: hex, bg: hexToRgba(hex, 0.14), border: hexToRgba(hex, 0.32) }
}
