// Domain & hosting vocabulary: single source of truth for the UI, the mocks and (later) the API contract.
// NOT defined in the PRD. Values come from the approved design, so confirm them before the backend seeds them.

export const ASSET_KINDS = [
  { value: 'domain', label: 'Domain Registrations' },
  { value: 'hosting', label: 'Cloud & Dedicated Hosting' },
  { value: 'dns', label: 'DNS & Nameservers' },
  { value: 'ssl', label: 'SSL Certificates' },
]

// A renewal due within this many days is flagged (orange dot / orange date).
export const RENEWAL_WARN_DAYS = 30

// "Renewal within N days" filter. value = days; sent to the API as `renewalWithin`.
export const RENEWAL_WINDOWS = [
  { value: 'all', label: 'Any time' },
  { value: '7', label: 'Next 7 Days' },
  { value: '30', label: 'Next 30 Days' },
  { value: '90', label: 'Next 90 Days' },
]

export const HEALTH_FILTERS = [
  { value: 'all', label: 'All Health' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'expiring', label: 'Expiring Soon' },
  { value: 'critical', label: 'Critical' },
]