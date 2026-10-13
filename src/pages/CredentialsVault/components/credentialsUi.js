import { Cloud, Server, Database, Banknote, Network, KeyRound } from 'lucide-react'
import { CREDENTIAL_CATEGORIES, ROTATION_STALE_DAYS } from '@/constants/credentialConfig'

// Presentation rules for credentials. The API sends facts (dates, ids); tones/labels are derived here.
// Same role as projectsUi.js / clientsUi.js.

export const MASK = '••••••••••••••••••••' // fixed length on purpose — never hint at the real secret length

const VISUAL = {
  hosting_cloud:   { icon: Cloud,    iconWrap: 'bg-indigo-50', iconTone: 'text-primary-600' },
  registrar_dns:   { icon: Server,   iconWrap: 'bg-indigo-50', iconTone: 'text-primary-600' },
  database:        { icon: Database, iconWrap: 'bg-indigo-50', iconTone: 'text-primary-600' },
  payment_gateway: { icon: Banknote, iconWrap: 'bg-orange-50', iconTone: 'text-amber-700' },
  cms_app:         { icon: Network,  iconWrap: 'bg-indigo-50', iconTone: 'text-orange-500' },
  api_key:         { icon: KeyRound, iconWrap: 'bg-indigo-50', iconTone: 'text-primary-600' },
}
const FALLBACK = { icon: KeyRound, iconWrap: 'bg-indigo-50', iconTone: 'text-primary-600' }

export const CATEGORY_META = Object.fromEntries(
  CREDENTIAL_CATEGORIES.map((c) => [c.value, { label: c.label, ...(VISUAL[c.value] ?? FALLBACK) }])
)
export const categoryMeta = (key) => CATEGORY_META[key] ?? { label: key, ...FALLBACK }

export const ENV_META = {
  production:     { label: 'Production',     pill: 'bg-red-50 text-red-700',         dot: 'bg-red-600' },
  staging:        { label: 'Staging',        pill: 'bg-amber-50 text-amber-700',     dot: 'bg-amber-500' },
  infrastructure: { label: 'Infrastructure', pill: 'bg-neutral-100 text-neutral-700', dot: 'bg-neutral-700' },
}
export const envMeta = (key) => ENV_META[key] ?? { label: key, pill: 'bg-neutral-100 text-neutral-700', dot: 'bg-neutral-500' }

// Access tiers are display-only here. NOT in the PRD (which defines roles) — enforcement is the backend's job.
export const TIER_META = {
  ops_lead:   { label: 'Ops Lead Only', tone: 'bg-indigo-50 text-primary-700' },
  restricted: { label: 'Restricted',    tone: 'bg-red-100 text-red-700' },
  team:       { label: 'Team Access',   tone: 'bg-indigo-50 text-neutral-600' },
}
export const tierMeta = (key) => TIER_META[key] ?? TIER_META.team

/** Last-rotated cell: relative age; stale ones turn red with "Rotation Required". */
export function rotationInfo({ lastRotatedAt, lastRotatedBy }, now = new Date()) {
  if (!lastRotatedAt) {
    return { stale: true, primary: 'Never rotated', primaryTone: 'text-red-700', secondary: 'Rotation Required', secondaryTone: 'text-red-700' }
  }
  const days = Math.max(0, Math.floor((now - new Date(lastRotatedAt)) / 86400000))
  const stale = days > ROTATION_STALE_DAYS
  return {
    stale,
    primary: days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'} ago`,
    primaryTone: stale ? 'font-semibold text-red-700' : 'text-neutral-900',
    secondary: stale ? 'Rotation Required' : lastRotatedBy ?? '—',
    secondaryTone: stale ? 'text-red-700' : 'text-neutral-500',
  }
}