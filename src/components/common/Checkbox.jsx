import { Check, Minus } from 'lucide-react'
import { cn } from '@/utils'

export default function Checkbox({ checked = false, indeterminate = false, onChange, className, ...props }) {
  const filled = checked || indeterminate
  return (
    <span className={cn('relative inline-flex h-[18px] w-[18px] shrink-0', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={cn(
          'h-full w-full cursor-pointer appearance-none rounded-[5px] border transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
          filled
            ? 'border-primary-600 bg-primary-600'
            : 'border-neutral-300 bg-white hover:border-neutral-400'
        )}
        {...props}
      />
      {filled &&
        (indeterminate ? (
          <Minus size={12} strokeWidth={3} className="pointer-events-none absolute inset-0 m-auto text-white" />
        ) : (
          <Check size={12} strokeWidth={3} className="pointer-events-none absolute inset-0 m-auto text-white" />
        ))}
    </span>
  )
}