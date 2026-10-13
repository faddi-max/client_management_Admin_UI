import { useState } from 'react'
import { Download, MailCheck, PlusCircle } from 'lucide-react'
import Toast from '@/components/common/Toast'
import useToast from '@/hooks/useToast'
import useProjectFormOptions from '@/hooks/useProjectFormOptions'
import { createInvoice } from '@/services/api/invoicesService'
import InvoiceStatCards from './components/InvoiceStatCards'
import InvoiceWorkspace from './components/InvoiceWorkspace'
import AddInvoiceModal from './components/AddInvoiceModal'

export default function Invoices() {
  const { toast, showToast } = useToast()
  const { clients, clientsError } = useProjectFormOptions()
  const [createOpen, setCreateOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreate = async (values) => {
    try {
      const invoice = await createInvoice(values)
      setRefreshKey((key) => key + 1)
      showToast(`${invoice.number} created as a draft`)
    } catch (error) {
      showToast('Could not create invoice')
      throw error
    }
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
            Financial Operations <span className="font-normal text-neutral-500">• Q4 FY24 Ledger</span>
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900">Invoices</h1>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-neutral-600">
            Issue, track and reconcile project milestone invoices, automated dunning routines, and escrow releases with audit-grade precision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:shrink-0">
          <button type="button" onClick={() => showToast('Invoice CSV export is not wired yet')} className="inline-flex items-center gap-2 rounded-lg border border-neutral-100 bg-white px-3.5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50">
            <Download size={15} className="text-neutral-500" /> Export CSV
          </button>
          <button type="button" onClick={() => showToast('Batch sync is not wired yet')} className="inline-flex items-center gap-2 rounded-lg border border-neutral-100 bg-white px-3.5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50">
            <MailCheck size={16} className="text-neutral-500" /> Batch Sync
          </button>
          <button type="button" onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700">
            <PlusCircle size={16} /> Create Invoice <kbd className="rounded bg-white/20 px-1 py-0.5 font-mono text-[10px] font-medium">N</kbd>
          </button>
        </div>
      </div>

      <InvoiceStatCards />

      <InvoiceWorkspace showToast={showToast} refreshKey={refreshKey} />
      <AddInvoiceModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} clients={clients} clientsError={clientsError} />
      <Toast message={toast} />
    </div>
  )
}
