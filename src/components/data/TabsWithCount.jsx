import { cn } from '@/utils'

/**
 * Pill tabs with count chips — drives a single filter value (e.g. lifecycle stage).
 * Same toggle-button pattern as ViewToggle in DataToolbar.
 *
 * @param {Array<{ value: string, label: string, count?: number }>} tabs
 * @param {string} value               - selected tab value
 * @param {(value: string) => void} onChange
 * @param {'pill'|'plain'} [variant]   - 'pill' (default): inactive tabs are bordered white buttons.
 *                                       'plain': inactive tabs are flat text (for use inside a Card toolbar).
 * @param {string} [className]
 */
const INACTIVE = {
  pill: 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50',
  plain: 'text-neutral-600 hover:bg-indigo-50',
}

export default function TabsWithCount({ tabs = [], value, onChange, ariaLabel = 'Filter', variant = 'pill', className }) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      {tabs.map((t) => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(t.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
              active ? 'bg-primary-600 text-white shadow-sm' : INACTIVE[variant] ?? INACTIVE.pill
            )}
          >
            {t.label}
            {t.count != null && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none',
                  active ? 'bg-white/20 text-white' : 'bg-indigo-50 text-primary-600'
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}