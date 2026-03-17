import { useState, useEffect, useCallback } from 'react'
import { Clock, BarChart3, LogIn, LogOut } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatDate } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Card from '../../components/ui/Card'

export default function AsistenciaPage() {
  const [registros, setRegistros] = useState([])
  const [resumen, setResumen] = useState(null)
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0])
  const [modalOpen, setModalOpen] = useState(false)
  const [markForm, setMarkForm] = useState({ trabajadorId: '', tipo: 'ENTRADA' })
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [aRes, rRes, tRes] = await Promise.all([
        apiClient.get(`/api/asistencia?fecha=${fecha}`),
        apiClient.get(`/api/asistencia/resumen?fecha=${fecha}`),
        apiClient.get('/api/trabajadores'),
      ])
      if (aRes.success) setRegistros(aRes.data)
      if (rRes.success) setResumen(rRes.data)
      if (tRes.success) setTrabajadores(tRes.data)
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [fecha])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleMarcar = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.post('/api/asistencia/marcar', {
        trabajadorId: markForm.trabajadorId,
        tipo: markForm.tipo,
      })
      if (res.success) {
        setModalOpen(false)
        await fetchData()
      } else {
        setError(res.error || 'Error al marcar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      key: 'trabajador',
      label: 'Trabajador',
      render: (val) => val ? `${val.nombre} ${val.apellidoPaterno}` : '-',
    },
    { key: 'fecha', label: 'Fecha', render: (val) => formatDate(val) },
    { key: 'entrada', label: 'Entrada' },
    { key: 'salida', label: 'Salida' },
    { key: 'horasOrdinarias', label: 'Hrs. Ordinarias' },
    { key: 'horasExtra', label: 'Hrs. Extra' },
    {
      key: 'tipoDia',
      label: 'Tipo Dia',
      render: (val) => (
        <Badge variant={val === 'NORMAL' ? 'neutral' : val === 'FERIADO' ? 'warning' : 'info'}>
          {val || 'Normal'}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Asistencia</h1>
        <Button onClick={() => { setMarkForm({ trabajadorId: '', tipo: 'ENTRADA' }); setModalOpen(true) }}>
          <Clock className="w-4 h-4" />
          Marcar asistencia
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="flex items-center gap-3">
        <Input
          label="Fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-48"
        />
      </div>

      {resumen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-[#6B7280]">Presentes</p>
            <p className="text-lg font-bold text-[#111827]">{resumen.presentes ?? 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-[#6B7280]">Ausentes</p>
            <p className="text-lg font-bold text-[#111827]">{resumen.ausentes ?? 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-[#6B7280]">Horas extra</p>
            <p className="text-lg font-bold text-[#111827]">{resumen.horasExtra ?? 0}</p>
          </Card>
        </div>
      )}

      <Table columns={columns} data={registros} loading={loading} emptyMessage="Sin registros para esta fecha" />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Marcar asistencia"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleMarcar} loading={saving}>Marcar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Trabajador"
            value={markForm.trabajadorId}
            onChange={(e) => setMarkForm({ ...markForm, trabajadorId: e.target.value })}
            options={trabajadores.map((t) => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))}
          />
          <Select
            label="Tipo"
            value={markForm.tipo}
            onChange={(e) => setMarkForm({ ...markForm, tipo: e.target.value })}
            options={[{ value: 'ENTRADA', label: 'Entrada' }, { value: 'SALIDA', label: 'Salida' }]}
          />
        </div>
      </Modal>
    </div>
  )
}
