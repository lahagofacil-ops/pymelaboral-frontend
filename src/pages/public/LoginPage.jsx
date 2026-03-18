import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { apiClient } from '../../api/client'

const ROLE_REDIRECTS = {
  SUPER_ADMIN: '/admin',
  SUPERVISOR: '/supervisor',
  OWNER: '/empresa',
  ADMIN: '/empresa',
  WORKER: '/portal'
}

export default function LoginPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await apiClient.post('/api/auth/login', { email, password })

      if (res.success) {
        auth.login(res.data)
        const role = res.data.user?.role || res.data.user?.rol
        const redirect = ROLE_REDIRECTS[role] || '/empresa'
        navigate(redirect, { replace: true })
      } else {
        setError(res.error || 'Credenciales inválidas')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-[#E5E7EB] w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#2563EB]">PymeLaboral</h1>
          <p className="text-sm text-[#6B7280] mt-1">Ingresa a tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#DC2626] rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              placeholder="Tu contraseña"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-2.5 rounded-lg hover:bg-[#1E40AF] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
