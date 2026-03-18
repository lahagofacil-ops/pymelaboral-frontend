import { useState, useEffect } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatDate } from '../../lib/utils'
import { TIPO_PERMISO } from '../../lib/constants'
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
  tipo: '',
  fecha: '',
  dias: '1',
  conGoce: true,
  observacion: '',
}

export default function PermisosPage() {
  const [permisos, setPermisos] = useState([])
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
      const [permRes, trabRes] = await Promise.all([
        apiClient.get('/api/permisos'),
        apiClient.get('/api/trabajadores'),
      ])
      if (permRes.success) {
        setPermisos(permRes.data.permisos || [])
      } else {
        setError(permRes.error || 'Error al cargar permisos')
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
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      const payload = { ...form, dias: Number(form.dias) }
      const result = await apiClient.post('/api/permisos', payload)
      if (result.success) {
        setShowModal(false)
        setForm(initialForm)
        fetchData()
      } else {
        setError(result.error || 'Error al crear permiso')
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
      const result = await apiClient.put(`/api/permisos/${id}`, { estado })
      if (result.success) {
        fetchData()
      } else {
        setError(result.error || 'Error al actualizar estado')
      }
    } catch (err) {
      setError('Error de conexión')
    }
  }

  const tipoOptions = TIPO_PERMISO

  const columns = [
    {
      header: 'Trabajador',
      accessor: (row) => row.trabajador ? `${row.trabajador.nombre} ${row.trabajador.apellidoPaterno}` : '—',
    },
    { header: 'Tipo', accessor: 'tipo' },
    {
      header: 'Fecha',
      accessor: (row) => formatDate(row.fecha),
    },
    { header: 'Días', accessor: 'dias' },
    {
      header: 'Con Goce',
      accessor: (row) => row.conGoce ? 'Sí' : 'No',
    },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={row.estado === 'APROBADO' ? 'success' : row.estado === 'RECHAZADO' ? 'danger' : 'warning'}>
          {row.estado}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      accessor: (row) =>
        row.estado === 'PENDIENTE' ? (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => handleUpdateEstado(row.id, 'APROBADO')}>
              <Check className="w-4 h-4 text-[#059669]" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleUpdateEstado(row.id, 'RECHAZADO')}>
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
        <h1 className="text-2xl font-bold text-[#111827]">Permisos</h1>
        <Button onClick={() => { setForm(initialForm); setShowModal(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Permiso
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Table columns={columns} data={permisos} emptyMessage="No hay permisos registrados" />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo Permiso">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Trabajador"
            name="trabajadorId"
            value={form.trabajadorId}
            onChange={handleChange}
            required
            options={trabajadores.map((t) => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))}
          />
          <Select label="Tipo" name="tipo" value={form.tipo} onChange={handleChange} required options={tipoOptions} />
          <Input label="Fecha" name="fecha" type="date" value={form.fecha} onChange={handleChange} required />
          <Input label="Días" name="dias" type="number" value={form.dias} onChange={handleChange} required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="conGoce" name="conGoce" checked={form.conGoce} onChange={handleChange} className="rounded border-[#E5E7EB]" />
            <label htmlFor="conGoce" className="text-sm text-[#111827]">Con goce de sueldo</label>
          </div>
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
