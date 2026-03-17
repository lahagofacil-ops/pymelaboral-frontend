import { createContext, useContext, useState, useCallback } from 'react'
import { apiClient } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // CRITICAL: Initialize synchronously from sessionStorage to prevent flash redirect
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(() => {
    // Only loading if we have tokens but haven't verified yet
    return !!sessionStorage.getItem('accessToken') && !sessionStorage.getItem('user')
  })

  const login = useCallback(async (email, password) => {
    const res = await apiClient.post('/api/auth/login', { email, password })
    if (!res.success) return res
    sessionStorage.setItem('accessToken', res.data.accessToken)
    sessionStorage.setItem('refreshToken', res.data.refreshToken)
    sessionStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('impersonatedEmpresaId')
    sessionStorage.removeItem('impersonatedEmpresaNombre')
    setUser(null)
  }, [])

  const isAuthenticated = !!user
  const role = user?.role || null

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, role, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
