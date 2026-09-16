import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { SIDEBAR_NAV } from '@/constants/sidebarConfig'
import { useSidebar } from '@/context/SidebarContext'
import { cn } from '@/utils'
import kineticLogo from '@/assets/logo.png'

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar()

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-white border-r border-neutral-200',
        'transition-all duration-300 ease-in-out shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div className="flex items-center justify-center  px-4 py-4 border-b border-neutral-200 overflow-hidden">
        <img
          src={kineticLogo}
          alt="Kinetic Ops logo"
          className={cn(
            'object-contain transition-all duration-300',
            collapsed ? 'w-8 h-8' : 'w-full max-w-[170px] h-auto max-h-12'
          )}
        />
      </div>

      {/* ── Toggle button ────────────────────────────────────── */}
      <button
        onClick={toggle}
        className={cn(
          'absolute -right-3 top-14 z-10',
          'flex items-center justify-center w-6 h-6 rounded-full',
          'bg-white hover:bg-primary-600 hover:text-white border border-neutral-200',
          'text-neutral-400 shadow-sm transition-colors duration-200'
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight size={12} />
          : <ChevronLeft size={12} />
        }
      </button>

      {/* ── Navigation ───────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-5">
        {SIDEBAR_NAV.map(({ section, items }) => (
          <div key={section}>
            {!collapsed && (
              <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                {section}
              </p>
            )}

            <ul className="space-y-0.5">
              {items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm',
                        'transition-colors duration-150',
                        isActive
                          ? 'bg-primary-600 text-white font-medium shadow-sm'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      )
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon
                      size={18}
                      className="shrink-0"
                      aria-hidden="true"
                    />

                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}

                    {!collapsed && item.badge != null && (
                      <span
                        className={cn(
                          'ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full',
                          item.badgeVariant === 'warning'
                            ? 'bg-orange-500 text-white'
                            : 'bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200',
                          'peer-[.active]:bg-white/20 peer-[.active]:text-white'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Workspace / Org switcher ──────────────────────────── */}
      <div className="border-t border-neutral-200 px-4 py-3">
        <div
          className={cn(
            'flex items-center gap-2.5 cursor-pointer rounded-lg p-2',
            'hover:bg-neutral-100 transition-colors'
          )}
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary-600 text-white text-xs font-bold shrink-0">
            K
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  Kinetic Studios NY
                </p>
                <p className="text-[9px] text-neutral-400 truncate uppercase tracking-wide">
                  Role: Ops Lead
                </p>
                <p className="text-[9px] text-neutral-300 truncate">
                  v2.4.0-prod
                </p>
              </div>
              <ExternalLink size={14} className="text-neutral-300 shrink-0" />
            </>
          )}
        </div>
      </div>
    </aside>
  )
}