import { useState, useMemo } from 'react'
import { ClipboardList, Download, Plus } from 'lucide-react'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import Toast from '@/components/common/Toast'
import Table from '@/components/common/DataTable'
import Pagination from '@/components/data/Pagination'
import useToast from '@/hooks/useToast'
import useResourceList from '@/hooks/useResourceList'
import {
  fetchRequirements, createRequirement, updateRequirement, deleteRequirement,
} from '@/services/api/requirementsService'
import { getRequirementColumns } from './components/requirementColumns'
import RequirementFormModal from './components/RequirementFormModal'
import RequirementViewModal from './components/RequirementViewModal'
import { downloadRequirementsCsv } from './components/requirementsCsv'

// TODO(auth): PRD says Owner/Sales manage requirements, Viewer is read-only. Wire to real permissions.
const CAN_MANAGE = true

export default function Requirements() {
  const { toast, showToast } = useToast()
  const list = useResourceList(fetchRequirements, { perPage: 10 })

  const [form, setForm] = useState(null) // { requirement: row | null } while the modal is open
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const columns = useMemo(
    () =>
      getRequirementColumns({
        canManage: CAN_MANAGE,
        onView: (r) => setViewing(r),
        onEdit: (r) => setForm({ requirement: r }),
        onDelete: (r) => setDeleting(r),
      }),
    []
  )

  const handleSave = async (values) => {
    const editing = form?.requirement
    try {
      if (editing) {
        const saved = await updateRequirement(editing.id, values)
        showToast(`${saved.title} updated`)
      } else {
        const saved = await createRequirement(values)
        showToast(`${saved.title} created`)
      }
      list.refetch()
    } catch (err) {
      showToast(editing ? 'Could not update requirement' : 'Could not create requirement')
      throw err // keeps the modal open
    }
  }

  const handleDelete = async () => {
    setDeleteBusy(true)
    try {
      await deleteRequirement(deleting.id)
      showToast(`${deleting.title} deleted`)
      setDeleting(null)
      list.refetch()
    } catch {
      showToast('Could not delete requirement')
    } finally {
      setDeleteBusy(false)
    }
  }

  const handleExport = () => {
    if (!list.items.length) return showToast('No requirements to export')
    // TODO(api): use a server-side export endpoint so ALL rows are exported
    downloadRequirementsCsv(list.items)
    showToast('Current page exported to CSV')
  }

  const { meta } = list

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="flex items-center gap-3 text-2xl font-bold text-neutral-900">
            <ClipboardList size={28} className="text-primary-600" />
            Requirements
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Capture and track client requirements per project.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button variant="secondary" size="lg" icon={Download} onClick={handleExport}>Export</Button>
          {CAN_MANAGE && (
            <Button size="lg" icon={Plus} onClick={() => setForm({ requirement: null })}>Create Requirements</Button>
          )}
        </div>
      </div>

      <Card padding="p-0" className="overflow-hidden !border-indigo-100">
        <div className="flex items-center justify-between gap-3 bg-indigo-50 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-neutral-900">Client requirements</h2>
            <p className="mt-0.5 text-xs text-neutral-500">All captured requirements in one place.</p>
          </div>
          <span className="shrink-0 text-xs font-semibold text-primary-600">
            {meta.total} requirement{meta.total === 1 ? '' : 's'}
          </span>
        </div>

        <Table
          variant="soft"
          columns={columns}
          rows={list.items}
          loading={list.loading}
          error={list.error}
          onRetry={list.refetch}
          rowClassName="bg-indigo-50/60 hover:!bg-indigo-50"
          emptyMessage="No requirements yet. Create the first one."
        />

        {/* Hidden while everything fits on one page, as in the design */}
        {meta.total > 10 && (
          <Pagination
            page={meta.page}
            perPage={meta.perPage}
            total={meta.total}
            onPageChange={list.setPage}
            onPerPageChange={list.setPerPage}
            itemLabel="requirements"
          />
        )}
      </Card>

      {form && (
        <RequirementFormModal requirement={form.requirement} onClose={() => setForm(null)} onSubmit={handleSave} />
      )}

      <RequirementViewModal requirement={viewing} onClose={() => setViewing(null)} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        busy={deleteBusy}
        title="Delete requirement?"
      >
        You will permanently remove <span className="font-semibold text-neutral-900">{deleting?.title}</span> from your requirements list.
      </ConfirmDialog>

      <Toast message={toast} />
    </div>
  )
}