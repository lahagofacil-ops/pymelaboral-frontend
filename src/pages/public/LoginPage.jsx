import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Mail, Lock } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Alert from '../../components/ui/Alert'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await login(email, password)
      const role = data.user?.role

      switch (role) {
        case 'SUPER_ADMIN':
          navigate('/admin', { replace: true })
          break
        case 'SUPERVISOR':
          navigate('/supervisor', { replace: true })
          break
        case 'OWNER':
        case 'ADMIN':
          navigate('/empresa/dashboard', { replace: true })
          break
        case 'WORKER':
          navigate('/portal', { replace: true })
          break
        default:
          navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#2563EB] mb-2">PymeLaboral</h1>
            <h2 className="text-lg font-semibold text-[#111827]">Iniciar Sesión</h2>
          </div>

          {error && (
            <Alert type="error" message={error} className="mb-6" />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              name="email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              autoComplete="email"
            />
            <Input
              label="Contraseña"
              name="password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Tu contraseña"
              autoComplete="current-password"
            />
            <Button type="submit" loading={loading} className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
