import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Palmtree, DollarSign, Clock, LogIn, LogOut } from 'lucide-react'
import { get, post } from '../../api/client'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { formatMoney, formatDate, formatPeriodo } from '../../lib/formatters'

export default function PortalDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await get('/api/dashboard')
        if (res.success) setDashboard(res.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleMarcarAsistencia = async (tipo) => {
    setMarking(true)
    try {
      const now = new Date()
      const fecha = now.toISOString().slice(0, 10)
      const hora = now.toTimeString().slice(0, 5)
      await post('/api/asistencia/marcar', { tipo, fecha, hora })
      setError('')
      const res = await get('/api/dashboard')
      if (res.success) setDashboard(res.data)
    } catch (err) {
      setError(err.message || 'Error al marcar asistencia')
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">
          Bienvenido, {user?.nombre || 'Trabajador'}
        </h1>
        <p className="text-sm text-[#6B7280]">Portal del Trabajador</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Contrato */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-[#2563EB]" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827]">Mi Contrato</h3>
          </div>
          {dashboard?.contrato ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Cargo</span>
                <span className="text-[#111827] font-medium">{dashboard.contrato.cargo || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Tipo</span>
                <span className="text-[#111827] font-medium">{dashboard.contrato.tipo || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Sueldo Base</span>
                <span className="text-[#111827] font-medium">{formatMoney(dashboard.contrato.sueldoBase)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Estado</span>
                <Badge variant="success">{dashboard.contrato.estado || 'Vigente'}</Badge>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6B7280]">Sin contrato vigente</p>
          )}
        </div>

        {/* Vacaciones */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Palmtree className="w-5 h-5 text-[#059669]" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827]">Mis Vacaciones</h3>
          </div>
          {dashboard?.vacaciones ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Días Totales</span>
                <span className="text-[#111827] font-medium">{dashboard.vacaciones.diasTotales || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Días Usados</span>
                <span className="text-[#111827] font-medium">{dashboard.vacaciones.diasUsados || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Saldo Disponible</span>
                <span className="text-[#2563EB] font-bold text-lg">{dashboard.vacaciones.saldo || 0}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6B7280]">Sin información de vacaciones</p>
          )}
        </div>

        {/* Última Liquidación */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-[#D97706]" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827]">Última Liquidación</h3>
          </div>
          {dashboard?.ultimaLiquidacion ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Periodo</span>
                <span className="text-[#111827] font-medium">{formatPeriodo(dashboard.ultimaLiquidacion.periodo)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Total Haberes</span>
                <span className="text-[#111827] font-medium">{formatMoney(dashboard.ultimaLiquidacion.totalHaberes)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Líquido</span>
                <span className="text-[#059669] font-bold text-lg">{formatMoney(dashboard.ultimaLiquidacion.liquido)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6B7280]">Sin liquidaciones</p>
          )}
        </div>

        {/* Asistencia */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827]">Asistencia del Mes</h3>
          </div>
          {dashboard?.asistencia ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Días Trabajados</span>
                <span className="text-[#111827] font-medium">{dashboard.asistencia.diasTrabajados || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Horas Totales</span>
                <span className="text-[#111827] font-medium">{dashboard.asistencia.horasTotales || 0}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Hoy</span>
                <Badge variant={dashboard.asistencia.hoyMarcado ? 'success' : 'neutral'}>
                  {dashboard.asistencia.hoyMarcado ? 'Marcado' : 'Sin marcar'}
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6B7280]">Sin datos de asistencia</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
        <h3 className="text-lg font-semibold text-[#111827] mb-4">Acciones Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => handleMarcarAsistencia('ENTRADA')} loading={marking}>
            <LogIn className="w-4 h-4" />
            Marcar Entrada
          </Button>
          <Button variant="secondary" onClick={() => handleMarcarAsistencia('SALIDA')} loading={marking}>
            <LogOut className="w-4 h-4" />
            Marcar Salida
          </Button>
          <Button variant="secondary" onClick={() => navigate('/portal/vacaciones')}>
            <Palmtree className="w-4 h-4" />
            Solicitar Vacación
          </Button>
        </div>
      </div>
    </div>
  )
}
