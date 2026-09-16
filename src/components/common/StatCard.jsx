import Card from './Card'
import { cn } from '@/utils'

export default function StatCard({
  icon: Icon,
  iconClassName,
  iconWrapperClassName,
  label,
  value,
  valueClassName,
  children,
  className,
}) {
  return (
    <Card padding="p-4" className={cn('flex flex-col gap-2', className)}>
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