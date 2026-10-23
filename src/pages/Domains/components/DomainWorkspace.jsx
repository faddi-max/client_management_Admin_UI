import { useMemo, useState } from 'react'
import { Network } from 'lucide-react'
import Card from '@/components/common/Card'
import Table from '@/components/common/DataTable'
import Pagination from '@/components/data/Pagination'
import useResourceList from '@/hooks/useResourceList'
import useDomainAssetDetail from '@/hooks/useDomainAssetDetail'
import useDomainFacets from '@/hooks/useDomainFacets'
import { fetchDomainAssets } from '@/services/api/domainsService'
import { getDomainColumns } from './domainColumns'
import AssetDetailPanel from './AssetDetailPanel'
import DomainFilters from './DomainFilters'

export default function DomainWorkspace({ showToast }) {
  const { facets } = useDomainFacets()
  const list = useResourceList(fetchDomainAssets, {
    perPage: 10,
    initialParams: {
      sort: 'renewal', order: 'asc',
      kind: 'all', client: 'all', provider: 'all', renewalWithin: 'all', status: 'all',
    },
  })
  const [view, setView] = useState('table')
  const [activeId, setActiveId] = useState(null)
  const [panelOpen, setPanelOpen] = useState(true)

  // Falls back to the first row, so the panel is never empty when there are results
  const selected = useMemo(
    () => list.items.find((a) => a.id === activeId) ?? list.items[0] ?? null,
    [list.items, activeId]
  )
  const { detail, loading: detailLoading, error: detailError } = useDomainAssetDetail(
    view === 'table' && panelOpen && selected ? selected.id : null
  )

  const columns = useMemo(
    () => getDomainColumns({ onQuickAction: (type, a) => showToast(`${type} — ${a.hostname} (not wired yet)`) }),
    [showToast]
  )

  const { meta } = list

  return (
    <section className="space-y-6">
      <DomainFilters
        list={list}
        facets={facets}
        view={view}
        onViewChange={setView}
        onMore={() => showToast('More filters (not wired yet)')}
      />

      {view === 'topology' ? (
        <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-white">
          <div className="text-center">
            <Network size={40} className="mx-auto mb-3 text-neutral-300" />
            <p className="text-sm font-medium text-neutral-400">Topology view coming soon</p>
            <p className="mt-1 text-xs text-neutral-300">Switch back to Table to manage assets.</p>
          </div>
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start">
          <Card padding="p-0" className="min-w-0 flex-1 overflow-hidden">
            <Table
              variant="soft"
              columns={columns}
              rows={list.items}
              loading={list.loading}
              error={list.error}
              onRetry={list.refetch}
              emptyMessage="No assets match your filters."
              selectable
              selectedIds={list.selectedIds}
              onSelectionChange={list.setSelectedIds}
              onRowClick={(a) => { setActiveId(a.id); setPanelOpen(true) }}
              rowClassName={(a) => (panelOpen && a.id === selected?.id ? 'bg-indigo-50/70 hover:!bg-indigo-50' : '')}
            />
            <Pagination
              page={meta.page}
              perPage={meta.perPage}
              total={meta.total}
              onPageChange={list.setPage}
              onPerPageChange={list.setPerPage}
              itemLabel="assets"
            />
          </Card>

          {panelOpen && selected && (
            <AssetDetailPanel
              className="w-full xl:sticky xl:top-0 xl:w-[400px] xl:shrink-0"
              asset={selected}
              detail={detail}
              loading={detailLoading}
              error={detailError}
              onClose={() => setPanelOpen(false)}
              onInfo={() => showToast(`${selected.hostname} info (not wired yet)`)}
            />
          )}
        </div>
      )}
    </section>
  )
}