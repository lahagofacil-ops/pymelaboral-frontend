import { useState, useEffect, useCallback } from 'react'
import { LogIn, LogOut, Clock } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatDate } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'

export default function PortalAsistencia() {
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [marking, setMarking] = useState(false)

  const fetchAsistencia = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/asistencia')
      if (res.success) {
        setRegistros(res.data)
      } else {
        setError(res.error || 'Error al cargar asistencia')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAsistencia()
  }, [fetchAsistencia])

  const handleMarcar = async (tipo) => {
    setMarking(true)
    setError('')
    try {
      const res = await apiClient.post('/api/asistencia/marcar', { tipo })
      if (res.success) {
        await fetchAsistencia()
      } else {
        setError(res.error || 'Error al marcar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setMarking(false)
    }
  }

  const columns = [
    { key: 'fecha', label: 'Fecha', render: (val) => formatDate(val) },
    { key: 'entrada', label: 'Entrada' },
    { key: 'salida', label: 'Salida' },
    { key: 'horasOrdinarias', label: 'Hrs. Ordinarias' },
    { key: 'horasExtra', label: 'Hrs. Extra' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Mi Asistencia</h1>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
        <h2 className="text-base font-semibold text-[#111827] mb-4">Marcar asistencia</h2>
        <div className="flex items-center gap-3">
          <Button onClick={() => handleMarcar('ENTRADA')} loading={marking}>
            <LogIn className="w-4 h-4" />
            Marcar entrada
          </Button>
          <Button variant="outline" onClick={() => handleMarcar('SALIDA')} loading={marking}>
            <LogOut className="w-4 h-4" />
            Marcar salida
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-[#111827] mb-3">Registros recientes</h2>
        <Table columns={columns} data={registros} loading={loading} emptyMessage="Sin registros de asistencia" />
      </div>
    </div>
  )
}
