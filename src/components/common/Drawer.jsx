import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

export default function Drawer({ open, onClose, header, headerActions, children, footer }) {
  const onKey = useCallback((e) => { if (e.key === 'Escape') onClose() }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onKey])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="true"
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4">
          <div className="min-w-0 flex-1">{header}</div>
          <div className="flex shrink-0 items-center gap-1">
            {headerActions}
            <button onClick={onClose} aria-label="Close panel" className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex items-center justify-between gap-2 border-t border-neutral-100 px-5 py-4">{footer}</div>}
      </aside>
    </div>
  )
}