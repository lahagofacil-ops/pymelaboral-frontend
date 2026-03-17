import { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, post } from '../api/client'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  const refreshUser = useCallback(async () => {
    try {
      const result = await get('/api/auth/me')
      if (result.success && result.data) {
        setUser(result.data)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch {
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      const token = sessionStorage.getItem('accessToken')
      if (token) {
        await refreshUser()
      }
      setLoading(false)
    }
    initAuth()
  }, [refreshUser])

  const login = async (email, password) => {
    const result = await post('/api/auth/login', { email, password })
    if (result.success && result.data) {
      sessionStorage.setItem('accessToken', result.data.accessToken)
      sessionStorage.setItem('refreshToken', result.data.refreshToken)
      setUser(result.data.user)
      setIsAuthenticated(true)
      return result.data
    }
    throw new Error(result.error || 'Error al iniciar sesión')
  }

  const logout = useCallback(() => {
    sessionStorage.clear()
    setUser(null)
    setIsAuthenticated(false)
    navigate('/login')
  }, [navigate])

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
