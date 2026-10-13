import { Search, Building2, ChevronDown, SlidersHorizontal, LockKeyhole } from 'lucide-react'
import Button from '@/components/common/Button'
import { cn } from '@/utils'

const ENVS = [
  { value: 'all', label: 'Any Env' },
  { value: 'production', label: 'Prod' },
  { value: 'staging', label: 'Stage' },
]

/**
 * Vault-specific toolbar (white search, client select, env toggle, page actions).
 * Doesn't use DataToolbar: the design has a different layout (no sort control, action buttons inline).
 * Fully controlled — wire it to useResourceList.
 *
 * @param {{ value, onChange, placeholder }} search
 * @param {{ value, onChange, options }} client
 * @param {{ value, onChange }} env
 */
export default function VaultToolbar({ search, client, env, onBatchRotate, onAdd }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1 lg:max-w-[540px]">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="search"
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          placeholder={search.placeholder}
          aria-label="Search credentials"
          className={cn(
            'h-10 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm text-neutral-800 sm:pr-14',
            'placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-400'
          )}
        />
        {/* Visual hint only — we deliberately don't hijack the browser's Ctrl/Cmd+F */}
        <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 sm:block">
          ⌘F
        </span>
      </div>

      <div className="relative">
        <Building2 size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <select
          aria-label="Client"
          value={client.value}
          onChange={(e) => client.onChange(e.target.value)}
          className="h-10 min-w-[10rem] cursor-pointer appearance-none rounded-xl border border-neutral-200 bg-white pl-9 pr-9 text-sm font-medium text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        >
          {client.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" />
      </div>

      <div role="group" aria-label="Environment" className="flex items-center gap-0.5 rounded-lg bg-indigo-50 p-1">
        {ENVS.map((e) => {
          const active = env.value === e.value
          return (
            <button
              key={e.value}
              type="button"
              aria-pressed={active}
              onClick={() => env.onChange(e.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition-colors',
                active ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-700'
              )}
            >
              {e.label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
        <Button variant="secondary" size="lg" icon={SlidersHorizontal} onClick={onBatchRotate}>
          Batch Rotate
        </Button>
        <Button size="lg" icon={LockKeyhole} onClick={onAdd}>
          + Store New Credential
        </Button>
      </div>
    </div>
  )
}
