import { useState } from 'react'
import { UploadCloud, X, Paperclip } from 'lucide-react'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { cn } from '@/utils'
import {
  MAX_ATTACHMENTS, MAX_ATTACHMENT_MB, ATTACHMENT_ACCEPT, ATTACHMENT_PATTERN,
} from '@/constants/requirementConfig'

const initialValues = (r) => ({
  title: r?.title ?? '',
  description: r?.description ?? '',
  clientName: r?.clientName ?? '',
  companyName: r?.companyName ?? '',
  projectName: r?.projectName ?? '',
  salesperson: r?.salesperson ?? '',
  attachments: r?.attachments ?? [],
})

const REQUIRED = {
  title: 'Requirement title is required',
  clientName: 'Client name is required',
  companyName: 'Company name is required',
  projectName: 'Project name is required',
  salesperson: 'Salesperson name is required',
}

function validate(v) {
  const errors = {}
  Object.entries(REQUIRED).forEach(([key, msg]) => { if (!v[key].trim()) errors[key] = msg })
  return errors
}

const formatSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

const label = (text) => (
  <>
    {text} <span className="text-[10px] font-normal text-neutral-400">Required</span>
  </>
)

export default function RequirementFormModal({ requirement = null, onClose, onSubmit }) {
  const isEdit = Boolean(requirement)
  const [values, setValues] = useState(() => initialValues(requirement))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const setField = (key, value) => {
    setValues((p) => ({ ...p, [key]: value }))
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }))
  }
  const set = (key) => (e) => setField(key, e.target.value)

  const addFiles = (fileList) => {
    const next = [...values.attachments]
    let problem
    for (const file of Array.from(fileList)) {
      const id = `${file.name}-${file.size}-${file.lastModified}`
      if (next.some((a) => a.id === id)) continue
      if (!ATTACHMENT_PATTERN.test(file.name)) { problem = `${file.name}: only PNG, JPG or PDF files are allowed`; continue }
      if (file.size > MAX_ATTACHMENT_MB * 1048576) { problem = `${file.name} is larger than ${MAX_ATTACHMENT_MB}MB`; continue }
      if (next.length >= MAX_ATTACHMENTS) { problem = `You can attach up to ${MAX_ATTACHMENTS} files`; break }
      next.push({ id, name: file.name, size: file.size, type: file.type, file })
    }
    setValues((p) => ({ ...p, attachments: next }))
    setErrors((p) => ({ ...p, attachments: problem }))
  }

  const removeFile = (id) => {
    setValues((p) => ({ ...p, attachments: p.attachments.filter((a) => a.id !== id) }))
    setErrors((p) => ({ ...p, attachments: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    setSubmitting(true)
    try {
      await onSubmit({ ...values })
      onClose()
    } catch {
      // Parent shows the toast; keep the form open so nothing typed is lost
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={
        <span className="block">
          <span className="block">{isEdit ? 'Edit Requirements' : 'Create Requirements'}</span>
          <span className="mt-0.5 block text-xs font-normal text-neutral-500">Expand the details shared by your client.</span>
        </span>
      }
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="requirement-form" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Requirement'}
          </Button>
        </>
      }
    >
      <form id="requirement-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input id="req-title" label={label('Requirement Title')} value={values.title} onChange={set('title')} error={errors.title} />

        <div className="flex flex-col gap-1">
          <label htmlFor="req-description" className="text-sm font-medium text-neutral-700">Description</label>
          <textarea
            id="req-description"
            rows={3}
            value={values.description}
            onChange={set('description')}
            className={cn(
              'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800',
              'placeholder:text-neutral-400 hover:border-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent'
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id="req-client" label={label('Client Name')} value={values.clientName} onChange={set('clientName')} error={errors.clientName} />
          <Input id="req-company" label={label('Company Name')} value={values.companyName} onChange={set('companyName')} error={errors.companyName} />
          <Input id="req-project" label={label('Project Name')} value={values.projectName} onChange={set('projectName')} error={errors.projectName} />
          <Input id="req-sales" label={label('Salesperson Name')} value={values.salesperson} onChange={set('salesperson')} error={errors.salesperson} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-neutral-700">
            Images <span className="text-[10px] font-normal text-neutral-400">Optional</span>
          </span>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
            className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-primary-200 bg-indigo-50/60 px-4 py-5 text-center transition-colors hover:bg-indigo-50 focus-within:ring-2 focus-within:ring-primary-400"
          >
            <UploadCloud size={20} className="text-primary-600" />
            <span className="text-sm font-semibold text-primary-600">Upload reference images</span>
            <span className="text-xs text-neutral-500">PNG, JPG, PDF up to {MAX_ATTACHMENT_MB}MB</span>
            <input
              type="file"
              multiple
              accept={ATTACHMENT_ACCEPT}
              className="sr-only"
              onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
            />
          </label>
          {errors.attachments ? (
            <p className="text-xs text-red-500">{errors.attachments}</p>
          ) : (
            <p className="text-xs text-neutral-400">Max {MAX_ATTACHMENTS} files</p>
          )}
          {values.attachments.length > 0 && (
            <ul className="mt-1 space-y-1.5">
              {values.attachments.map((a) => (
                <li key={a.id} className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs text-neutral-700">
                  <Paperclip size={13} className="shrink-0 text-primary-600" />
                  <span className="min-w-0 flex-1 truncate">{a.name}</span>
                  <span className="shrink-0 text-neutral-400">{formatSize(a.size)}</span>
                  <button type="button" onClick={() => removeFile(a.id)} aria-label={`Remove ${a.name}`} className="rounded p-0.5 text-neutral-500 hover:bg-white">
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </Modal>
  )
}