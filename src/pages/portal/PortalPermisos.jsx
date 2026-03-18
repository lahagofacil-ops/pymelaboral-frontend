import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { apiClient } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
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
  tipo: '',
  fecha: '',
  dias: '1',
  observacion: '',
}

export default function PortalPermisos() {
  const { user } = useAuth()
  const [permisos, setPermisos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPermisos()
  }, [])

  const fetchPermisos = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get('/api/permisos')
      if (result.success) {
        setPermisos(result.data.permisos || [])
      } else {
        setError(result.error || 'Error al cargar permisos')
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
      const payload = {
        ...form,
        dias: Number(form.dias),
        trabajadorId: user?.trabajadorId,
      }
      const result = await apiClient.post('/api/permisos', payload)
      if (result.success) {
        setShowModal(false)
        setForm(initialForm)
        fetchPermisos()
      } else {
        setError(result.error || 'Error al solicitar permiso')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const tipoOptions = TIPO_PERMISO

  const columns = [
    { header: 'Tipo', accessor: 'tipo' },
    {
      header: 'Fecha',
      accessor: (row) => formatDate(row.fecha),
    },
    { header: 'Días', accessor: 'dias' },
    {
      header: 'Observación',
      accessor: (row) => row.observacion || '—',
    },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={row.estado === 'APROBADO' ? 'success' : row.estado === 'RECHAZADO' ? 'danger' : 'warning'}>
          {row.estado}
        </Badge>
      ),
    },
  ]

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Mis Permisos</h1>
        <Button onClick={() => { setForm(initialForm); setShowModal(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Solicitar Permiso
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Table columns={columns} data={permisos} emptyMessage="No tienes solicitudes de permisos" />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Solicitar Permiso">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Tipo de Permiso" name="tipo" value={form.tipo} onChange={handleChange} required options={tipoOptions} />
          <Input label="Fecha" name="fecha" type="date" value={form.fecha} onChange={handleChange} required />
          <Input label="Días" name="dias" type="number" value={form.dias} onChange={handleChange} required />
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
