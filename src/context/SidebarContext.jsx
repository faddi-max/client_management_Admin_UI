import { createContext, useContext, useState, useCallback } from 'react'

const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false)

  const toggle = useCallback(() => setCollapsed((prev) => !prev), [])
  const expand  = useCallback(() => setCollapsed(false), [])
  const collapse = useCallback(() => setCollapsed(true), [])

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, expand, collapse }}>
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
