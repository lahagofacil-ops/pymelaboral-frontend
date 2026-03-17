import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Alert from '../../components/ui/Alert'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, role } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already authenticated, redirect
  if (isAuthenticated && role) {
    const redirectMap = {
      SUPER_ADMIN: '/admin',
      SUPERVISOR: '/supervisor',
      OWNER: '/empresa',
      ADMIN: '/empresa',
      WORKER: '/portal',
    }
    navigate(redirectMap[role] || '/', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      if (!res.success) {
        setError(res.error || 'Credenciales incorrectas')
        return
      }
      const userRole = res.data.user.role
      const redirectMap = {
        SUPER_ADMIN: '/admin',
        SUPERVISOR: '/supervisor',
        OWNER: '/empresa',
        ADMIN: '/empresa',
        WORKER: '/portal',
      }
      navigate(redirectMap[userRole] || '/', { replace: true })
    } catch {
      setError('Error de conexion. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="w-8 h-8 text-[#2563EB]" />
            <span className="text-2xl font-bold text-[#111827]">PymeLaboral</span>
          </div>
          <p className="text-sm text-[#6B7280]">Ingresa a tu cuenta</p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert type="error" message={error} onClose={() => setError('')} />
            )}

            <Input
              label="Email"
              type="email"
              name="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.cl"
              required
            />

            <Input
              label="Contrasena"
              type="password"
              name="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contrasena"
              required
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Iniciar sesion
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
