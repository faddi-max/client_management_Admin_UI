import { useState, useMemo, useEffect } from 'react'
import { Download, Plus } from 'lucide-react'
import Button from '@/components/common/Button'
import Toast from '@/components/common/Toast'
import useToast from '@/hooks/useToast'
import useResourceList from '@/hooks/useResourceList'
import ResourceList from '@/components/data/ResourceList'
import { clientsMock } from '@/mocks/clientsMock'
import ClientStatCards from './components/ClientStatCards'
import AddClientModal from './components/AddClientModal'
import ClientDrawer from './components/ClientDrawer'
import ClientGrid from './components/ClientGrid'
import { getClientColumns } from './components/clientColumns'
import {
  fetchClients,
  createClient,
  fetchClientDetail,
  STATUS_FILTER_OPTIONS,
  LEAD_FILTER_OPTIONS,
} from './../../services/api/clientsService'
import { downloadClientsCsv } from './components/clientsCsv'

const FILTER_LABELS = {
  directory: 'Total directory',
  retainers: 'Active retainers',
  mrr: 'MRR accounts',
  attention: 'Attention required',
}

const FILTERS = [
  { key: 'status', label: 'Status', options: STATUS_FILTER_OPTIONS },
  { key: 'lead', label: 'Account lead', options: LEAD_FILTER_OPTIONS },
]

const SORT_OPTIONS = [
  { value: 'mrr', label: 'MRR Value' },
  { value: 'name', label: 'Client Name' },
  { value: 'lastActivity', label: 'Last Activity' },
]

export default function Clients() {
  const { toast, showToast } = useToast()
  const [stats, setStats] = useState(clientsMock.stats)
  const [addOpen, setAddOpen] = useState(false)
  const [viewClient, setViewClient] = useState(null)
  const [detail, setDetail] = useState(null)

  const list = useResourceList(fetchClients, {
    perPage: 10,
    initialParams: { sort: 'mrr', order: 'desc', status: 'all', lead: 'all', segment: '' },
  })

  // Load extra detail for the drawer whenever a client is opened
  useEffect(() => {
    if (!viewClient) return
    let cancelled = false
    setDetail(null)
    fetchClientDetail(viewClient.id)
      .then((d) => { if (!cancelled) setDetail(d) })
      .catch(() => { if (!cancelled) showToast('Could not load client details') })
    return () => { cancelled = true }
  }, [viewClient, showToast])

  // Stat-card selection is just another server filter
  const activeFilter = list.params.segment || null
  const handleSelect = (key) => {
    const next = activeFilter === key ? null : key
    list.setFilter('segment', next ?? '')
    showToast(next ? `Filter: ${FILTER_LABELS[next]}` : 'Filter cleared')
  }

  // Shared by the table and the grid so both behave identically
  const rowHandlers = useMemo(
    () => ({
      onView: (c) => setViewClient(c),
      onQuickAction: (type, c) => showToast(`${type} — ${c.name} (not wired yet)`),
      onMore: (c) => showToast(`More actions for ${c.name} (not wired yet)`),
    }),
    [showToast]
  )

  const columns = useMemo(() => getClientColumns(rowHandlers), [rowHandlers])

  const handleAdd = async (values) => {
    try {
      await createClient(values)
      setStats((s) => ({ ...s, totalDirectory: { ...s.totalDirectory, value: s.totalDirectory.value + 1 } }))
      list.refetch()
      showToast(`${values.company} added`)
    } catch {
      showToast('Could not add client')
    }
  }

  const handleExport = () => {
    if (!list.items.length) return showToast('No client records to export')
    // TODO(api): use a server-side export endpoint so ALL filtered rows are exported
    downloadClientsCsv(list.items)
    showToast('Current page exported to CSV')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Clients</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage client accounts, contract values, operational assets, and active delivery pipelines.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button variant="secondary" size="lg" icon={Download} onClick={handleExport}>Export CSV</Button>
          <Button size="lg" icon={Plus} onClick={() => setAddOpen(true)}>Add Client</Button>
        </div>
      </div>

      <ClientStatCards stats={stats} activeKey={activeFilter} onSelect={handleSelect} />

      <ResourceList
        list={list}
        columns={columns}
        itemLabel="clients"
        searchPlaceholder="Search clients by name, contact, domain, tag..."
        filters={FILTERS}
        sortOptions={SORT_OPTIONS}
        selectable
        emptyMessage="No clients match your filters."
        renderGrid={(l) => (
          <ClientGrid
            list={l}
            onView={rowHandlers.onView}
            onQuickAction={rowHandlers.onQuickAction}
            onMore={rowHandlers.onMore}
            emptyMessage="No clients match your filters."
          />
        )}
      />

      <AddClientModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />

      <ClientDrawer
        client={viewClient}
        detail={detail}
        open={!!viewClient}
        onClose={() => setViewClient(null)}
        onAssetAction={(a) => showToast(`${a.title} — vault access not wired yet`)}
        onAction={(type) => showToast(`${type} (not wired yet)`)}
      />
      <Toast message={toast} />
    </div>
  )
}