import { cn } from '@/utils'

/**
 * Small icon-only button used in table rows / cards.
 * Hoisted from the identical local copies in clientColumns, ClientCard and projectColumns
 * (their comment says "hoist once a third page needs it"). Those files are untouched for now.
 */
export default function IconAction({ icon: Icon, label, className, onClick, disabled = false }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-md p-1.5 transition-colors disabled:pointer-events-none disabled:opacity-50',
        className ?? 'text-neutral-500 hover:bg-neutral-100'
      )}
    >
      <Icon size={16} />
    </button>
  )
}