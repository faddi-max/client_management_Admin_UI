import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import Button from '@/components/common/Button'
import Toast from '@/components/common/Toast'
import useToast from '@/hooks/useToast'
import useInvoiceStats from '@/hooks/useInvoiceStats'
import { createInvoice } from '@/services/api/invoicesService'
import InvoiceStatCards from './components/InvoiceStatCards'
import InvoiceWorkspace from './components/InvoiceWorkspace'
import AddInvoiceModal from './components/AddInvoiceModal'

export default function Invoices() {
  const { toast, showToast } = useToast()
  const [createOpen, setCreateOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const { stats, loading, error, refetch } = useInvoiceStats(refreshKey)

  const handleCreate = async (values) => {
    try {
      const invoice = await createInvoice(values)
      setRefreshKey((key) => key + 1) // refreshes the list and the stat cards
      showToast(`${invoice.number} created as a ${invoice.status === 'draft' ? 'draft' : 'new invoice'}`)
    } catch (error) {
      showToast('Could not create invoice')
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <FileText size={22} className="mt-1.5 shrink-0 text-primary-600" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-neutral-900">Invoices</h1>
            <p className="mt-1 text-sm text-neutral-500">Create, manage, and share professional client invoices.</p>
          </div>
        </div>
        <Button size="lg" icon={Plus} className="shrink-0" onClick={() => setCreateOpen(true)}>
          Create Invoice
        </Button>
      </div>

      <InvoiceStatCards stats={stats} loading={loading} error={error} onRetry={refetch} />

      <InvoiceWorkspace showToast={showToast} refreshKey={refreshKey} />
      <AddInvoiceModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} />
      <Toast message={toast} />
    </div>
  )
}