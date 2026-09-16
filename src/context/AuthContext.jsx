import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

// Mock user — replace with real auth logic
const MOCK_USER = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'Administrator',
  avatar: null,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Hydrate from localStorage on first load
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback((credentials) => {
    // TODO: Replace with real API call
    console.log('Login with:', credentials)
    const authedUser = MOCK_USER
    localStorage.setItem('auth_user', JSON.stringify(authedUser))
    localStorage.setItem('auth_token', 'mock-token-123')
    setUser(authedUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    setUser(null)
  }, [])

  const isAuthenticated = Boolean(user)

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access auth state and actions.
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
