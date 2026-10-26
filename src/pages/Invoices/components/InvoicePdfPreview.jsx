import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Download, X } from 'lucide-react'
import Badge from '@/components/common/Badge'
import Button from '@/components/common/Button'
import useInvoiceDetail from '@/hooks/useInvoiceDetail'
import { COMPANY } from '@/constants/companyConfig'
import { formatCurrency } from '@/utils'
import { STATUS, PILL } from './invoicesUi'

// Print only the sheet: hide the app root and the dark chrome around it.
const PRINT_CSS = `
@media print {
  #root { display: none !important; }
  .invoice-pdf-overlay { position: static !important; background: #fff !important; overflow: visible !important; padding: 0 !important; }
  .invoice-pdf-chrome { display: none !important; }
  .invoice-pdf-sheet { box-shadow: none !important; max-width: none !important; border-radius: 0 !important; }
  .invoice-pdf-sheet * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}`

const LABEL = 'text-[10px] font-semibold uppercase tracking-wider text-neutral-400'

function TotalRow({ label, value, strong = false }) {
  return (
    <div className={`flex justify-between gap-8 ${strong ? 'border-t border-neutral-200 pt-2 text-sm font-bold text-neutral-900' : 'text-neutral-600'}`}>
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  )
}

/**
 * invoice = list row (shown immediately). Line items, totals, address and notes come from
 * fetchInvoiceDetail. autoPrint opens the print dialog once the detail has loaded.
 */
export default function InvoicePdfPreview({ invoice, open, onClose, autoPrint = false }) {
  const { detail, loading, error } = useInvoiceDetail(open && invoice ? invoice.id : null)
  const printed = useRef(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) { printed.current = false; return }
    if (!autoPrint || !detail || printed.current) return
    printed.current = true
    const t = setTimeout(() => window.print(), 150)
    return () => clearTimeout(t)
  }, [open, autoPrint, detail])

  if (!open || !invoice) return null

  const status = STATUS[invoice.status] ?? STATUS.draft
  const terms = [detail?.paymentMethod, detail?.paymentTerms].filter(Boolean).join(' · ')

  return createPortal(
    <div className="invoice-pdf-overlay fixed inset-0 z-50 overflow-y-auto bg-neutral-900/95 p-4 sm:p-8">
      <style>{PRINT_CSS}</style>
      <div className="mx-auto w-full max-w-[640px]">
        <div className="invoice-pdf-chrome mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-300">View PDF</h2>
          <button type="button" onClick={onClose} aria-label="Close preview" className="rounded-md p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <article role="dialog" aria-modal="true" aria-label={`Invoice ${invoice.number}`} className="invoice-pdf-sheet rounded-lg bg-white p-6 shadow-xl sm:p-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-600">Kinetic Ops</p>
              <h3 className="mt-1 text-lg font-bold text-neutral-900">{invoice.number}</h3>
              <p className="mt-0.5 text-[11px] text-neutral-500">{COMPANY.name} · {COMPANY.email}</p>
              <p className="text-[11px] text-neutral-500">{COMPANY.address}</p>
            </div>
          </header>

          <div className="mt-6 grid grid-cols-2 gap-6 border-t border-neutral-100 pt-5">
            <div>
              <p className={LABEL}>Invoice to</p>
              <p className="mt-1.5 text-sm font-semibold text-neutral-900">{invoice.client.contact}</p>
              <p className="text-xs text-neutral-600">{invoice.client.name}</p>
              <p className="text-xs text-neutral-500">{invoice.client.email}</p>
              {detail?.address && <p className="text-xs text-neutral-500">{detail.address}</p>}
            </div>
            <div className="text-right">
              <p className={LABEL}>Invoice details</p>
              <dl className="mt-1.5 space-y-0.5 text-xs text-neutral-600">
                <div className="flex justify-end gap-2"><dt>Issue date:</dt><dd className="font-medium text-neutral-900">{invoice.issueDate}</dd></div>
                <div className="flex justify-end gap-2"><dt>Due date:</dt><dd className="font-medium text-neutral-900">{invoice.dueDate}</dd></div>
              </dl>
              <Badge variant={status.variant} className={`${PILL} mt-2`}>{status.label}</Badge>
            </div>
          </div>

          <table className="mt-6 w-full text-xs">
            <thead>
              <tr className="border-y border-neutral-100 text-left text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                <th className="py-2 pr-2">Description</th>
                <th className="w-10 py-2 text-right">Qty</th>
                <th className="w-24 py-2 text-right">Unit price</th>
                <th className="w-24 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="4" className="py-6 text-center text-neutral-400">Loading line items…</td></tr>}
              {error && <tr><td colSpan="4" className="py-6 text-center text-red-500">Could not load invoice details.</td></tr>}
              {detail?.lineItems.map((item, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="py-2.5 pr-2 text-neutral-800">{item.description}</td>
                  <td className="py-2.5 text-right text-neutral-600">{item.quantity}</td>
                  <td className="py-2.5 text-right font-mono text-neutral-600">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-2.5 text-right font-mono text-neutral-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {detail && (
            <div className="mt-4 ml-auto w-56 space-y-1.5 text-xs">
              <TotalRow label="Subtotal" value={formatCurrency(detail.totals.subtotal)} />
              <TotalRow label="Discount" value={formatCurrency(detail.totals.discount)} />
              <TotalRow label="Tax" value={formatCurrency(detail.totals.tax)} />
              <TotalRow label="Total" value={formatCurrency(detail.totals.total)} strong />
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-neutral-100 pt-5 text-xs">
            <div>
              <p className="font-semibold text-neutral-900">Payment information</p>
              <p className="mt-1 text-neutral-500">{terms || '—'}</p>
              {detail?.instructions && <p className="mt-0.5 text-neutral-500">{detail.instructions}</p>}
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Notes</p>
              <p className="mt-1 text-neutral-500">{detail?.notes || 'Thank you for your business.'}</p>
            </div>
          </div>

          <div className="invoice-pdf-chrome mt-6 flex justify-end">
            <Button size="sm" icon={Download} disabled={!detail} onClick={() => window.print()}>Download PDF</Button>
          </div>
        </article>
      </div>
    </div>,
    document.body
  )
}