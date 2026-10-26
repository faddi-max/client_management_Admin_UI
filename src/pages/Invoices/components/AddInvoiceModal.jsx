import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import IconAction from '@/components/common/IconAction'
import { FilterSelect } from '@/components/data/DataToolbar'
import { COMPANY } from '@/constants/companyConfig'
import { calculateInvoiceTotals } from '@/utils/invoiceTotals'
import { formatCurrency } from '@/utils'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
]
const CURRENCY_OPTIONS = [{ value: 'USD', label: 'USD' }]
const METHOD_OPTIONS = ['Bank transfer', 'Wire transfer', 'ACH auto-debit'].map((v) => ({ value: v, label: v }))
const TERMS_OPTIONS = [
  { value: 'Due on receipt', label: 'Due on receipt' },
  { value: 'Net 7', label: 'Due within 7 days' },
  { value: 'Net 14', label: 'Due within 14 days' },
  { value: 'Net 30', label: 'Due within 30 days' },
]

// Dates are local 'YYYY-MM-DD' so the default never shifts a day
const pad = (n) => String(n).padStart(2, '0')
const inDays = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

let rowSeq = 0
const newItem = () => ({ id: ++rowSeq, description: '', quantity: '1', unitPrice: '' })

const makeEmpty = () => ({
  status: 'draft',
  currency: 'USD',
  issueDate: inDays(0),
  dueDate: inDays(14),
  clientName: '',
  company: '',
  email: '',
  address: '',
  items: [newItem()],
  discount: '0',
  tax: '0',
  paymentMethod: METHOD_OPTIONS[0].value,
  paymentTerms: 'Net 14',
  instructions: '',
  notes: '',
})

const inRange = (v) => v === '' || (Number(v) >= 0 && Number(v) <= 100)

function validate(v, total) {
  const errors = {}
  if (!v.clientName.trim()) errors.clientName = 'Client name is required'
  if (!v.email.trim()) errors.email = 'Client email is required'
  else if (!EMAIL_RE.test(v.email)) errors.email = 'Enter a valid email address'
  if (!v.issueDate) errors.issueDate = 'Issue date is required'
  if (!v.dueDate) errors.dueDate = 'Due date is required'
  else if (v.issueDate && v.dueDate < v.issueDate) errors.dueDate = 'Due date must follow the issue date'
  if (!inRange(v.discount)) errors.discount = 'Use 0–100'
  if (!inRange(v.tax)) errors.tax = 'Use 0–100'

  const badRow = v.items.some(
    (i) => !i.description.trim() || !(Number(i.quantity) > 0) || i.unitPrice === '' || Number(i.unitPrice) < 0
  )
  if (badRow) errors.items = 'Each line item needs a description, a quantity above 0 and a unit price.'
  else if (!(total > 0)) errors.items = 'Invoice total must be greater than zero.'
  return errors
}

function Section({ title, children }) {
  return (
    <section className="space-y-3 border-t border-neutral-100 pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-xs font-semibold text-neutral-900">{title}</h3>
      {children}
    </section>
  )
}

// Same label style as Input, for the select fields
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function SummaryRow({ label, strong = false, children }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className={strong ? 'font-semibold text-neutral-900' : 'text-neutral-500'}>{label}</span>
      {children}
    </div>
  )
}

const ITEM_GRID = 'grid grid-cols-[minmax(0,1fr)_72px_104px_32px] items-start gap-2'
const COL_LABEL = 'text-[10px] font-semibold uppercase tracking-wider text-neutral-500'

export default function AddInvoiceModal({ open, onClose, onSubmit }) {
  const [values, setValues] = useState(makeEmpty)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const clear = (key) => errors[key] && setErrors((p) => ({ ...p, [key]: undefined }))
  const setField = (key, value) => {
    setValues((p) => ({ ...p, [key]: value }))
    clear(key)
  }
  const set = (key) => (e) => setField(key, e.target.value)

  const setItem = (id, key, value) => {
    setValues((p) => ({ ...p, items: p.items.map((i) => (i.id === id ? { ...i, [key]: value } : i)) }))
    clear('items')
  }
  const addItem = () => setValues((p) => ({ ...p, items: [...p.items, newItem()] }))
  const removeItem = (id) => setValues((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }))

  const totals = calculateInvoiceTotals({
    lineItems: values.items,
    discountPercent: values.discount,
    taxPercent: values.tax,
  })

  const close = () => {
    setValues(makeEmpty())
    setErrors({})
    onClose()
  }

  const submit = async (status) => {
    const found = validate(values, totals.total)
    setErrors(found)
    if (Object.keys(found).length) return
    setSubmitting(true)
    try {
      await onSubmit({ ...values, status: status ?? values.status })
      close()
    } catch {
      // Parent shows the toast; keep the form open so nothing typed is lost
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submit()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      size="xl"
      title={
        <span className="block">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">New invoice</span>
          <span className="block text-base font-semibold text-neutral-900">Create invoice</span>
        </span>
      }
      footer={
        <>
          <Button type="button" variant="ghost" onClick={close}>Cancel</Button>
          <Button type="button" variant="secondary" disabled={submitting} onClick={() => submit('draft')}>
            Save as Draft
          </Button>
          <Button type="submit" form="add-invoice-form" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Invoice'}
          </Button>
        </>
      }
    >
      <form id="add-invoice-form" onSubmit={handleSubmit} noValidate className="space-y-5">
        <Section title="Invoice details">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Invoice number" value="Assigned on save" readOnly />
            <Input label="Issue date" type="date" value={values.issueDate} onChange={set('issueDate')} error={errors.issueDate} />
            <Input label="Due date" type="date" value={values.dueDate} onChange={set('dueDate')} error={errors.dueDate} />
            <Field label="Invoice status">
              <FilterSelect ariaLabel="Invoice status" value={values.status} onChange={(v) => setField('status', v)} options={STATUS_OPTIONS} />
            </Field>
            <Field label="Currency">
              <FilterSelect ariaLabel="Currency" value={values.currency} onChange={(v) => setField('currency', v)} options={CURRENCY_OPTIONS} />
            </Field>
          </div>
        </Section>

        <Section title="Company information">
          <div className="rounded-lg bg-indigo-50/60 px-3.5 py-3 text-xs text-neutral-600">
            <p className="text-sm font-semibold text-neutral-900">{COMPANY.name}</p>
            <p className="mt-0.5">{COMPANY.address} · {COMPANY.email}</p>
          </div>
        </Section>

        <Section title="Client information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Client name" placeholder="e.g. Hasan Mirza" value={values.clientName} onChange={set('clientName')} error={errors.clientName} />
            <Input label="Company name" placeholder="e.g. HyperScale AI" value={values.company} onChange={set('company')} />
            <Input label="Client email" type="email" placeholder="client@company.com" value={values.email} onChange={set('email')} error={errors.email} />
            <Input label="Client address" placeholder="Optional billing address" value={values.address} onChange={set('address')} />
          </div>
        </Section>

        <Section title="Invoice line items">
          <div className="space-y-2">
            <div className={ITEM_GRID}>
              <span className={COL_LABEL}>Service description</span>
              <span className={COL_LABEL}>Quantity</span>
              <span className={COL_LABEL}>Unit price</span>
              <span />
            </div>
            {values.items.map((item) => (
              <div key={item.id} className={ITEM_GRID}>
                <Input id={`item-${item.id}-description`} aria-label="Service description" placeholder="e.g. Website Development" value={item.description} onChange={(e) => setItem(item.id, 'description', e.target.value)} />
                <Input id={`item-${item.id}-quantity`} aria-label="Quantity" type="number" min="0" step="any" inputMode="decimal" value={item.quantity} onChange={(e) => setItem(item.id, 'quantity', e.target.value)} />
                <Input id={`item-${item.id}-price`} aria-label="Unit price" type="number" min="0" step="0.01" inputMode="decimal" placeholder="0.00" value={item.unitPrice} onChange={(e) => setItem(item.id, 'unitPrice', e.target.value)} />
                <IconAction
                  icon={Trash2}
                  label="Remove line item"
                  disabled={values.items.length === 1}
                  onClick={() => removeItem(item.id)}
                  className="mt-1 text-neutral-400 hover:bg-neutral-100 hover:text-red-600"
                />
              </div>
            ))}
          </div>
          {errors.items && <p className="text-xs text-red-500">{errors.items}</p>}
          <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:underline">
            <Plus size={14} /> Add item
          </button>
        </Section>

        <Section title="Payment summary">
          <div className="space-y-3">
            <SummaryRow label="Subtotal">
              <span className="font-semibold text-neutral-900">{formatCurrency(totals.subtotal)}</span>
            </SummaryRow>
            <SummaryRow label="Discount (%)">
              <div className="w-32">
                <Input id="invoice-discount" aria-label="Discount percent" type="number" min="0" max="100" step="any" inputMode="decimal" value={values.discount} onChange={set('discount')} error={errors.discount} />
              </div>
            </SummaryRow>
            <SummaryRow label="Tax (%)">
              <div className="w-32">
                <Input id="invoice-tax" aria-label="Tax percent" type="number" min="0" max="100" step="any" inputMode="decimal" value={values.tax} onChange={set('tax')} error={errors.tax} />
              </div>
            </SummaryRow>
            <div className="border-t border-neutral-100 pt-3">
              <SummaryRow label="Final total" strong>
                <span className="text-base font-bold text-neutral-900">{formatCurrency(totals.total)}</span>
              </SummaryRow>
            </div>
          </div>
        </Section>

        <Section title="Payment information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Payment method">
              <FilterSelect ariaLabel="Payment method" value={values.paymentMethod} onChange={(v) => setField('paymentMethod', v)} options={METHOD_OPTIONS} />
            </Field>
            <Field label="Payment terms">
              <FilterSelect ariaLabel="Payment terms" value={values.paymentTerms} onChange={(v) => setField('paymentTerms', v)} options={TERMS_OPTIONS} />
            </Field>
            <Input label="Payment instructions" placeholder="Optional instructions" value={values.instructions} onChange={set('instructions')} />
            <Input label="Notes" placeholder="Additional notes" value={values.notes} onChange={set('notes')} />
          </div>
        </Section>
      </form>
    </Modal>
  )
}