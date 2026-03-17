import { useState, useEffect, useCallback } from 'react'
import { LogIn, LogOut, Clock } from 'lucide-react'
import { get, post } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import { formatDate } from '../../lib/formatters'

export default function MiAsistencia() {
  const [asistencias, setAsistencias] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [marking, setMarking] = useState(false)
  const [todayStatus, setTodayStatus] = useState(null)

  const fetchAsistencia = useCallback(async () => {
    setLoading(true)
    try {
      const res = await get(`/api/asistencia?page=${page}&limit=20`)
      if (res.success) {
        setAsistencias(res.data.asistencias || [])
        setPagination(res.data.pagination || null)

        const today = new Date().toISOString().slice(0, 10)
        const todayRecord = (res.data.asistencias || []).find(
          (a) => a.fecha?.slice(0, 10) === today
        )
        setTodayStatus(todayRecord || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchAsistencia()
  }, [fetchAsistencia])

  const handleMarcar = async (tipo) => {
    setMarking(true)
    setError('')
    setSuccess('')
    try {
      const now = new Date()
      const fecha = now.toISOString().slice(0, 10)
      const hora = now.toTimeString().slice(0, 5)
      await post('/api/asistencia/marcar', { tipo, fecha, hora })
      setSuccess(`${tipo === 'ENTRADA' ? 'Entrada' : 'Salida'} marcada correctamente a las ${hora}`)
      fetchAsistencia()
    } catch (err) {
      setError(err.message || 'Error al marcar asistencia')
    } finally {
      setMarking(false)
    }
  }

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (val) => formatDate(val),
    },
    { key: 'entrada', label: 'Entrada' },
    { key: 'salida', label: 'Salida' },
    {
      key: 'horasOrdinarias',
      label: 'Horas',
      render: (val) => val != null ? `${val}h` : '-',
    },
    {
      key: 'horasExtra',
      label: 'Horas Extra',
      render: (val) => val ? `${val}h` : '-',
    },
    {
      key: 'tipoDia',
      label: 'Tipo',
      render: (val) => <Badge variant={val === 'NORMAL' ? 'neutral' : 'warning'}>{val || '-'}</Badge>,
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Mi Asistencia</h1>
        <p className="text-sm text-[#6B7280]">Registro de asistencia</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message={success} closable className="mb-4" />}

      {/* Today status + mark buttons */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-lg font-semibold text-[#111827]">Hoy</h3>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            {todayStatus ? (
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-[#6B7280]">Entrada: </span>
                  <span className="font-medium text-[#111827]">{todayStatus.entrada || 'Sin marcar'}</span>
                </div>
                <div>
                  <span className="text-[#6B7280]">Salida: </span>
                  <span className="font-medium text-[#111827]">{todayStatus.salida || 'Sin marcar'}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#6B7280]">No has marcado asistencia hoy</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => handleMarcar('ENTRADA')} loading={marking}>
              <LogIn className="w-4 h-4" />
              Marcar Entrada
            </Button>
            <Button variant="secondary" onClick={() => handleMarcar('SALIDA')} loading={marking}>
              <LogOut className="w-4 h-4" />
              Marcar Salida
            </Button>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-[#111827] mb-4">Historial del Mes</h3>
      <Table
        columns={columns}
        data={asistencias}
        loading={loading}
        emptyTitle="Sin registros"
        emptyDescription="No tienes registros de asistencia."
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  )
}
