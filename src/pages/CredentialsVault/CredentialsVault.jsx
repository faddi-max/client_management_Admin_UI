import { useState, useMemo, useCallback } from 'react'
import Card from '@/components/common/Card'
import Table from '@/components/common/DataTable'
import Pagination from '@/components/data/Pagination'
import Toast from '@/components/common/Toast'
import TabsWithCount from '@/components/data/TabsWithCount'
import useToast from '@/hooks/useToast'
import useResourceList from '@/hooks/useResourceList'
import useCredentialsOverview from '@/hooks/useCredentialsOverview'
import useProjectFormOptions from '@/hooks/useProjectFormOptions' // only used for its client dropdown options
import { CREDENTIAL_CATEGORIES } from '@/constants/credentialConfig'
import {
  fetchCredentials, createCredential, revealCredential, copyCredential,
} from '@/services/api/credentialsService'
import CredentialStatCards from './components/CredentialStatCards'
import AddCredentialModal from './components/AddCredentialModal'
import VaultToolbar from './components/VaultToolbar'
import { VaultStatusCard, SecurityNotice } from './components/VaultBanners'
import { getCredentialColumns } from './components/credentialColumns'
import AuditHistoryDrawer from './components/AuditHistoryDrawer'

export default function CredentialsVault() {
  const { toast, showToast } = useToast()
  const { stats, vault, facets, loading, error, refetch: refetchOverview } = useCredentialsOverview()
  const { clients, clientsError } = useProjectFormOptions()
  const [addOpen, setAddOpen] = useState(false)
  const [auditCredential, setAuditCredential] = useState(null)

  const list = useResourceList(fetchCredentials, {
    perPage: 10,
    initialParams: { category: 'all', client: 'all', env: 'all' },
  })


  const tabs = useMemo(
    () => [{ value: 'all', label: 'All', count: facets?.total }, ...CREDENTIAL_CATEGORIES],
    [facets]
  )

  const clientOptions = useMemo(
    () => [{ value: 'all', label: 'All Clients' }, ...(facets?.clients ?? [])],
    [facets]
  )

  // Reveal / copy: the secret is handed straight to the caller and never stored here.
  // Each call is audited by the backend; we only refresh the "Access Audits Today" card afterwards.
  const handleReveal = useCallback(
    async (c) => {
      try {
        const res = await revealCredential(c.id)
        refetchOverview()
        return res
      } catch (err) {
        showToast('Could not reveal secret')
        throw err
      }
    },
    [showToast, refetchOverview]
  )

  const handleCopy = useCallback(
    async (c) => {
      try {
        const { value } = await copyCredential(c.id)
        await navigator.clipboard.writeText(value)
        refetchOverview()
        showToast('Secret copied to clipboard')
      } catch (err) {
        showToast('Could not copy secret')
        throw err
      }
    },
    [showToast, refetchOverview]
  )

  const rowHandlers = useMemo(
    () => ({
      onReveal: handleReveal,
      onCopy: handleCopy,
      onQuickAction: (type, c) => {
        if (type === 'audit history') {
          setAuditCredential(c)
          return
        }
        showToast(`${type} — ${c.name} (not wired yet)`)
      },
    }),
    [handleReveal, handleCopy, showToast]
  )

  // TODO(auth): pass canRevealSecrets from the real permission check once roles are defined
  const columns = useMemo(() => getCredentialColumns(rowHandlers), [rowHandlers])

  const handleAdd = async (values) => {
    try {
      await createCredential(values)
      list.refetch()
      refetchOverview() // total keys + counts change
      showToast(`${values.name.trim()} saved to vault`)
    } catch (err) {
      showToast('Could not save credential')
      throw err // keeps the modal open
    }
  }

  const { meta } = list

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Credentials Vault</h1>
            {vault?.version && (
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-mono text-xs font-medium text-primary-700">
                {vault.version}
              </span>
            )}
          </div>
          <p className="mt-1 max-w-xl text-sm text-neutral-500">
            End-to-end encrypted technical secrets, API keys, server credentials, and client database access.
          </p>
        </div>
        {vault && <VaultStatusCard vault={vault} />}
      </div>

      <SecurityNotice message={vault?.securityMessage} complianceLabel={vault?.complianceLabel} />

      <CredentialStatCards stats={stats} loading={loading} error={error} onRetry={refetchOverview} />

      <TabsWithCount
        tabs={tabs}
        value={list.params.category}
        onChange={(category) => list.setFilter('category', category)}
        ariaLabel="Filter by credential category"
      />

      <VaultToolbar
        search={{
          value: list.searchInput,
          onChange: list.setSearchInput,
          placeholder: 'Search secrets by client, environment, or service name…',
        }}
        client={{ value: list.params.client, onChange: (v) => list.setFilter('client', v), options: clientOptions }}
        env={{ value: list.params.env, onChange: (v) => list.setFilter('env', v) }}
        onBatchRotate={() => showToast('Batch rotate (not wired yet)')}
        onAdd={() => setAddOpen(true)}
      />

      <Card padding="p-0" className="overflow-hidden">
        <Table
          variant="soft"
          columns={columns}
          rows={list.items}
          loading={list.loading}
          error={list.error}
          onRetry={list.refetch}
          emptyMessage="No credentials match your filters."
        />
        <Pagination
          page={meta.page}
          perPage={meta.perPage}
          total={meta.total}
          onPageChange={list.setPage}
          onPerPageChange={list.setPerPage}
          itemLabel="credentials"
        />
      </Card>

      <AddCredentialModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        clients={clients}
        clientsError={clientsError}
      />
      <Toast message={toast} />
      <AuditHistoryDrawer
        credential={auditCredential}
        onClose={() => setAuditCredential(null)}
        onExport={() => showToast(`Audit CSV export for ${auditCredential?.name} is not wired yet`)}
      />
    </div>
  )
}
