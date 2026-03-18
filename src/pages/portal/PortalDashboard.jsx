import { useState, useEffect } from 'react'
import { Calendar, DollarSign, Clock, FileText, LogIn, LogOut } from 'lucide-react'
import { apiClient } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { formatCLP } from '../../lib/utils'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

export default function PortalDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get('/api/dashboard/empresa')
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || 'Error al cargar el dashboard')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleMarcar = async (tipo) => {
    try {
      setMarking(true)
      setError(null)
      const result = await apiClient.post('/api/asistencia/marcar', {
        trabajadorId: user?.trabajadorId,
        tipo,
      })
      if (result.success) {
        fetchDashboard()
      } else {
        setError(result.error || 'Error al marcar asistencia')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setMarking(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (error && !data) return <Alert type="error">{error}</Alert>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">
          Hola, {data?.trabajador?.nombre || user?.nombre || 'Trabajador'}
        </h1>
        <p className="text-[#6B7280]">
          {data?.trabajador?.cargo && `${data.trabajador.cargo} · `}
          {data?.trabajador?.sueldo ? formatCLP(data.trabajador.sueldo) : ''}
        </p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          label="Último Líquido"
          value={data?.ultimaLiquidacion ? formatCLP(data.ultimaLiquidacion.liquido) : '$0'}
          icon={DollarSign}
        />
        <StatCard
          label="Vacaciones Tomadas"
          value={`${data?.vacacionesTomadas ?? 0} días`}
          icon={Calendar}
        />
        <StatCard
          label="Solicitudes Pendientes"
          value={(data?.solicitudesPendientes?.vacaciones ?? 0) + (data?.solicitudesPendientes?.permisos ?? 0)}
          icon={FileText}
        />
      </div>

      {data?.ultimaLiquidacion && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-3">Última Liquidación</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-[#6B7280]">Periodo</p>
              <p className="font-medium text-[#111827]">{data.ultimaLiquidacion.periodo}</p>
            </div>
            <div>
              <p className="text-[#6B7280]">Total Haberes</p>
              <p className="font-medium text-[#111827]">{formatCLP(data.ultimaLiquidacion.totalHaberes)}</p>
            </div>
            <div>
              <p className="text-[#6B7280]">Total Descuentos</p>
              <p className="font-medium text-[#111827]">{formatCLP(data.ultimaLiquidacion.totalDescuentos)}</p>
            </div>
            <div>
              <p className="text-[#6B7280]">Líquido</p>
              <p className="font-bold text-[#111827]">{formatCLP(data.ultimaLiquidacion.liquido)}</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-4">Marcar Asistencia</h2>
        <div className="flex gap-4">
          <Button onClick={() => handleMarcar('ENTRADA')} loading={marking}>
            <LogIn className="w-4 h-4 mr-2" />
            Marcar Entrada
          </Button>
          <Button onClick={() => handleMarcar('SALIDA')} loading={marking} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Marcar Salida
          </Button>
        </div>
      </Card>
    </div>
  )
}
