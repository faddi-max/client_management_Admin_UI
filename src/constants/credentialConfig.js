// Credential domain vocabulary — single source of truth for the UI, the mocks
// and (later) the API contract.
//
// NOT defined in the PRD (it only names a `credential_categories` table).
// Values below come from the approved design — confirm before the backend seeds them.

export const CREDENTIAL_CATEGORIES = [
  { value: 'hosting_cloud', label: 'Hosting & Cloud' },
  { value: 'registrar_dns', label: 'Registrar / DNS' },
  { value: 'database', label: 'Database' },
  { value: 'payment_gateway', label: 'Payment Gateways' },
  { value: 'cms_app', label: 'CMS & App' },
  { value: 'api_key', label: 'API Keys' },
]

export const CREDENTIAL_ENVIRONMENTS = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'infrastructure', label: 'Infrastructure' },
]

// A credential not rotated for longer than this is "stale" (design: ">90 Days Stale").
export const ROTATION_STALE_DAYS = 90

// Fallback if the reveal endpoint doesn't send expiresInSec.
export const DEFAULT_REVEAL_SECONDS = 30