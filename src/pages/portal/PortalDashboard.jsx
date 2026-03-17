import { useState, useEffect } from 'react'
import { FileText, Palmtree, DollarSign, Clock, LogIn, LogOut } from 'lucide-react'
import { apiClient } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'

export default function PortalDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get('/api/dashboard/worker')
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

  const handleMarcarAsistencia = async (tipo) => {
    setMarking(true)
    setError('')
    try {
      const res = await apiClient.post('/api/asistencia/marcar', { tipo })
      if (res.success) {
        alert(`${tipo === 'ENTRADA' ? 'Entrada' : 'Salida'} registrada correctamente`)
      } else {
        setError(res.error || 'Error al marcar asistencia')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setMarking(false)
    }
  }

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
        <h1 className="text-2xl font-bold text-[#111827]">
          Hola, {user?.nombre || 'Trabajador'}
        </h1>
        <p className="text-[#6B7280] mt-1">Bienvenido a tu portal de trabajador</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Ultima liquidacion"
          value={stats?.ultimaLiquidacion || '-'}
        />
        <StatCard
          icon={Palmtree}
          label="Dias vacaciones disponibles"
          value={stats?.diasVacaciones ?? 0}
        />
        <StatCard
          icon={FileText}
          label="Permisos pendientes"
          value={stats?.permisosPendientes ?? 0}
        />
        <StatCard
          icon={Clock}
          label="Asistencia del mes"
          value={`${stats?.diasTrabajados ?? 0} dias`}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <h2 className="text-base font-semibold text-[#111827] mb-4">Marcar asistencia</h2>
        <div className="flex items-center gap-3">
          <Button onClick={() => handleMarcarAsistencia('ENTRADA')} loading={marking}>
            <LogIn className="w-4 h-4" />
            Marcar entrada
          </Button>
          <Button variant="outline" onClick={() => handleMarcarAsistencia('SALIDA')} loading={marking}>
            <LogOut className="w-4 h-4" />
            Marcar salida
          </Button>
        </div>
      </div>
    </div>
  )
}
