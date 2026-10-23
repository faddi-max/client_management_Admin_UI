import { Search, ChevronDown, SlidersHorizontal, Timer, X, Table as TableIcon, Network } from 'lucide-react'
import Card from '@/components/common/Card'
import TabsWithCount from '@/components/data/TabsWithCount'
import MultiSelectFilter from '@/components/data/MultiSelectFilter'
import { ASSET_KINDS, RENEWAL_WINDOWS, HEALTH_FILTERS } from '@/constants/domainConfig'
import { cn } from '@/utils'

const VIEWS = [
  { value: 'table', label: 'Table', icon: TableIcon },
  { value: 'topology', label: 'Topology', icon: Network },
]

/** "Client: All Clients (34)" — a native <select> laid invisibly over a styled pill (keeps keyboard/mobile behaviour). */
function PrefixSelect({ label, value, onChange, options }) {
  const current = options.find((o) => o.value === value) ?? options[0]
  return (
    <div className="relative flex h-9 items-center gap-1.5 rounded-lg bg-indigo-50 pl-3.5 pr-3 text-sm focus-within:ring-2 focus-within:ring-primary-400">
      <span className="shrink-0 text-neutral-500">{label}:</span>
      <span className="min-w-0 max-w-[180px] truncate font-medium text-neutral-800">{current?.label}</span>
      <ChevronDown size={14} className="ml-auto shrink-0 text-neutral-500" />
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function ViewSwitch({ value, onChange }) {
  return (
    <div role="group" aria-label="View mode" className="flex shrink-0 items-center gap-0.5 rounded-lg bg-indigo-50 p-1">
      {VIEWS.map(({ value: v, label, icon: Icon }) => {
        const active = v === value
        return (
          <button
            key={v}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(v)}
            className={cn(
              'inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
              active ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
            )}
          >
            <Icon size={14} /> {label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Toolbar card for the Domains page: tabs + view switch, search, filters.
 * Fully controlled by useResourceList (`list`) and the facets payload. Same behaviour as the Invoices toolbar.
 *
 * @param {{ params, searchInput, setSearchInput, setFilter }} list
 * @param {import('@/services/api/domainsService').DomainFacets|null} facets
 */
export default function DomainFilters({ list, facets, view, onViewChange, onMore }) {
  const { params, setFilter } = list

  const tabs = [
    { value: 'all', label: 'All Infrastructure', count: facets?.total },
    ...(facets?.kinds ?? ASSET_KINDS),
  ]

  const clients = facets?.clients ?? []
  const clientOptions = [
    { value: 'all', label: clients.length ? `All Clients (${clients.length})` : 'All Clients' },
    ...clients,
  ]

  // provider is stored as "cloudflare,aws" (or 'all') so it travels as one plain query param
  const providerValue = params.provider === 'all' ? [] : String(params.provider).split(',')
  const setProviders = (values) => setFilter('provider', values.length ? values.join(',') : 'all')

  const renewalActive = params.renewalWithin !== 'all'
  const renewalLabel = RENEWAL_WINDOWS.find((w) => w.value === params.renewalWithin)?.label

  return (
    <Card padding="p-4" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsWithCount
          className="min-w-0 flex-1"
          variant="plain"
          tabs={tabs}
          value={params.kind}
          onChange={(kind) => setFilter('kind', kind)}
          ariaLabel="Filter by infrastructure type"
        />
        <ViewSwitch value={view} onChange={onViewChange} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 lg:max-w-[560px]">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={list.searchInput}
            onChange={(e) => list.setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') list.setSearchInput('') }}
            placeholder="Search domains, server hostnames, IP, client, registrar…"
            aria-label="Search infrastructure"
            className="h-9 w-full rounded-lg bg-indigo-50 pl-10 pr-12 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 [&::-webkit-search-cancel-button]:hidden"
          />
          {list.searchInput ? (
            <button
              type="button"
              onClick={() => list.setSearchInput('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-primary-700 hover:bg-indigo-100"
            >
              <X size={14} />
            </button>
          ) : (
            // Visual hint only (as in the design); we don't hijack the browser shortcut
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md bg-indigo-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary-700 sm:block">
              ⌘K
            </kbd>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
          <PrefixSelect label="Client" value={params.client} onChange={(v) => setFilter('client', v)} options={clientOptions} />

          <MultiSelectFilter
            label="Provider"
            allLabel="All Providers"
            options={facets?.providers ?? []}
            value={providerValue}
            onChange={setProviders}
          />

          {renewalActive ? (
            <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-orange-100 pl-3 pr-1.5 text-sm font-medium text-orange-800">
              <Timer size={15} className="shrink-0" />
              {renewalLabel}
              <button
                type="button"
                onClick={() => setFilter('renewalWithin', 'all')}
                aria-label="Clear renewal filter"
                className="rounded p-1 hover:bg-orange-200"
              >
                <X size={14} />
              </button>
            </span>
          ) : (
            <PrefixSelect
              label="Renewal"
              value={params.renewalWithin}
              onChange={(v) => setFilter('renewalWithin', v)}
              options={RENEWAL_WINDOWS}
            />
          )}

          <PrefixSelect label="Status" value={params.status} onChange={(v) => setFilter('status', v)} options={HEALTH_FILTERS} />

          <button
            type="button"
            onClick={onMore}
            aria-label="More filters"
            title="More filters"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-neutral-600 transition-colors hover:bg-indigo-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>
    </Card>
  )
}