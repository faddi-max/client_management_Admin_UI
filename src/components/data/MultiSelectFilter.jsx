import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import Checkbox from '@/components/common/Checkbox'
import { cn } from '@/utils'

/**
 * Multi-select filter pill: "Provider: Cloudflare, AWS". Same look as FilterSelect in DataToolbar.
 *
 * @param {string} label                      - prefix, e.g. "Provider"
 * @param {string} [allLabel]                 - shown when nothing is selected
 * @param {Array<{ value: string, label: string }>} options
 * @param {string[]} value                    - selected values ([] = no filter)
 * @param {(values: string[]) => void} onChange
 */
export default function MultiSelectFilter({ label, allLabel = 'All', options = [], value = [], onChange, className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = options.filter((o) => value.includes(o.value))
  const summary = selected.length ? selected.map((o) => o.label).join(', ') : allLabel
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        className="flex h-9 w-full items-center gap-1.5 rounded-lg bg-indigo-50 pl-3.5 pr-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
      >
        <span className="shrink-0 text-neutral-500">{label}:</span>
        <span className="min-w-0 max-w-[200px] truncate font-medium text-neutral-800">{summary}</span>
        <ChevronDown size={14} className={cn('ml-auto shrink-0 text-neutral-500 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="group"
          aria-label={label}
          className="absolute left-0 z-30 mt-1 w-56 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {options.map((o) => (
            <label key={o.value} className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
              <Checkbox checked={value.includes(o.value)} onChange={() => toggle(o.value)} aria-label={o.label} />
              {o.label}
            </label>
          ))}
          {value.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="w-full border-t border-neutral-100 px-3 py-2 text-left text-xs font-semibold text-primary-600 hover:bg-neutral-50"
            >
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  )
}