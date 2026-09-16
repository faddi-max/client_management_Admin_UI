import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import { ROUTES } from '@/constants/routes'

// Pages
import Dashboard        from '@/pages/Dashboard/Dashboard'
import Clients          from '@/pages/Clients/Clients'
import Projects         from '@/pages/Projects/Projects'
import Requirements     from '@/pages/Requirements/Requirements'
import Payments         from '@/pages/Payments/Payments'
import Invoices         from '@/pages/Invoices/Invoices'
import CostCalculator   from '@/pages/CostCalculator/CostCalculator'
import Proposals        from '@/pages/Proposals/Proposals'
import CredentialsVault from '@/pages/CredentialsVault/CredentialsVault'
import Domains          from '@/pages/Domains/Domains'
import Hosting          from '@/pages/Hosting/Hosting'
import Renewals         from '@/pages/Renewals/Renewals'
import Documents        from '@/pages/Documents/Documents'
import Notifications    from '@/pages/Notifications/Notifications'
import EmailWhatsApp    from '@/pages/EmailWhatsApp/EmailWhatsApp'
import PricingRules     from '@/pages/PricingRules/PricingRules'

/**
 * AppRoutes — single place for all route definitions.
 *
 * Structure:
 *   /                  → MainLayout (renders Sidebar + Header once)
 *     /                → Dashboard
 *     /clients         → Clients
 *     …etc
 *
 * To add a page:
 *   1. Add its path to constants/routes.js
 *   2. Create pages/YourPage/YourPage.jsx
 *   3. Import it here and add a <Route> entry
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Authenticated shell — all children share Sidebar + Header */}
      <Route element={<MainLayout />}>
        <Route index                       element={<Dashboard />} />
        <Route path={ROUTES.CLIENTS}          element={<Clients />} />
        <Route path={ROUTES.PROJECTS}         element={<Projects />} />
        <Route path={ROUTES.REQUIREMENTS}     element={<Requirements />} />
        <Route path={ROUTES.PAYMENTS}         element={<Payments />} />
        <Route path={ROUTES.INVOICES}         element={<Invoices />} />
        <Route path={ROUTES.COST_CALCULATOR}  element={<CostCalculator />} />
        <Route path={ROUTES.PROPOSALS}        element={<Proposals />} />
        <Route path={ROUTES.CREDENTIALS_VAULT} element={<CredentialsVault />} />
        <Route path={ROUTES.DOMAINS}          element={<Domains />} />
        <Route path={ROUTES.HOSTING}          element={<Hosting />} />
        <Route path={ROUTES.RENEWALS}         element={<Renewals />} />
        <Route path={ROUTES.DOCUMENTS}        element={<Documents />} />
        <Route path={ROUTES.NOTIFICATIONS}    element={<Notifications />} />
        <Route path={ROUTES.EMAIL_WHATSAPP}   element={<EmailWhatsApp />} />
        <Route path={ROUTES.PRICING_RULES}    element={<PricingRules />} />
      </Route>
    </Routes>
  )
}
