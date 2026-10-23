import { Lock, ShieldCheck } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { RENEWAL_WARN_DAYS } from '@/constants/domainConfig'

// Presentation rules for domain assets. The API sends facts; labels, tones and "in 18 days" are derived here.
// Same role as projectsUi.js / credentialsUi.js.

// NOTE: another copy of this helper (clientsUi, projectsUi, here) → candidate for utils.
export const money = (n) => formatCurrency(n).replace(/\.00$/, '')

// ── Pills ────────────────────────────────────────────────────────
const TONES = {
  indigo: 'bg-indigo-50 text-primary-700',
  green: 'bg-green-50 text-green-700',
  orange: 'bg-orange-50 text-orange-700',
  sky: 'bg-sky-50 text-sky-700',
  neutral: 'bg-neutral-100 text-neutral-600',
}
const KIND_TONE = { domain: 'indigo', hosting: 'indigo', dns: 'green', ssl: 'sky' }
const PROVIDER_TONE = [['cloudflare', 'orange'], ['aws', 'indigo'], ['digitalocean', 'sky'], ['namecheap', 'green']]

export const typeTone = (kind) => TONES[KIND_TONE[kind] ?? 'neutral']
export function providerTone(name = '') {
  const n = name.toLowerCase()
  const hit = PROVIDER_TONE.find(([key]) => n.startsWith(key))
  return TONES[hit?.[1] ?? 'neutral']
}

export const PROTECTION = {
  locked: { icon: Lock, label: 'Registrar lock enabled' },
  verified: { icon: ShieldCheck, label: 'Verified' },
}

// ── Dates (renewalDate is 'YYYY-MM-DD'; parsed as LOCAL so it never shifts a day) ──
const DATE_FMT = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

function parseLocalDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysUntil(iso, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((parseLocalDate(iso) - today) / 86400000)
}

const plural = (n) => `${n} day${n === 1 ? '' : 's'}`

/** Renewal cell: date line + relative note, with urgency tones. */
export function renewalInfo(asset, now = new Date()) {
  if (!asset.renewalDate) return { date: '—', note: 'No renewal', dateTone: 'text-neutral-400', noteTone: 'text-neutral-400', expiring: false }
  const date = DATE_FMT.format(parseLocalDate(asset.renewalDate))
  const days = daysUntil(asset.renewalDate, now)
  if (days < 0) return { date, note: `${plural(-days)} overdue`, dateTone: 'text-red-600', noteTone: 'text-red-600', expiring: true }
  const note = days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${plural(days)}`
  const expiring = days <= RENEWAL_WARN_DAYS
  return { date, note, dateTone: expiring ? 'font-semibold text-orange-700' : 'text-neutral-900', noteTone: 'text-neutral-400', expiring }
}

/** Status dot beside the hostname. Order = priority. */
export function assetStatus(asset, now = new Date()) {
  if (asset.health === 'critical') return { dot: 'bg-red-500', label: 'Critical' }
  if (renewalInfo(asset, now).expiring) return { dot: 'bg-orange-500', label: 'Renewal due soon' }
  return { dot: 'bg-green-500', label: 'Healthy' }
}

/** "$14.50 → $120/yr  +88% margin" */
export function costInfo({ cost, billed, period, marginPercent }) {
  return {
    cost: formatCurrency(cost),
    billed: `${money(billed)}/${period}`,
    margin: `+${marginPercent}% margin`,
  }
}