import { cn } from '@/utils'

/**
 * Generic white panel container — used by stat cards, the funnel box,
 * Cashflow, Attention Center, Renewals Tracker, and any future card-style
 * panel across the app.
 *
 * @param {string} [padding] - Tailwind padding classes, override per usage
 *   (e.g. dense stat cards vs. spacious content panels)
 */
export default function Card({ className, children, padding = 'p-4 sm:p-5', ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-neutral-200 shadow-sm',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
