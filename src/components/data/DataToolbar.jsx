import { Search, ChevronDown, ArrowDown, ArrowUp, LayoutList, LayoutGrid } from 'lucide-react'
import Card from '@/components/common/Card'
import { cn } from '@/utils'

export function FilterSelect({ value, onChange, options = [], ariaLabel, className }) {
  return (
    <div className={cn('relative', className)}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-9 w-full cursor-pointer appearance-none rounded-lg bg-indigo-50 pl-3.5 pr-9 text-sm font-medium text-neutral-800',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400'
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.count != null ? `${o.label} (${o.count})` : o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
    </div>
  )
}

export function SortControl({ options = [], sort, order, onChange }) {
  const Arrow = order === 'asc' ? ArrowUp : ArrowDown
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Sort:</span>
      <div className="flex h-8 items-center rounded-lg bg-indigo-50 pl-3 pr-1.5 text-primary-700 focus-within:ring-2 focus-within:ring-primary-400">
        <select
          aria-label="Sort by"
          value={sort}
          onChange={(e) => onChange(e.target.value, order)}
          className="cursor-pointer appearance-none bg-transparent text-xs font-semibold focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          type="button"
          aria-label={order === 'asc' ? 'Sort ascending' : 'Sort descending'}
          onClick={() => onChange(sort, order === 'asc' ? 'desc' : 'asc')}
          className="ml-1 rounded p-1 hover:bg-indigo-100"
        >
          <Arrow size={13} />
        </button>
      </div>
    </div>
  )
}

const VIEW_ICONS = { list: LayoutList, grid: LayoutGrid }

export function ViewToggle({ value, onChange, views = ['list', 'grid'] }) {
  return (
    <div role="group" aria-label="View mode" className="flex items-center gap-0.5 rounded-lg bg-indigo-50 p-1">
      {views.map((v) => {
        const Icon = VIEW_ICONS[v]
        const active = v === value
        return (
          <button
            key={v}
            type="button"
            aria-pressed={active}
            aria-label={`${v} view`}
            onClick={() => onChange(v)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
              active ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-700'
            )}
          >
            <Icon size={16} />
          </button>
        )
      })}
    </div>
  )
}

/**
 * @param {{ value, onChange, placeholder }} search
 * @param {Array<{ key, value, onChange, options, ariaLabel }>} filters
 * @param {{ options, sort, order, onChange }} [sort]
 * @param {{ value, onChange, views? }} [view]
 */
export default function DataToolbar({ search, filters = [], sort, view, className }) {
  return (
    <Card padding="p-3" className={cn('flex flex-wrap items-center gap-3', className)}>
      <div className="relative min-w-[220px] flex-1">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          placeholder={search.placeholder}
          aria-label="Search"
          className={cn(
            'h-9 w-full rounded-lg bg-indigo-50 pl-10 pr-3 text-sm text-neutral-800 placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-400'
          )}
        />
      </div>

      {filters.map((f) => (
        <FilterSelect
          key={f.key}
          value={f.value}
          onChange={f.onChange}
          options={f.options}
          ariaLabel={f.ariaLabel}
          className="min-w-[9.5rem]"
        />
      ))}

      {(sort || view) && (
        <div className="flex items-center gap-3 sm:ml-1">
          {sort && <SortControl {...sort} />}
          {sort && view && <span className="hidden h-6 w-px bg-neutral-200 sm:block" />}
          {view && <ViewToggle {...view} />}
        </div>
      )}
    </Card>
  )
}