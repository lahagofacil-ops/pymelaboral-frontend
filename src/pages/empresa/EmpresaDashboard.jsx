import { useState, useEffect } from 'react'
import { Users, FileText, DollarSign, Briefcase } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP } from '../../lib/utils'
import StatCard from '../../components/ui/StatCard'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'

export default function EmpresaDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get('/api/dashboard')
      if (result.success) {
        setStats(result.data.stats)
      } else {
        setError(result.error || 'Error al cargar el dashboard')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (error) return <Alert type="error">{error}</Alert>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Trabajadores Activos"
          value={stats?.trabajadoresActivos ?? 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Contratos Vigentes"
          value={stats?.contratosVigentes ?? 0}
          icon={FileText}
          color="green"
        />
        <StatCard
          title="Cotizaciones Pendientes"
          value={stats?.cotizacionesPendientes ?? 0}
          icon={DollarSign}
          color="yellow"
        />
        <StatCard
          title="Total Sueldos"
          value={formatCLP(stats?.totalSueldos ?? 0)}
          icon={Briefcase}
          color="purple"
        />
      </div>
    </div>
  )
}
