import { useState, useEffect } from 'react'
import { Clock, LogIn, LogOut } from 'lucide-react'
import { apiClient } from '../../api/client'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

export default function AsistenciaPage() {
  const [registros, setRegistros] = useState([])
  const [resumen, setResumen] = useState([])
  const [trabajadores, setTrabajadores] = useState([])
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [selectedTrabajador, setSelectedTrabajador] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    fetchTrabajadores()
  }, [])

  useEffect(() => {
    if (fecha) {
      fetchAsistencia()
      fetchResumen()
    }
  }, [fecha])

  const fetchTrabajadores = async () => {
    try {
      const result = await apiClient.get('/api/trabajadores')
      if (result.success) {
        const list = result.data?.trabajadores || result.data
        setTrabajadores(Array.isArray(list) ? list : [])
      }
    } catch (err) {
      // silent
    }
  }

  const fetchAsistencia = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get(`/api/asistencia?fecha=${fecha}`)
      if (result.success) {
        setRegistros(result.data.registros || [])
      } else {
        setError(result.error || 'Error al cargar asistencia')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const fetchResumen = async () => {
    try {
      const result = await apiClient.get(`/api/asistencia/resumen?fecha=${fecha}`)
      if (result.success) {
        setResumen(Array.isArray(result.data.resumen) ? result.data.resumen : [])
      }
    } catch (err) {
      // silent
    }
  }

  const handleMarcar = async (tipo) => {
    if (!selectedTrabajador) {
      setError('Seleccione un trabajador')
      return
    }
    try {
      setMarking(true)
      setError(null)
      const result = await apiClient.post('/api/asistencia/marcar', {
        trabajadorId: selectedTrabajador,
        tipo,
      })
      if (result.success) {
        fetchAsistencia()
        fetchResumen()
      } else {
        setError(result.error || 'Error al marcar asistencia')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setMarking(false)
    }
  }

  const formatTime = (datetime) => {
    if (!datetime) return '—'
    const date = new Date(datetime)
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
  }

  const columns = [
    {
      header: 'Trabajador',
      accessor: (row) => row.trabajador ? `${row.trabajador.nombre} ${row.trabajador.apellidoPaterno}` : '—',
    },
    { header: 'Fecha', accessor: 'fecha' },
    {
      header: 'Entrada',
      accessor: (row) => formatTime(row.entrada),
    },
    {
      header: 'Salida',
      accessor: (row) => formatTime(row.salida),
    },
    { header: 'Horas Ordinarias', accessor: 'horasOrdinarias' },
    { header: 'Horas Extra', accessor: 'horasExtra' },
    {
      header: 'Tipo Día',
      accessor: (row) => (
        <Badge variant={row.tipoDia === 'NORMAL' ? 'default' : row.tipoDia === 'FERIADO' ? 'warning' : 'info'}>
          {row.tipoDia}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#111827]">Asistencia</h1>

      {error && <Alert type="error">{error}</Alert>}

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <Input
            label="Fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-48"
          />
          <Select
            label="Trabajador"
            name="trabajador"
            value={selectedTrabajador}
            onChange={(e) => setSelectedTrabajador(e.target.value)}
            options={trabajadores.map((t) => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))}
            placeholder="Seleccionar trabajador"
            className="w-64"
          />
          <Button onClick={() => handleMarcar('ENTRADA')} loading={marking} variant="outline">
            <LogIn className="w-4 h-4 mr-2" />
            Marcar Entrada
          </Button>
          <Button onClick={() => handleMarcar('SALIDA')} loading={marking} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Marcar Salida
          </Button>
        </div>
      </Card>

      {resumen.length > 0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-[#111827] mb-3">Resumen del Periodo</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="text-left py-2 text-[#6B7280]">Trabajador</th>
                  <th className="text-right py-2 text-[#6B7280]">Días Trabajados</th>
                  <th className="text-right py-2 text-[#6B7280]">Horas Ordinarias</th>
                  <th className="text-right py-2 text-[#6B7280]">Horas Extra</th>
                </tr>
              </thead>
              <tbody>
                {resumen.map((item, i) => (
                  <tr key={i} className="border-b border-[#E5E7EB]">
                    <td className="py-2 text-[#111827]">
                      {item.trabajador?.nombre} {item.trabajador?.apellidoPaterno}
                    </td>
                    <td className="py-2 text-right text-[#111827]">{item.diasTrabajados}</td>
                    <td className="py-2 text-right text-[#111827]">{item.horasOrdinarias}</td>
                    <td className="py-2 text-right text-[#111827]">{item.horasExtra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <Table columns={columns} data={registros} emptyMessage="No hay registros de asistencia para esta fecha" />
      )}
    </div>
  )
}
