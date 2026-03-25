import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'navy'
  hover?: boolean
}

export function Card({ className, variant = 'default', hover = false, children, ...props }: CardProps) {
  const variants = {
    default: 'bg-navy-900/50 backdrop-blur-sm border border-white/5 shadow-soft',
    elevated: 'bg-navy-800/80 shadow-2xl border border-white/10',
    bordered: 'bg-navy-900/50 border-2 border-teal/30',
    navy: 'bg-navy text-white border border-navy-light',
  }
  return (
    <div
      className={cn(
        'rounded-2xl p-6',
        variants[variant],
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
