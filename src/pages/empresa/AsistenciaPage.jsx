import { useState, useEffect, useCallback } from 'react'
import { Clock, BarChart3 } from 'lucide-react'
import { get, post } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatDate } from '../../lib/formatters'

export default function AsistenciaPage() {
  const [asistencias, setAsistencias] = useState([])
  const [pagination, setPagination] = useState(null)
  const [trabajadores, setTrabajadores] = useState([])
  const [resumen, setResumen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterFecha, setFilterFecha] = useState('')
  const [filterTrabajador, setFilterTrabajador] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [showMarcar, setShowMarcar] = useState(false)
  const [showResumen, setShowResumen] = useState(false)
  const [marcarForm, setMarcarForm] = useState({
    trabajadorId: '', tipo: 'ENTRADA', fecha: '', hora: '',
  })
  const [marking, setMarking] = useState(false)
  const [modalError, setModalError] = useState('')
  const [resumenPeriodo, setResumenPeriodo] = useState('')

  const fetchAsistencia = useCallback(async () => {
    setLoading(true)
    try {
      let url = `/api/asistencia?page=${page}&limit=20`
      if (filterFecha) url += `&fecha=${filterFecha}`
      if (filterTrabajador) url += `&trabajadorId=${filterTrabajador}`
      const res = await get(url)
      if (res.success) {
        setAsistencias(res.data.asistencias || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filterFecha, filterTrabajador, page])

  useEffect(() => {
    fetchAsistencia()
  }, [fetchAsistencia])

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const res = await get('/api/trabajadores?limit=1000')
        if (res.success) setTrabajadores(res.data.trabajadores || [])
      } catch {}
    }
    fetchTrabajadores()
  }, [])

  const trabajadorOptions = trabajadores.map((t) => ({
    value: t.id,
    label: `${t.nombre} ${t.apellidoPaterno || ''}`.trim(),
  }))

  const handleMarcar = async () => {
    setMarking(true)
    setModalError('')
    try {
      await post('/api/asistencia/marcar', marcarForm)
      setShowMarcar(false)
      setMarcarForm({ trabajadorId: '', tipo: 'ENTRADA', fecha: '', hora: '' })
      fetchAsistencia()
    } catch (err) {
      setModalError(err.message || 'Error al marcar asistencia')
    } finally {
      setMarking(false)
    }
  }

  const handleFetchResumen = async () => {
    if (!resumenPeriodo) return
    try {
      const [year, month] = resumenPeriodo.split('-')
      const res = await get(`/api/asistencia/resumen?year=${year}&month=${month}`)
      if (res.success) setResumen(res.data)
    } catch (err) {
      setError(err.message)
    }
  }

  const columns = [
    {
      key: 'trabajador',
      label: 'Trabajador',
      render: (_, row) => {
        const t = row.trabajador
        return t ? `${t.nombre} ${t.apellidoPaterno || ''}`.trim() : '-'
      },
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (val) => formatDate(val),
    },
    { key: 'entrada', label: 'Entrada' },
    { key: 'salida', label: 'Salida' },
    {
      key: 'horasOrdinarias',
      label: 'Horas Ordinarias',
      render: (val) => val != null ? `${val}h` : '-',
    },
    {
      key: 'horasExtra',
      label: 'Horas Extra',
      render: (val) => val ? `${val}h` : '-',
    },
    {
      key: 'tipoDia',
      label: 'Tipo Día',
      render: (val) => <Badge variant={val === 'NORMAL' ? 'neutral' : val === 'FERIADO' ? 'warning' : 'info'}>{val || '-'}</Badge>,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Asistencia</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setShowResumen(true)}>
            <BarChart3 className="w-4 h-4" />
            Resumen Mensual
          </Button>
          <Button onClick={() => { setModalError(''); setShowMarcar(true) }}>
            <Clock className="w-4 h-4" />
            Marcar Asistencia
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          name="filterFecha"
          type="date"
          value={filterFecha}
          onChange={(e) => { setFilterFecha(e.target.value); setPage(1) }}
          className="w-44"
        />
        <Select
          name="filterTrabajador"
          value={filterTrabajador}
          onChange={(e) => { setFilterTrabajador(e.target.value); setPage(1) }}
          options={trabajadorOptions}
          placeholder="Trabajador"
          className="w-56"
        />
      </div>

      <Table
        columns={columns}
        data={asistencias}
        loading={loading}
        emptyTitle="Sin registros"
        emptyDescription="No hay registros de asistencia."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Marcar Modal */}
      <Modal
        isOpen={showMarcar}
        onClose={() => setShowMarcar(false)}
        title="Marcar Asistencia"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowMarcar(false)}>Cancelar</Button>
            <Button onClick={handleMarcar} loading={marking}>Marcar</Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}
        <div className="space-y-4">
          <Select
            label="Trabajador"
            name="trabajadorId"
            value={marcarForm.trabajadorId}
            onChange={(e) => setMarcarForm({ ...marcarForm, trabajadorId: e.target.value })}
            options={trabajadorOptions}
            required
          />
          <Select
            label="Tipo"
            name="tipo"
            value={marcarForm.tipo}
            onChange={(e) => setMarcarForm({ ...marcarForm, tipo: e.target.value })}
            options={[
              { value: 'ENTRADA', label: 'Entrada' },
              { value: 'SALIDA', label: 'Salida' },
            ]}
            required
          />
          <Input
            label="Fecha"
            name="fecha"
            type="date"
            value={marcarForm.fecha}
            onChange={(e) => setMarcarForm({ ...marcarForm, fecha: e.target.value })}
            required
          />
          <Input
            label="Hora"
            name="hora"
            type="time"
            value={marcarForm.hora}
            onChange={(e) => setMarcarForm({ ...marcarForm, hora: e.target.value })}
            required
          />
        </div>
      </Modal>

      {/* Resumen Modal */}
      <Modal
        isOpen={showResumen}
        onClose={() => setShowResumen(false)}
        title="Resumen Mensual de Asistencia"
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setShowResumen(false)}>Cerrar</Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <Input
              label="Periodo"
              name="resumenPeriodo"
              type="month"
              value={resumenPeriodo}
              onChange={(e) => setResumenPeriodo(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleFetchResumen}>Consultar</Button>
          </div>

          {resumen && Array.isArray(resumen) && resumen.length > 0 && (
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280]">Trabajador</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280]">Días Trabajados</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280]">Horas Totales</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-[#6B7280]">Horas Extra</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.map((r, i) => (
                    <tr key={i} className="border-b border-[#E5E7EB]">
                      <td className="px-4 py-2 text-sm text-[#111827]">{r.trabajador || '-'}</td>
                      <td className="px-4 py-2 text-sm text-[#111827]">{r.diasTrabajados || 0}</td>
                      <td className="px-4 py-2 text-sm text-[#111827]">{r.horasTotales || 0}h</td>
                      <td className="px-4 py-2 text-sm text-[#111827]">{r.horasExtra || 0}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {resumen && (!Array.isArray(resumen) || resumen.length === 0) && (
            <p className="text-sm text-[#6B7280] text-center py-4">Sin datos para el periodo seleccionado.</p>
          )}
        </div>
      </Modal>
    </div>
  )
}
