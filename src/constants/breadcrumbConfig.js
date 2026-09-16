// Maps a route path to the breadcrumb trail shown in the Header.
// Each entry is an array of { label, path } — the last item is the
// current page (rendered bold/dark), earlier items are clickable links.

export const BREADCRUMB_MAP = {
  '/': [
    { label: 'Operations', path: '/' },
    { label: 'Command Center', path: '/' },
  ],
  '/clients': [
    { label: 'Operations', path: '/' },
    { label: 'Clients', path: '/clients' },
  ],
  '/projects': [
    { label: 'Operations', path: '/' },
    { label: 'Projects', path: '/projects' },
  ],
  '/requirements': [
    { label: 'Operations', path: '/' },
    { label: 'Requirements', path: '/requirements' },
  ],
  '/payments': [
    { label: 'Finance', path: '/' },
    { label: 'Payments', path: '/payments' },
  ],
  '/invoices': [
    { label: 'Finance', path: '/' },
    { label: 'Invoices', path: '/invoices' },
  ],
  '/cost-calculator': [
    { label: 'Finance', path: '/' },
    { label: 'Cost Calculator', path: '/cost-calculator' },
  ],
  '/proposals': [
    { label: 'Finance', path: '/' },
    { label: 'Proposals', path: '/proposals' },
  ],
  '/credentials-vault': [
    { label: 'Operations', path: '/' },
    { label: 'Credentials Vault', path: '/credentials-vault' },
  ],
  '/domains': [
    { label: 'Operations', path: '/' },
    { label: 'Domains', path: '/domains' },
  ],
  '/hosting': [
    { label: 'Operations', path: '/' },
    { label: 'Hosting', path: '/hosting' },
  ],
  '/renewals': [
    { label: 'Operations', path: '/' },
    { label: 'Renewals', path: '/renewals' },
  ],
  '/documents': [
    { label: 'Operations', path: '/' },
    { label: 'Documents', path: '/documents' },
  ],
  '/notifications': [
    { label: 'Communication', path: '/' },
    { label: 'Notifications', path: '/notifications' },
  ],
  '/email-whatsapp': [
    { label: 'Communication', path: '/' },
    { label: 'Email & WhatsApp', path: '/email-whatsapp' },
  ],
  '/pricing-rules': [
    { label: 'System', path: '/' },
    { label: 'Pricing Rules', path: '/pricing-rules' },
  ],
}

// Fallback if a route isn't in the map above
export const DEFAULT_CRUMBS = [{ label: 'Home', path: '/' }]
