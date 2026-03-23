import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  tight?: boolean
}

export function Container({ className, tight = false, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        tight ? 'max-w-4xl' : 'max-w-7xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
