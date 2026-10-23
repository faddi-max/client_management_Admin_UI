import { ClipboardList, FileText } from 'lucide-react'
import Drawer from '@/components/common/Drawer'
import Button from '@/components/common/Button'
import Avatar from '@/components/common/Avatar'
import { REQUIREMENT_SECTIONS } from '@/constants/requirementConfig'
import { formatDate } from '@/utils'

const LABEL = 'text-[10px] font-semibold uppercase tracking-wider text-neutral-500'

export default function RequirementDrawer({ requirement: r, open, onClose, onEdit, canManage = true }) {
  if (!r) return null

  return (
    <Drawer
      open={open}
      onClose={onClose}
      header={
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <ClipboardList size={20} className="text-primary-600" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-neutral-900">{r.documentName}</h2>
            <p className="mt-0.5 truncate font-mono text-xs text-neutral-500">{r.code}</p>
          </div>
        </div>
      }
      footer={
        <>
          <span />
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="lg" onClick={onClose}>Close</Button>
            {canManage && <Button size="lg" onClick={() => onEdit(r)}>Edit</Button>}
          </div>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-4 rounded-xl bg-indigo-50 p-4">
        <div className="min-w-0">
          <p className={LABEL}>Client</p>
          <p className="mt-1.5 flex items-center gap-2 text-sm font-bold text-neutral-900">
            <Avatar name={r.client.name} size={22} /> <span className="truncate">{r.client.name}</span>
          </p>
        </div>
        <div className="min-w-0">
          <p className={LABEL}>Last Updated By</p>
          <p className="mt-1.5 truncate text-sm font-bold text-neutral-900">{r.updatedBy}</p>
        </div>
        <div className="min-w-0">
          <p className={LABEL}>Updated</p>
          <p className="mt-1.5 truncate text-sm font-bold text-neutral-900">{formatDate(r.updatedAt)}</p>
        </div>
      </div>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
          <FileText size={14} className="text-primary-600" /> Questionnaire
        </h3>
        <ul className="space-y-2">
          {REQUIREMENT_SECTIONS.map((s) => (
            <li key={s.key} className="rounded-lg bg-indigo-50/60 px-3 py-2.5">
              <p className={LABEL}>{s.label}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-800">
                {r.answers?.[s.key] || <span className="text-neutral-400">Not provided</span>}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </Drawer>
  )
}