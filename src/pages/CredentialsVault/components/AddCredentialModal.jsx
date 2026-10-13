import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { FilterSelect } from '@/components/data/DataToolbar'
import { CREDENTIAL_CATEGORIES, CREDENTIAL_ENVIRONMENTS } from '@/constants/credentialConfig'

const EMPTY = {
  name: '', clientId: '', category: CREDENTIAL_CATEGORIES[0].value,
  environment: CREDENTIAL_ENVIRONMENTS[0].value, identifier: '', secret: '',
}

function validate(v) {
  const errors = {}
  if (!v.name.trim()) errors.name = 'Service name is required'
  if (!v.clientId) errors.clientId = 'Select a client organization'
  if (!v.secret) errors.secret = 'Secret value is required'
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

export default function AddCredentialModal({ open, onClose, onSubmit, clients = [], clientsError = false }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const setField = (key, value) => {
    setValues((p) => ({ ...p, [key]: value }))
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }))
  }
  const set = (key) => (e) => setField(key, e.target.value)

  // Always wipes the secret from component state
  const close = () => {
    setValues(EMPTY)
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
          <KeyRound size={20} className="text-primary-600" />
          Store New Credential
        </span>
      }
      footer={
        <>
          <Button type="button" variant="secondary" onClick={close}>Cancel</Button>
          <Button type="submit" form="add-credential-form" disabled={submitting}>
            {submitting ? 'Encrypting…' : 'Save to Vault'}
          </Button>
        </>
      }
    >
      <form id="add-credential-form" onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-4">
        <Input
          label="Service / Asset Name"
          placeholder="e.g. AWS Production NYC-01"
          value={values.name}
          onChange={set('name')}
          error={errors.name}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Client Organization" error={errors.clientId}>
            <FilterSelect ariaLabel="Client organization" value={values.clientId} onChange={(v) => setField('clientId', v)} options={clientOptions} />
          </Field>
          <Field label="Category">
            <FilterSelect ariaLabel="Category" value={values.category} onChange={(v) => setField('category', v)} options={CREDENTIAL_CATEGORIES} />
          </Field>
          <Field label="Environment">
            <FilterSelect ariaLabel="Environment" value={values.environment} onChange={(v) => setField('environment', v)} options={CREDENTIAL_ENVIRONMENTS} />
          </Field>
          <Input
            label="Identifier (non-secret)"
            placeholder="e.g. App ID: 2984102"
            value={values.identifier}
            onChange={set('identifier')}
            autoComplete="off"
            hint="Shown in the list. Never paste the secret here."
          />
        </div>

        <Input
          label="Secret Payload"
          type="password"
          autoComplete="new-password"
          value={values.secret}
          onChange={set('secret')}
          error={errors.secret}
          hint="Encrypted before storage. Shown again only through an audited reveal."
        />
      </form>
    </Modal>
  )
}