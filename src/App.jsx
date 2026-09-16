import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import AppRoutes from '@/routes/AppRoutes'

/**
 * App — root component.
 *
 * Providers wrap order (outer → inner):
 *   BrowserRouter → AuthProvider → AppRoutes
 *
 * SidebarProvider lives inside MainLayout so it's only
 * active when the authenticated shell is rendered.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
