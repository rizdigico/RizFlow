import { type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
}

export function Avatar({ className, size = 'md', fallback, src, alt = '', ...props }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  }
  if (!src && fallback) {
    return (
      <div
        className={cn(
          'rounded-full bg-teal/10 text-teal font-semibold flex items-center justify-center flex-shrink-0',
          sizes[size],
          className
        )}
      >
        {fallback.slice(0, 2).toUpperCase()}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-full object-cover flex-shrink-0 ring-2 ring-white', sizes[size], className)}
      {...props}
    />
  )
}
