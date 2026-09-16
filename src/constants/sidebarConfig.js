import {
  LayoutDashboard,
  Users,
  Briefcase,
  ClipboardCheck,
  CreditCard,
  FileText,
  Calculator,
  FileEdit,
  Lock,
  Globe,
  Server,
  RefreshCw,
  FolderOpen,
  Bell,
  MessageSquare,
  SlidersHorizontal,
} from 'lucide-react'

export const SIDEBAR_NAV = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { label: 'Clients', icon: Users, path: '/clients', badge: 48 },
      { label: 'Projects', icon: Briefcase, path: '/projects' },
      { label: 'Requirements', icon: ClipboardCheck, path: '/requirements' },
    ],
  },
  {
    section: 'Finance',
    items: [
      { label: 'Payments', icon: CreditCard, path: '/payments' },
      { label: 'Invoices', icon: FileText, path: '/invoices' },
      { label: 'Cost Calculator', icon: Calculator, path: '/cost-calculator' },
      { label: 'Proposals', icon: FileEdit, path: '/proposals' },
    ],
  },
  {
    section: 'Operations',
    items: [
      { label: 'Credentials Vault', icon: Lock, path: '/credentials-vault' },
      { label: 'Domains', icon: Globe, path: '/domains' },
      { label: 'Hosting', icon: Server, path: '/hosting' },
      {
        label: 'Renewals',
        icon: RefreshCw,
        path: '/renewals',
        badge: '3 Due',
        badgeVariant: 'warning',
      },
      { label: 'Documents', icon: FolderOpen, path: '/documents' },
    ],
  },
  {
    section: 'Communication',
    items: [
      { label: 'Notifications', icon: Bell, path: '/notifications' },
      { label: 'Email & WhatsApp', icon: MessageSquare, path: '/email-whatsapp' },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'Pricing Rules', icon: SlidersHorizontal, path: '/pricing-rules' },
    ],
  },
]