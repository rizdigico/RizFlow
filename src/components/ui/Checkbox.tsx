import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | ReactNode
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkId = id || Math.random().toString(36).slice(2)
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={checkId} className="flex items-start gap-3 cursor-pointer group">
          <input
            ref={ref}
            type="checkbox"
            id={checkId}
            className={cn(
              'mt-0.5 h-5 w-5 rounded border-2 border-slate-300 text-teal',
              'focus:ring-2 focus:ring-teal/30 focus:ring-offset-1 cursor-pointer',
              'checked:bg-teal checked:border-teal transition-colors duration-150',
              className
            )}
            {...props}
          />
          {label && (
            <span className="text-sm text-slate-600 leading-snug group-hover:text-slate-800 transition-colors">
              {label}
            </span>
          )}
        </label>
        {error && <p className="text-xs text-red-500 ml-8">{error}</p>}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'
export { Checkbox }
