import { Eye, Pencil, Trash2 } from 'lucide-react'
import { cn, getInitials } from '@/utils'

const HEAD = 'bg-white' // header cells are lighter than the lavender data rows in the design

function TextAction({ icon: Icon, label, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium transition-colors',
        className ?? 'text-neutral-600 hover:bg-neutral-100'
      )}
    >
      <Icon size={13} /> {label}
    </button>
  )
}

/**
 * @param {{ onView, onEdit, onDelete, canManage? }} opts - handlers receive the row.
 *   canManage hides Edit / Delete (PRD: Viewer is read-only). TODO(auth): wire to real permissions.
 */
export function getRequirementColumns({ onView, onEdit, onDelete, canManage = true }) {
  return [
    {
      key: 'code',
      header: 'ID',
      headerClassName: HEAD,
      render: (r) => <span className="text-xs font-bold text-neutral-900">{r.code}</span>,
    },
    {
      key: 'company',
      header: 'Company Name',
      headerClassName: HEAD,
      render: (r) => <span className="text-sm text-neutral-600">{r.companyName}</span>,
    },
    {
      key: 'client',
      header: 'Client Name',
      headerClassName: HEAD,
      render: (r) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-600 text-[9px] font-bold text-white">
            {getInitials(r.clientName)}
          </span>
          <span className="text-sm text-neutral-800">{r.clientName}</span>
        </div>
      ),
    },
    {
      key: 'salesperson',
      header: 'Salesperson',
      headerClassName: HEAD,
      render: (r) => <span className="text-sm text-neutral-600">{r.salesperson}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'pr-5',
      headerClassName: `${HEAD} pr-5`,
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <TextAction icon={Eye} label="Show" onClick={() => onView(r)} />
          {canManage && (
            <TextAction icon={Pencil} label="Edit" onClick={() => onEdit(r)} className="text-primary-600 hover:bg-indigo-50" />
          )}
          {canManage && (
            <TextAction icon={Trash2} label="Delete" onClick={() => onDelete(r)} className="text-red-600 hover:bg-red-50" />
          )}
        </div>
      ),
    },
  ]
}