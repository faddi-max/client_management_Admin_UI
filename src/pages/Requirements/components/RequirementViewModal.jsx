import { Image as ImageIcon, FileText } from 'lucide-react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'

const LABEL = 'text-[10px] font-semibold uppercase tracking-wider text-neutral-400'

function Field({ label, children }) {
  return (
    <div className="min-w-0">
      <p className={LABEL}>{label}</p>
      <p className="mt-1 break-words text-sm text-neutral-900">{children}</p>
    </div>
  )
}

// "Image (1 file)" when every attachment is an image, otherwise "File (n files)"
function attachmentLabel(list) {
  const kind = list.every((a) => a.type?.startsWith('image/')) ? 'Image' : 'File'
  return { kind, text: `${kind} (${list.length} file${list.length === 1 ? '' : 's'})` }
}

export default function RequirementViewModal({ requirement: r, onClose }) {
  const attachments = r?.attachments ?? []
  const chip = attachments.length ? attachmentLabel(attachments) : null
  const ChipIcon = chip?.kind === 'Image' ? ImageIcon : FileText

  return (
    <Modal
      open={Boolean(r)}
      onClose={onClose}
      size="md"
      title={
        <span className="block">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Requirement Details</span>
          <span className="mt-0.5 block">{r?.title}</span>
        </span>
      }
      footer={<Button type="button" onClick={onClose}>Close</Button>}
    >
      {r && (
        <div className="space-y-4">
          <Field label="Description">{r.description || <span className="text-neutral-400">No description</span>}</Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Client Name">{r.clientName}</Field>
            <Field label="Company Name">{r.companyName}</Field>
            <Field label="Project Name">{r.projectName}</Field>
            <Field label="Salesperson">{r.salesperson}</Field>
          </div>
          <div>
            <p className={LABEL}>Attachments</p>
            {chip ? (
              <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-primary-700">
                <ChipIcon size={12} /> {chip.text}
              </span>
            ) : (
              <p className="mt-1 text-sm text-neutral-400">None</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}