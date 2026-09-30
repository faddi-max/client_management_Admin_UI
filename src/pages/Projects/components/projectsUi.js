import { Cpu, ShieldCheck, RefreshCcw, ShoppingCart, Code, Globe, Briefcase } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { STATUSES } from '@/constants/projectConfig'

// Presentation rules for projects. The API sends facts; everything shown
// (percentages, "IN 4 DAYS", tones, "Paid in Full") is derived here, once.
// Same role as clientsUi.js in the Clients page.

// NOTE: third copy of this helper (clientsUi, ProjectStatCards, here) → candidate for utils.
export const money = (n) => formatCurrency(n).replace(/\.00$/, '')
const compactMoney = (n) => (n >= 1000 ? `$${Math.round(n / 1000)}k` : money(n))

// ── Status ───────────────────────────────────────────────────────
const STATUS_VISUAL = {
  in_progress:   { variant: 'success',     iconWrap: 'bg-indigo-50', iconTone: 'text-primary-600' },
  client_review: { variant: 'warningSoft', iconWrap: 'bg-orange-50', iconTone: 'text-orange-500' },
  blocked:       { variant: 'warning',     iconWrap: 'bg-red-50',    iconTone: 'text-red-500' },
  completed:     { variant: 'neutral',     iconWrap: 'bg-green-50',  iconTone: 'text-green-600' },
}

// Labels come from the shared vocabulary, visuals from above.
export const STATUS_META = Object.fromEntries(
  STATUSES.map((s) => [s.value, { label: s.label, ...STATUS_VISUAL[s.value] }])
)

// ── Icons ────────────────────────────────────────────────────────
const PROJECT_ICONS = { cpu: Cpu, shield: ShieldCheck, sync: RefreshCcw, cart: ShoppingCart, code: Code, globe: Globe }
export const projectIcon = (key) => PROJECT_ICONS[key] ?? Briefcase

// ── Dates (deadline is 'YYYY-MM-DD'; parsed as LOCAL so it never shifts a day) ──
const DATE_FMT = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

function parseLocalDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysUntil(iso, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((parseLocalDate(iso) - today) / 86400000)
}

const plural = (n) => `${n} DAY${n === 1 ? '' : 'S'}`

/** Deadline cell: date line + relative note, with urgency tones. */
export function deadlineInfo(project, now = new Date()) {
  if (!project.deadline) {
    return { primary: '—', primaryTone: 'text-neutral-400', note: 'No deadline', noteTone: 'text-neutral-400' }
  }
  const date = DATE_FMT.format(parseLocalDate(project.deadline))
  if (project.status === 'completed') {
    return { primary: date, primaryTone: 'text-neutral-900', note: 'Delivered', noteTone: 'text-green-600' }
  }
  const days = daysUntil(project.deadline, now)
  if (days < 0) return { primary: date, primaryTone: 'text-red-600', note: `OVERDUE ${plural(-days)}`, noteTone: 'text-red-600' }
  if (days === 0) return { primary: 'Today', primaryTone: 'text-neutral-900', note: 'DUE TODAY', noteTone: 'text-orange-500' }
  if (days === 1) return { primary: 'Tomorrow', primaryTone: 'text-neutral-900', note: 'DUE TOMORROW', noteTone: 'text-orange-500' }
  return {
    primary: date,
    primaryTone: 'text-neutral-900',
    note: `IN ${plural(days)}`,
    noteTone: days <= 7 ? 'text-orange-500' : 'text-neutral-400',
  }
}

// ── Milestones ───────────────────────────────────────────────────
/** "4 of 6" → percent + bar/text tones. Blocked = orange, 100% = green. */
export function milestoneProgress({ milestones, status }) {
  const { done = 0, total = 0 } = milestones ?? {}
  const percent = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0
  const halted = status === 'blocked'
  const tone = halted
    ? { bar: 'bg-orange-500', text: 'text-orange-600' }
    : percent === 100
      ? { bar: 'bg-green-500', text: 'text-green-600' }
      : { bar: 'bg-primary-600', text: 'text-neutral-900' }
  return { done, total, percent, halted, ...tone }
}

// ── Value & invoicing (finance data — gate with canSeeFinance in the columns) ──
export function invoicingNote({ value, invoiced, paid }) {
  if (!(value > 0)) return { text: 'No budget set', tone: 'text-neutral-400' }
  if (paid >= value) return { text: 'Paid in Full', tone: 'font-semibold text-green-600' }
  if (!(invoiced > 0)) return { text: 'Not invoiced', tone: 'text-neutral-400' }
  return { text: `${Math.round((invoiced / value) * 100)}% invoiced (${compactMoney(invoiced)})`, tone: 'text-neutral-500' }
}
