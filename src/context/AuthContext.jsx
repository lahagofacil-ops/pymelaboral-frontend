import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => sessionStorage.getItem('accessToken'))

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = (data) => {
    sessionStorage.setItem('accessToken', data.accessToken)
    sessionStorage.setItem('refreshToken', data.refreshToken)
    sessionStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.accessToken)
    setUser(data.user)
  }

  const logout = () => {
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('impersonatedEmpresaId')
    sessionStorage.removeItem('impersonatedEmpresaNombre')
    setToken(null)
    setUser(null)
    navigate('/')
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
