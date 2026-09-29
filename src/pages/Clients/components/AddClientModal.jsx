import { useState } from 'react'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

const EMPTY = { company: '', contactName: '', email: '', phone: '', industry: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(v) {
  const errors = {}
  if (!v.company.trim()) errors.company = 'Company name is required'
  if (!v.contactName.trim()) errors.contactName = 'Contact name is required'
  if (!v.email.trim()) errors.email = 'Email is required'
  else if (!EMAIL_RE.test(v.email)) errors.email = 'Enter a valid email address'
  return errors
}

export default function AddClientModal({ open, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => {
    setValues((p) => ({ ...p, [key]: e.target.value }))
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const close = () => {
    setValues(EMPTY)
    setErrors({})
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    onSubmit({ ...values })
    close()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add Client"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={close}>Cancel</Button>
          <Button type="submit" form="add-client-form">Add Client</Button>
        </>
      }
    >
      <form id="add-client-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input label="Company Name" value={values.company} onChange={set('company')} error={errors.company} />
        <Input label="Contact Name" value={values.contactName} onChange={set('contactName')} error={errors.contactName} />
        <Input label="Email" type="email" value={values.email} onChange={set('email')} error={errors.email} />
        <Input label="Phone" type="tel" value={values.phone} onChange={set('phone')} />
        <Input label="Industry" value={values.industry} onChange={set('industry')} />
      </form>
    </Modal>
  )
}