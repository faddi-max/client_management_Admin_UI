import { BookText, MailPlus, RotateCcw } from 'lucide-react'
import { formatCurrency } from '@/utils'

export const money = (n) => formatCurrency(n).replace(/\.00$/, '')

export const STATUS_META = {
  active_retainer: { label: 'Active Retainer', variant: 'success' },
  past_due: { label: 'Past Due Alert', variant: 'dangerSoft' },
  on_hold: { label: 'On Hold', variant: 'warningSoft' },
  prospect: { label: 'Prospect', variant: 'primary' },
}

/** Sub-line under the MRR figure. Order = priority. */
export function billingNote(b) {
  if (b.overdue > 0) return { text: `${money(b.overdue)} Overdue`, tone: 'font-bold text-red-600' }
  if (b.pending > 0) return { text: `${money(b.pending)} pending`, tone: 'text-orange-500' }
  if (b.standby) return { text: 'Standby mode', tone: 'text-neutral-500' }
  if (b.autoDebit) return { text: 'Auto-debit OK', tone: 'text-green-600' }
  return { text: 'All settled', tone: 'text-green-600' }
}

/** The contextual 2nd action icon in the Actions column. */
export function quickActionFor(client) {
  if (client.status === 'past_due') return { type: 'remind', label: 'Send payment reminder', icon: MailPlus, tone: 'text-orange-500 hover:bg-orange-50' }
  if (client.status === 'on_hold') return { type: 'reactivate', label: 'Reactivate client', icon: RotateCcw, tone: 'text-neutral-500 hover:bg-neutral-100' }
  return { type: 'ledger', label: 'Open ledger', icon: BookText, tone: 'text-neutral-500 hover:bg-neutral-100' }
}