import { cn } from '@/utils'

// primary  → filled indigo, e.g. "Dispatch Incident"
// secondary → white/outline, e.g. "Timeline Sync", "Generate Runbook"
const VARIANTS = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
  secondary: 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200',
  ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-600',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3.5 py-2 text-sm',
  lg: 'px-4 py-2.5 text-sm',
}

/**
 * @param {keyof typeof VARIANTS} [variant]
 * @param {keyof typeof SIZES} [size]
 * @param {import('lucide-react').LucideIcon} [icon] - optional leading icon
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium',
        'transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon size={15} className="shrink-0" />}
      {children}
    </button>
  )
}
