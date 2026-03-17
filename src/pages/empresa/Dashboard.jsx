import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, FileText, DollarSign, Calculator, Palmtree, ShieldCheck,
  Plus, UserPlus
} from 'lucide-react'
import { get } from '../../api/client'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await get('/api/dashboard')
        if (res.success) setStats(res.data)
      } catch (err) {
        setError(err.message)
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
          <p className="text-sm text-[#6B7280]">Resumen de tu empresa</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Trabajadores"
          value={stats?.totalTrabajadores ?? 0}
        />
        <StatCard
          icon={FileText}
          label="Contratos Vigentes"
          value={stats?.totalContratos ?? 0}
        />
        <StatCard
          icon={DollarSign}
          label="Liquidaciones del Mes"
          value={stats?.liquidacionesMes ?? 0}
        />
        <StatCard
          icon={Calculator}
          label="Cotizaciones Pendientes"
          value={stats?.cotizacionesPendientes ?? 0}
        />
        <StatCard
          icon={Palmtree}
          label="Vacaciones Pendientes"
          value={stats?.vacacionesPendientes ?? 0}
        />
        <StatCard
          icon={ShieldCheck}
          label="Compliance"
          value={stats?.compliancePorcentaje != null ? `${stats.compliancePorcentaje}%` : 'N/A'}
        />
      </div>

      <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/empresa/trabajadores')}>
            <UserPlus className="w-4 h-4" />
            Nuevo Trabajador
          </Button>
          <Button variant="secondary" onClick={() => navigate('/empresa/liquidaciones')}>
            <DollarSign className="w-4 h-4" />
            Nueva Liquidación
          </Button>
          <Button variant="secondary" onClick={() => navigate('/empresa/contratos')}>
            <Plus className="w-4 h-4" />
            Nuevo Contrato
          </Button>
        </div>
      </div>
    </div>
  )
}
