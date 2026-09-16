import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  LayoutGrid,
  Search,
  Bell,
  Plus,
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import { useAuth } from '@/context/AuthContext'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'
import { cn, getInitials } from '@/utils'

export default function Header() {
  const { toggle } = useSidebar()
  const { user, logout } = useAuth()
  const { crumbs } = useBreadcrumb()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 h-16 px-6 bg-white border-b border-neutral-200 shrink-0">

      {/* ── Hamburger ──────────────────────────────────────── */}
      <button
        onClick={toggle}
        className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm min-w-0">
        <LayoutGrid size={16} className="text-neutral-400 shrink-0" />
        {crumbs.map((crumb, idx) => (
          <span key={crumb.path} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight size={13} className="text-neutral-400 shrink-0" />}
            {idx === crumbs.length - 1 ? (
              <span className="font-semibold text-neutral-900 truncate">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="text-neutral-400 hover:text-primary-600 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* ── Spacer ─────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Global Search ──────────────────────────────────── */}
      <div className="relative hidden sm:block">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
        <input
          type="search"
          placeholder="Search clients, projects, invoices, docs…"
          className={cn(
            'w-80 pl-9 pr-11 py-1.5 text-sm rounded-lg',
            'bg-neutral-100 border border-neutral-200',
            'placeholder:text-neutral-400 text-neutral-800',
            'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent',
            'transition-all duration-200'
          )}
        />
        <span
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5',
            'px-1.5 py-0.5 rounded-md bg-white border border-neutral-200',
            'text-[10px] font-medium text-neutral-400 pointer-events-none'
          )}
        >
          ⌘K
        </span>
      </div>

      {/* ── Primary Action ─────────────────────────────────── */}
      <button
        className={cn(
          'relative hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium',
          'bg-primary-600 hover:bg-primary-700 text-white transition-colors'
        )}
      >
        <Plus size={15} />
        <span>Action</span>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
      </button>

      {/* ── Notification Bell ──────────────────────────────── */}
      <button
        className="relative p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
      </button>

      {/* ── User Profile Dropdown ──────────────────────────── */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((prev) => !prev)}
          className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-haspopup="true"
          aria-expanded={profileOpen}
        >
          {/* Avatar */}
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user?.name ?? 'User avatar'}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-xs font-bold shrink-0">
              {user ? getInitials(user.name) : 'U'}
            </div>
          )}
          <div className="hidden md:block text-left leading-tight">
            <p className="text-sm font-semibold text-neutral-900 truncate max-w-[130px]">
              {user?.name ?? 'User'}
            </p>
            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide truncate max-w-[130px]">
              {user?.role ?? 'Admin'}
            </p>
          </div>
          <ChevronDown size={15} className="hidden md:block text-neutral-400 shrink-0" />
        </button>

        {/* Dropdown menu */}
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-50">
            <div className="px-4 py-2 border-b border-neutral-100">
              <p className="text-sm font-semibold text-neutral-800">{user?.name}</p>
              <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
            </div>
            <DropdownItem icon={User} label="My Profile" onClick={() => setProfileOpen(false)} />
            <DropdownItem icon={Settings} label="Settings" onClick={() => setProfileOpen(false)} />
            <div className="border-t border-neutral-100 mt-1 pt-1">
              <DropdownItem
                icon={LogOut}
                label="Log out"
                onClick={() => { setProfileOpen(false); logout() }}
                className="text-danger-500 hover:bg-red-50"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function DropdownItem({ icon: Icon, label, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 w-full px-4 py-2 text-sm text-neutral-700',
        'hover:bg-neutral-50 transition-colors text-left',
        className
      )}
    >
      <Icon size={15} className="shrink-0" />
      {label}
    </button>
  )
}