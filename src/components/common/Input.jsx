import { forwardRef } from 'react'
import { cn } from '@/utils'

/**
 * Input — controlled text input with label, error, and optional leading icon.
 *
 * @param {string}           label
 * @param {string}           error
 * @param {React.FC}         icon      — leading icon component
 * @param {string}           hint
 */
const Input = forwardRef(function Input(
  { label, error, icon: Icon, hint, className, id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
          />
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border px-3 py-2 text-sm',
            'placeholder:text-neutral-400 text-neutral-800',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent',
            Icon && 'pl-9',
            error
              ? 'border-red-400 bg-red-50'
              : 'border-neutral-300 bg-white hover:border-neutral-400',
            className
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500">{error}</p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-neutral-400">{hint}</p>
      )}
    </div>
  )
})

export default Input
