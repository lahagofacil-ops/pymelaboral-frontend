import { useState, useEffect } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatDate } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

const initialForm = {
  trabajadorId: '',
  fechaDesde: '',
  fechaHasta: '',
  diasHabiles: '',
  observacion: '',
}

export default function VacacionesPage() {
  const [vacaciones, setVacaciones] = useState([])
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [vacRes, trabRes] = await Promise.all([
        apiClient.get('/api/vacaciones'),
        apiClient.get('/api/trabajadores'),
      ])
      if (vacRes.success) {
        setVacaciones(vacRes.data.vacaciones || [])
      } else {
        setError(vacRes.error || 'Error al cargar vacaciones')
      }
      if (trabRes.success) {
        setTrabajadores(Array.isArray(trabRes.data) ? trabRes.data : [])
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      const payload = { ...form, diasHabiles: Number(form.diasHabiles) }
      const result = await apiClient.post('/api/vacaciones', payload)
      if (result.success) {
        setShowModal(false)
        setForm(initialForm)
        fetchData()
      } else {
        setError(result.error || 'Error al crear solicitud')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateEstado = async (id, estado) => {
    try {
      setError(null)
      const result = await apiClient.put(`/api/vacaciones/${id}`, { estado })
      if (result.success) {
        fetchData()
      } else {
        setError(result.error || 'Error al actualizar estado')
      }
    } catch (err) {
      setError('Error de conexión')
    }
  }

  const columns = [
    {
      header: 'Trabajador',
      accessor: (row) => row.trabajador ? `${row.trabajador.nombre} ${row.trabajador.apellidoPaterno}` : '—',
    },
    {
      header: 'Desde',
      accessor: (row) => formatDate(row.fechaDesde),
    },
    {
      header: 'Hasta',
      accessor: (row) => formatDate(row.fechaHasta),
    },
    { header: 'Días Hábiles', accessor: 'diasHabiles' },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={row.estado === 'APROBADA' ? 'success' : row.estado === 'RECHAZADA' ? 'danger' : 'warning'}>
          {row.estado}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      accessor: (row) =>
        row.estado === 'PENDIENTE' ? (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => handleUpdateEstado(row.id, 'APROBADA')}>
              <Check className="w-4 h-4 text-[#059669]" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleUpdateEstado(row.id, 'RECHAZADA')}>
              <X className="w-4 h-4 text-[#DC2626]" />
            </Button>
          </div>
        ) : null,
    },
  ]

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Vacaciones</h1>
        <Button onClick={() => { setForm(initialForm); setShowModal(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Solicitud
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Table columns={columns} data={vacaciones} emptyMessage="No hay solicitudes de vacaciones" />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nueva Solicitud de Vacaciones">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Trabajador"
            name="trabajadorId"
            value={form.trabajadorId}
            onChange={handleChange}
            required
            options={trabajadores.map((t) => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))}
          />
          <Input label="Fecha Desde" name="fechaDesde" type="date" value={form.fechaDesde} onChange={handleChange} required />
          <Input label="Fecha Hasta" name="fechaHasta" type="date" value={form.fechaHasta} onChange={handleChange} required />
          <Input label="Días Hábiles" name="diasHabiles" type="number" value={form.diasHabiles} onChange={handleChange} required />
          <Input label="Observación" name="observacion" value={form.observacion} onChange={handleChange} />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Enviar Solicitud</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
