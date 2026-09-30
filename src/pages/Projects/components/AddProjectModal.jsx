import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { FilterSelect } from '@/components/data/DataToolbar'

const makeEmpty = (leads) => ({
  name: '',
  clientId: '',
  leadId: leads[0]?.value ?? '',
  budget: '',
  handoverDate: '',
  milestones: '',
})

function validate(v) {
  const errors = {}
  if (!v.name.trim()) errors.name = 'Project name is required'
  if (!v.clientId) errors.clientId = 'Select a client organization'
  if (v.budget !== '' && !(Number(v.budget) > 0)) errors.budget = 'Enter a valid amount'
  return errors
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

export default function AddProjectModal({ open, onClose, onSubmit, clients = [], clientsError = false, leads = [] }) {
  const [values, setValues] = useState(() => makeEmpty(leads))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const setField = (key, value) => {
    setValues((p) => ({ ...p, [key]: value }))
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }))
  }
  const set = (key) => (e) => setField(key, e.target.value)

  const close = () => {
    setValues(makeEmpty(leads))
    setErrors({})
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    setSubmitting(true)
    try {
      await onSubmit({ ...values })
      close()
    } catch {
      // Parent shows the toast; keep the form open so nothing typed is lost
    } finally {
      setSubmitting(false)
    }
  }

  const clientOptions = [{ value: '', label: clientsError ? 'Could not load clients' : 'Select client' }, ...clients]

  return (
    <Modal
      open={open}
      onClose={close}
      size="lg"
      title={
        <span className="flex items-center gap-2">
          <PlusCircle size={20} className="text-primary-600" />
          Initialize New Project Track
        </span>
      }
      footer={
        <>
          <Button type="button" variant="secondary" onClick={close}>Cancel</Button>
          <Button type="submit" form="add-project-form" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Track'}
          </Button>
        </>
      }
    >
      <form id="add-project-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Project Name"
          placeholder="e.g. Real-Time Telemetry Stream"
          value={values.name}
          onChange={set('name')}
          error={errors.name}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Client Organization" error={errors.clientId}>
            <FilterSelect
              ariaLabel="Client organization"
              value={values.clientId}
              onChange={(v) => setField('clientId', v)}
              options={clientOptions}
            />
          </Field>
          <Field label="Delivery Lead">
            <FilterSelect
              ariaLabel="Delivery lead"
              value={values.leadId}
              onChange={(v) => setField('leadId', v)}
              options={leads}
            />
          </Field>
          <Input
            label="Total Budget ($)"
            type="number"
            min="0"
            inputMode="decimal"
            placeholder="75000"
            value={values.budget}
            onChange={set('budget')}
            error={errors.budget}
          />
          <Input
            label="Target Handover Date"
            type="date"
            value={values.handoverDate}
            onChange={set('handoverDate')}
          />
        </div>

        <Input
          label="Initial Milestones (comma separated)"
          placeholder="Scope Blueprint, Sprint 1 Alpha, QA Certification, Final Signoff"
          value={values.milestones}
          onChange={set('milestones')}
        />
      </form>
    </Modal>
  )
}