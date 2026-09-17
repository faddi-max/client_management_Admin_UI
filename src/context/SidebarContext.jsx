import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const handleChange = (event) => {
      setIsMobile(event.matches)
      if (!event.matches) setMobileOpen(false)
    }
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const toggle = useCallback(() => {
    if (isMobile) setMobileOpen((prev) => !prev)
    else setCollapsed((prev) => !prev)
  }, [isMobile])
  const expand  = useCallback(() => setCollapsed(false), [])
  const collapse = useCallback(() => setCollapsed(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <SidebarContext.Provider value={{ collapsed, isMobile, mobileOpen, toggle, expand, collapse, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

/**
 * Hook to access sidebar collapse state and controls.
 * Must be used inside <SidebarProvider>.
 */
export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within a SidebarProvider')
  return ctx
}
