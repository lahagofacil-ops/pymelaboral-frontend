import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, Briefcase, MessageSquare, Plus } from 'lucide-react'
import { apiClient } from '../../api/client'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/api/admin/stats')
        if (res.success) {
          setStats(res.data)
        } else {
          setError(res.error || 'Error al cargar estadisticas')
        }
      } catch {
        setError('Error de conexion')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Panel de Administracion</h1>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          label="Total empresas"
          value={stats?.totalEmpresas ?? 0}
        />
        <StatCard
          icon={Users}
          label="Total usuarios"
          value={stats?.totalUsers ?? 0}
        />
        <StatCard
          icon={Briefcase}
          label="Total trabajadores"
          value={stats?.totalTrabajadores ?? 0}
        />
        <StatCard
          icon={MessageSquare}
          label="Mensajes chat hoy"
          value={stats?.chatMessagesToday ?? 0}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={() => navigate('/admin/empresas')}>
          <Plus className="w-4 h-4" />
          Nueva empresa
        </Button>
        <Button variant="outline" onClick={() => navigate('/admin/supervisoras')}>
          <Plus className="w-4 h-4" />
          Nueva supervisora
        </Button>
      </div>
    </div>
  )
}
