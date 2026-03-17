import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatDate } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'

const TIPOS_PERMISO = [
  { value: 'MEDICO', label: 'Permiso medico' },
  { value: 'PERSONAL', label: 'Permiso personal' },
  { value: 'LEGAL', label: 'Permiso legal' },
  { value: 'MATRIMONIO', label: 'Matrimonio' },
  { value: 'NACIMIENTO', label: 'Nacimiento de hijo' },
  { value: 'FALLECIMIENTO', label: 'Fallecimiento familiar' },
  { value: 'OTRO', label: 'Otro' },
]

export default function PortalPermisos() {
  const [permisos, setPermisos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    tipo: '', fecha: '', dias: '1', conGoce: true, observacion: '',
  })
  const [saving, setSaving] = useState(false)

  const fetchPermisos = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/permisos')
      if (res.success) {
        setPermisos(res.data)
      } else {
        setError(res.error || 'Error al cargar permisos')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPermisos()
  }, [fetchPermisos])

  const handleSolicitar = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.post('/api/permisos', {
        ...form,
        dias: Number(form.dias),
      })
      if (res.success) {
        setModalOpen(false)
        setForm({ tipo: '', fecha: '', dias: '1', conGoce: true, observacion: '' })
        await fetchPermisos()
      } else {
        setError(res.error || 'Error al solicitar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const estadoBadge = (estado) => {
    const map = { APROBADO: 'success', PENDIENTE: 'warning', RECHAZADO: 'danger' }
    return <Badge variant={map[estado] || 'neutral'}>{estado || '-'}</Badge>
  }

  const columns = [
    {
      key: 'tipo',
      label: 'Tipo',
      render: (val) => TIPOS_PERMISO.find((t) => t.value === val)?.label || val,
    },
    { key: 'fecha', label: 'Fecha', render: (val) => formatDate(val) },
    { key: 'dias', label: 'Dias' },
    {
      key: 'conGoce',
      label: 'Con goce',
      render: (val) => <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Si' : 'No'}</Badge>,
    },
    { key: 'estado', label: 'Estado', render: (val) => estadoBadge(val) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Mis Permisos</h1>
        <Button onClick={() => {
          setForm({ tipo: '', fecha: '', dias: '1', conGoce: true, observacion: '' })
          setModalOpen(true)
        }}>
          <Plus className="w-4 h-4" />
          Solicitar permiso
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Table columns={columns} data={permisos} loading={loading} emptyMessage="No tienes permisos" />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Solicitar permiso"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSolicitar} loading={saving}>Solicitar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Tipo de permiso"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            options={TIPOS_PERMISO}
          />
          <Input label="Fecha" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
          <Input label="Dias" type="number" min="1" value={form.dias} onChange={(e) => setForm({ ...form, dias: e.target.value })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.conGoce}
              onChange={(e) => setForm({ ...form, conGoce: e.target.checked })}
              className="w-4 h-4 text-[#2563EB] rounded border-[#E5E7EB] focus:ring-[#2563EB]"
            />
            <span className="text-sm text-[#111827]">Con goce de sueldo</span>
          </label>
          <Input label="Observacion" value={form.observacion} onChange={(e) => setForm({ ...form, observacion: e.target.value })} />
        </div>
      </Modal>
    </div>
  )
}
