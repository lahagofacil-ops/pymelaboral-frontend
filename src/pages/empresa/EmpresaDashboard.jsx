import { useState, useEffect } from 'react'
import { Users, FileText, DollarSign, Palmtree } from 'lucide-react'
import { apiClient } from '../../api/client'
import { useEmpresa } from '../../context/EmpresaContext'
import StatCard from '../../components/ui/StatCard'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'

export default function EmpresaDashboard() {
  const { empresaNombre } = useEmpresa()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get('/api/dashboard')
        if (res.success) {
          setStats(res.data)
        } else {
          setError(res.error || 'Error al cargar datos')
        }
      } catch {
        setError('Error de conexion')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
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
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">{empresaNombre || 'Dashboard'}</h1>
        <p className="text-[#6B7280] mt-1">Resumen general de tu empresa</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total trabajadores"
          value={stats?.totalTrabajadores ?? 0}
        />
        <StatCard
          icon={FileText}
          label="Contratos vigentes"
          value={stats?.contratosVigentes ?? 0}
        />
        <StatCard
          icon={DollarSign}
          label="Liquidaciones del mes"
          value={stats?.liquidacionesMes ?? 0}
        />
        <StatCard
          icon={Palmtree}
          label="Vacaciones pendientes"
          value={stats?.vacacionesPendientes ?? 0}
        />
      </div>
    </div>
  )
}
