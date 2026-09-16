import { cn } from '@/utils'

// Matches every pill style seen in the design:
// - neutral: "HQ LIVE ENGINE", "NYC CLUSTER 01"
// - warning: "3 OVERDUE", "Due Today", "High Priority", "Within 7d"
// - primary: soft-purple count pills (e.g. sidebar-style badges reused inline)
// - danger / success: reserved for future states (failed, completed, etc.)
const VARIANTS = {
  neutral: 'bg-neutral-100 text-neutral-500',
  primary: 'bg-primary-50 text-primary-600',
  warning: 'bg-orange-500 text-white',
  warningSoft: 'bg-orange-50 text-orange-600',
  danger: 'bg-red-500 text-white',
  success: 'bg-green-50 text-green-600',
}

/**
 * @param {keyof typeof VARIANTS} [variant]
 * @param {boolean} [dot] - show a small leading dot (e.g. "NYC CLUSTER 01 ●")
 */
export default function Badge({ variant = 'neutral', dot = false, className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full',
        'text-[11px] font-bold uppercase tracking-wide whitespace-nowrap',
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {children}
    </span>
  )
}
