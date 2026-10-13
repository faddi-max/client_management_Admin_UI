import { useState } from 'react'
import { FilePlus2 } from 'lucide-react'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { FilterSelect } from '@/components/data/DataToolbar'

const EMPTY = { clientId: '', project: '', amount: '', issueDate: '2024-10-31', dueDate: '2024-11-14', paymentTerms: 'Net 14' }

function Field({ label, error, children }) {
  return <div className="flex flex-col gap-1"><span className="text-sm font-medium text-neutral-700">{label}</span>{children}{error && <p className="text-xs text-red-500">{error}</p>}</div>
}

function validate(values) {
  const errors = {}
  if (!values.clientId) errors.clientId = 'Select a client organization'
  if (!values.project.trim()) errors.project = 'Milestone or project name is required'
  if (!(Number(values.amount) > 0)) errors.amount = 'Enter an amount greater than zero'
  if (!values.issueDate) errors.issueDate = 'Issue date is required'
  if (!values.dueDate) errors.dueDate = 'Due date is required'
  if (values.issueDate && values.dueDate && values.dueDate < values.issueDate) errors.dueDate = 'Due date must follow the issue date'
  return errors
}

export default function AddInvoiceModal({ open, onClose, onSubmit, clients = [], clientsError = false }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const setField = (key, value) => { setValues((current) => ({ ...current, [key]: value })); if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined })) }
  const close = () => { setValues(EMPTY); setErrors({}); onClose() }
  const submit = async (event) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    setSubmitting(true)
    try { await onSubmit(values); close() } catch {} finally { setSubmitting(false) }
  }
  const clientOptions = [{ value: '', label: clientsError ? 'Could not load clients' : 'Select client' }, ...clients]
  return <Modal open={open} onClose={close} size="lg" title={<span className="flex items-center gap-2"><FilePlus2 size={20} className="text-primary-600" />Create Invoice</span>} footer={<><Button type="button" variant="secondary" onClick={close}>Cancel</Button><Button type="submit" form="add-invoice-form" disabled={submitting}>{submitting ? 'Creating…' : 'Create Invoice'}</Button></>}>
    <form id="add-invoice-form" onSubmit={submit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Field label="Client Organization" error={errors.clientId}><FilterSelect ariaLabel="Client organization" value={values.clientId} onChange={(value) => setField('clientId', value)} options={clientOptions} /></Field><Field label="Payment Terms"><FilterSelect ariaLabel="Payment terms" value={values.paymentTerms} onChange={(value) => setField('paymentTerms', value)} options={[{ value: 'Net 7', label: 'Net 7' }, { value: 'Net 14', label: 'Net 14' }, { value: 'Net 30', label: 'Net 30' }, { value: 'Due on receipt', label: 'Due on receipt' }]} /></Field></div>
      <Input label="Milestone / Project" placeholder="e.g. Ledger Module & Security Audit" value={values.project} onChange={(event) => setField('project', event.target.value)} error={errors.project} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Input label="Amount ($)" type="number" min="0" inputMode="decimal" placeholder="9800" value={values.amount} onChange={(event) => setField('amount', event.target.value)} error={errors.amount} /><Input label="Issue Date" type="date" value={values.issueDate} onChange={(event) => setField('issueDate', event.target.value)} error={errors.issueDate} /><Input label="Due Date" type="date" value={values.dueDate} onChange={(event) => setField('dueDate', event.target.value)} error={errors.dueDate} /></div>
    </form>
  </Modal>
}
