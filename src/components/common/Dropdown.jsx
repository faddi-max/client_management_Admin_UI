import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils'

/**
 * Dropdown — a basic select/menu trigger with a floating list.
 *
 * @param {string}             label     — button label
 * @param {Array<{ label, value, onClick? }>} items — menu items
 * @param {'left'|'right'}     align     — dropdown alignment
 */
export default function Dropdown({ label, items = [], align = 'left', className }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className={cn('relative inline-block', className)} ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
          'border border-neutral-200 bg-white hover:bg-neutral-50',
          'text-neutral-700 transition-colors'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          size={14}
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={cn(
            'absolute mt-1 w-44 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-30',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, idx) => (
            <li key={item.value ?? idx}>
              <button
                onClick={() => { item.onClick?.(); setOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                role="option"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
