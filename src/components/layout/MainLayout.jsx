import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { SidebarProvider } from '@/context/SidebarContext'

/**
 * MainLayout — the single authenticated shell.
 *
 * Renders Sidebar + Header exactly once, then projects child routes
 * through React Router's <Outlet />. No page needs to import
 * Sidebar or Header directly.
 *
 * Tree:
 *   <SidebarProvider>        ← collapse state
 *     <div flex row>
 *       <Sidebar />          ← left panel
 *       <div flex col>       ← right panel
 *         <Header />         ← top bar
 *         <main>             ← page content
 *           <Outlet />       ← child route renders here
 *         </main>
 *       </div>
 *     </div>
 *   </SidebarProvider>
 */
export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
