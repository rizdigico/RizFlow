import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-slate-800 text-sm placeholder:text-slate-400',
            'transition-all duration-150 outline-none',
            'focus:border-teal focus:ring-2 focus:ring-teal/20',
            'disabled:bg-slate-50 disabled:cursor-not-allowed',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-200',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span>
            {error}
          </p>
        )}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export { Input }
