import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, FileText } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatDate } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'

const TIPOS_ACOSO = [
  { value: 'SEXUAL', label: 'Acoso sexual' },
  { value: 'LABORAL', label: 'Acoso laboral' },
  { value: 'VIOLENCIA', label: 'Violencia en el trabajo' },
]

const ESTADOS_DENUNCIA = [
  { value: 'RECIBIDA', label: 'Recibida' },
  { value: 'EN_INVESTIGACION', label: 'En investigacion' },
  { value: 'RESUELTA', label: 'Resuelta' },
  { value: 'CERRADA', label: 'Cerrada' },
]

export default function KarinPage() {
  const [denuncias, setDenuncias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedDenuncia, setSelectedDenuncia] = useState(null)
  const [form, setForm] = useState({ tipoAcoso: '', descripcion: '', anonima: false })
  const [editForm, setEditForm] = useState({ estado: '' })
  const [saving, setSaving] = useState(false)

  const fetchDenuncias = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/karin/denuncias')
      if (res.success) setDenuncias(res.data)
      else setError(res.error || 'Error al cargar denuncias')
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDenuncias()
  }, [fetchDenuncias])

  const handleCreate = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.post('/api/karin/denuncias', form)
      if (res.success) {
        setModalOpen(false)
        setForm({ tipoAcoso: '', descripcion: '', anonima: false })
        await fetchDenuncias()
      } else {
        setError(res.error || 'Error al crear')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateEstado = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.put(`/api/karin/denuncias/${selectedDenuncia.id}`, editForm)
      if (res.success) {
        setEditOpen(false)
        await fetchDenuncias()
      } else {
        setError(res.error || 'Error al actualizar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleGenerarProtocolo = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.post('/api/karin/protocolo/generar')
      if (res.success) {
        alert('Protocolo generado correctamente')
      } else {
        setError(res.error || 'Error al generar protocolo')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (denuncia) => {
    setSelectedDenuncia(denuncia)
    setEditForm({ estado: denuncia.estado || '' })
    setEditOpen(true)
  }

  const estadoBadge = (estado) => {
    const map = { RECIBIDA: 'warning', EN_INVESTIGACION: 'info', RESUELTA: 'success', CERRADA: 'neutral' }
    return <Badge variant={map[estado] || 'neutral'}>{estado || '-'}</Badge>
  }

  const columns = [
    { key: 'id', label: 'ID', render: (val) => `#${val}` },
    {
      key: 'tipoAcoso',
      label: 'Tipo',
      render: (val) => TIPOS_ACOSO.find((t) => t.value === val)?.label || val,
    },
    {
      key: 'anonima',
      label: 'Anonima',
      render: (val) => <Badge variant={val ? 'info' : 'neutral'}>{val ? 'Si' : 'No'}</Badge>,
    },
    { key: 'estado', label: 'Estado', render: (val) => estadoBadge(val) },
    { key: 'createdAt', label: 'Fecha', render: (val) => formatDate(val) },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <button
          onClick={() => openEdit(row)}
          className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 transition-colors"
          title="Actualizar estado"
        >
          <Pencil className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Ley Karin</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerarProtocolo} loading={saving}>
            <FileText className="w-4 h-4" />
            Generar protocolo
          </Button>
          <Button onClick={() => { setForm({ tipoAcoso: '', descripcion: '', anonima: false }); setModalOpen(true) }}>
            <Plus className="w-4 h-4" />
            Nueva denuncia
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Table columns={columns} data={denuncias} loading={loading} emptyMessage="No hay denuncias registradas" />

      {/* New Denuncia Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nueva denuncia"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} loading={saving}>Crear</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Tipo de acoso"
            value={form.tipoAcoso}
            onChange={(e) => setForm({ ...form, tipoAcoso: e.target.value })}
            options={TIPOS_ACOSO}
          />
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Descripcion</label>
            <textarea
              rows={4}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.anonima}
              onChange={(e) => setForm({ ...form, anonima: e.target.checked })}
              className="w-4 h-4 text-[#2563EB] rounded border-[#E5E7EB] focus:ring-[#2563EB]"
            />
            <span className="text-sm text-[#111827]">Denuncia anonima</span>
          </label>
        </div>
      </Modal>

      {/* Update Estado Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Actualizar estado"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateEstado} loading={saving}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Estado"
            value={editForm.estado}
            onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
            options={ESTADOS_DENUNCIA}
          />
        </div>
      </Modal>
    </div>
  )
}
