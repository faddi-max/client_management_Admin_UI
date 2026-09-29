import Card from './Card'
import { cn } from '@/utils'

// Full class strings so Tailwind can detect them.
const GLOW_BASE =
  "relative overflow-hidden [&>*]:relative before:pointer-events-none before:absolute before:-top-12 before:-right-12 before:h-36 before:w-36 before:rounded-full before:blur-2xl before:content-['']"

const GLOWS = {
  indigo: 'before:bg-indigo-100/70',
  green: 'before:bg-green-100/80',
  orange: 'before:bg-orange-100/80',
}

/**
 * New optional props (all backwards compatible):
 * @param {'indigo'|'green'|'orange'} [glow] - soft corner glow
 * @param {() => void} [onClick]             - makes the card keyboard-accessible and clickable
 * @param {boolean} [active]                 - selected ring (use with onClick)
 */
export default function StatCard({
  icon: Icon,
  iconClassName,
  iconWrapperClassName,
  label,
  value,
  valueClassName,
  children,
  className,
  glow,
  onClick,
  active = false,
  ...props
}) {
  const interactive = typeof onClick === 'function'

  const interactiveProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-pressed': active,
        onClick,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick(e)
          }
        },
      }
    : {}

  return (
    <Card
      padding="p-3.5 sm:p-4"
      className={cn(
        'flex flex-col gap-2',
        glow && [GLOW_BASE, GLOWS[glow]],
        interactive &&
          'cursor-pointer transition-all duration-150 hover:shadow-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
        active && 'ring-2 ring-primary-500',
        className
      )}
      {...interactiveProps}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          {label}
        </p>
        {Icon && (
          iconWrapperClassName ? (
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                iconWrapperClassName
              )}
            >
              <Icon size={16} className={iconClassName} />
            </div>
          ) : (
            <Icon
              size={16}
              className={cn('shrink-0 mt-0.5', iconClassName || 'text-neutral-400')}
            />
          )
        )}
      </div>

      <p className={cn('text-2xl font-bold text-neutral-900 leading-tight', valueClassName)}>
        {value}
      </p>

      {children && <div className="space-y-0.5 mt-0.5">{children}</div>}
    </Card>
  )
}