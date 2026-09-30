import { useEffect, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

const ENTER = { duration: 300, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' }
const EXIT = { duration: 200, easing: 'cubic-bezier(0.4, 0, 1, 1)' }

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Right-side sliding panel. Stays mounted while the exit animation plays, so the
 * parent should keep the drawer's content (e.g. the selected row) until it has closed.
 */
export default function Drawer({ open, onClose, header, headerActions, children, footer }) {
  // Mounted = open OR still animating out. Set during render (React's "derive state" pattern).
  const [mounted, setMounted] = useState(open)
  if (open && !mounted) setMounted(true)

  const panelRef = useRef(null)
  const backdropRef = useRef(null)

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

  // Slide + fade. Layout effect so the first frame never flashes the panel in its final position.
  useLayoutEffect(() => {
    const panel = panelRef.current
    const backdrop = backdropRef.current
    if (!mounted || !panel || !backdrop) return

    if (typeof panel.animate !== 'function') {
      // No Web Animations support (e.g. jsdom): just unmount on close
      if (!open) queueMicrotask(() => setMounted(false))
      return
    }

    const timing = { ...(open ? ENTER : EXIT), fill: 'forwards' }
    if (prefersReducedMotion()) timing.duration = 0

    const slide = open ? ['translateX(100%)', 'translateX(0)'] : ['translateX(0)', 'translateX(100%)']
    const fade = open ? [0, 1] : [1, 0]

    const panelAnim = panel.animate({ transform: slide }, timing)
    const backdropAnim = backdrop.animate({ opacity: fade }, timing)
    if (!open) panelAnim.onfinish = () => setMounted(false)

    return () => {
      panelAnim.cancel()
      backdropAnim.cancel()
    }
  }, [open, mounted])

  if (!mounted) return null

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-xl will-change-transform"
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