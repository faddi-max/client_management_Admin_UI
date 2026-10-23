import { useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import Button from '@/components/common/Button'

/** Compact confirmation dialog (destructive by default). Same overlay language as Modal. */
export default function ConfirmDialog({
  open, onClose, onConfirm, title, children,
  confirmLabel = 'Delete', cancelLabel = 'Cancel', busy = false, icon: Icon = Trash2,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, busy, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={busy ? undefined : onClose} aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <Icon size={17} />
          </span>
          <h2 id="confirm-title" className="text-base font-semibold text-neutral-900">{title}</h2>
        </div>
        <p className="mt-3 text-sm leading-5 text-neutral-500">{children}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>{cancelLabel}</Button>
          <Button type="button" onClick={onConfirm} disabled={busy} className="!bg-red-600 hover:!bg-red-700">
            {busy ? 'Deleting…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}