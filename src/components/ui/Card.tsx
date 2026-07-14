import type { HTMLAttributes, ReactNode } from 'react'

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return <div className={`rounded-panel border border-line bg-card ${className}`} {...props}>{children}</div>
}
