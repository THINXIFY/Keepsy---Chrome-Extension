import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: 'primary' | 'ghost' | 'soft' }

export function Button({ children, className = '', variant = 'primary', ...props }: Props) {
  const styles = {
    primary: 'bg-gradient-to-b from-primary to-secondary text-white shadow-[inset_0_1px_0_rgba(255,255,255,.14)] hover:from-[#2B7FFF] hover:to-primary hover:shadow-[0_8px_20px_rgba(0,87,255,.22)]',
    ghost: 'text-muted hover:bg-white/[.055] hover:text-[#E6E8F0]',
    soft: 'border border-line bg-card text-[#E6E8F0] hover:border-[#2B7FFF]/60 hover:bg-[#151b29]',
  }
  return <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary/70 focus:ring-offset-2 focus:ring-offset-midnight disabled:pointer-events-none disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>{children}</button>
}
