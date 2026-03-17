import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil } from 'lucide-react'
import { get, post, put } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatDate } from '../../lib/formatters'

const tipoAcosoOptions = [
  { value: 'SEXUAL', label: 'Acoso Sexual' },
  { value: 'LABORAL', label: 'Acoso Laboral' },
  { value: 'VIOLENCIA', label: 'Violencia en el Trabajo' },
]

const estadoOptions = [
  { value: 'RECIBIDA', label: 'Recibida' },
  { value: 'EN_INVESTIGACION', label: 'En Investigación' },
  { value: 'RESUELTA', label: 'Resuelta' },
  { value: 'CERRADA', label: 'Cerrada' },
]

export default function KarinPage() {
  const [denuncias, setDenuncias] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editing, setEditing] = useState(null)
  const [createForm, setCreateForm] = useState({
    tipoAcoso: '', descripcion: '', anonima: false,
  })
  const [editForm, setEditForm] = useState({
    estado: '', medidasResguardo: '', resultado: '',
  })
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchDenuncias = useCallback(async () => {
    setLoading(true)
    try {
      const res = await get(`/api/karin/denuncias?page=${page}&limit=20`)
      if (res.success) {
        setDenuncias(res.data.denuncias || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchDenuncias()
  }, [fetchDenuncias])

  const handleCreate = async () => {
    setSaving(true)
    setModalError('')
    try {
      await post('/api/karin/denuncias', createForm)
      setShowCreate(false)
      setCreateForm({ tipoAcoso: '', descripcion: '', anonima: false })
      fetchDenuncias()
    } catch (err) {
      setModalError(err.message || 'Error al crear denuncia')
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (denuncia) => {
    setEditing(denuncia)
    setEditForm({
      estado: denuncia.estado || '',
      medidasResguardo: denuncia.medidasResguardo || '',
      resultado: denuncia.resultado || '',
    })
    setModalError('')
    setShowEdit(true)
  }

  const handleUpdate = async () => {
    setSaving(true)
    setModalError('')
    try {
      await put(`/api/karin/denuncias/${editing.id}`, editForm)
      setShowEdit(false)
      fetchDenuncias()
    } catch (err) {
      setModalError(err.message || 'Error al actualizar')
    } finally {
      setSaving(false)
    }
  }

  const estadoBadgeVariant = (estado) => {
    const map = {
      RECIBIDA: 'warning',
      EN_INVESTIGACION: 'info',
      RESUELTA: 'success',
      CERRADA: 'neutral',
    }
    return map[estado] || 'neutral'
  }

  const columns = [
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (val) => formatDate(val),
    },
    {
      key: 'tipoAcoso',
      label: 'Tipo',
      render: (val) => tipoAcosoOptions.find((t) => t.value === val)?.label || val,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => <Badge variant={estadoBadgeVariant(val)}>{val}</Badge>,
    },
    {
      key: 'anonima',
      label: 'Anónima',
      render: (val) => (
        <Badge variant={val ? 'info' : 'neutral'}>{val ? 'Sí' : 'No'}</Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <button
          onClick={() => openEdit(row)}
          className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#2563EB] transition-colors"
          title="Editar"
        >
          <Pencil className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Ley Karin</h1>
          <p className="text-sm text-[#6B7280]">Gestión de denuncias - Ley 21.643</p>
        </div>
        <Button onClick={() => { setModalError(''); setShowCreate(true) }}>
          <Plus className="w-4 h-4" />
          Nueva Denuncia
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <Table
        columns={columns}
        data={denuncias}
        loading={loading}
        emptyTitle="Sin denuncias"
        emptyDescription="No hay denuncias registradas."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Nueva Denuncia Ley Karin"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button onClick={handleCreate} loading={saving}>Registrar Denuncia</Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}
        <div className="space-y-4">
          <Select
            label="Tipo de Acoso"
            name="tipoAcoso"
            value={createForm.tipoAcoso}
            onChange={(e) => setCreateForm({ ...createForm, tipoAcoso: e.target.value })}
            options={tipoAcosoOptions}
            required
          />
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Descripción</label>
            <textarea
              value={createForm.descripcion}
              onChange={(e) => setCreateForm({ ...createForm, descripcion: e.target.value })}
              rows={4}
              required
              placeholder="Describe los hechos denunciados..."
              className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="anonima"
              checked={createForm.anonima}
              onChange={(e) => setCreateForm({ ...createForm, anonima: e.target.checked })}
              className="rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]"
            />
            <label htmlFor="anonima" className="text-sm text-[#111827]">Denuncia anónima</label>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Actualizar Denuncia"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancelar</Button>
            <Button onClick={handleUpdate} loading={saving}>Guardar Cambios</Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}
        {editing && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-[#6B7280] mb-1">Tipo de Acoso</p>
              <p className="text-sm font-medium text-[#111827]">
                {tipoAcosoOptions.find((t) => t.value === editing.tipoAcoso)?.label || editing.tipoAcoso}
              </p>
              <p className="text-xs text-[#6B7280] mt-3 mb-1">Descripción</p>
              <p className="text-sm text-[#111827]">{editing.descripcion}</p>
            </div>

            <Select
              label="Estado"
              name="estado"
              value={editForm.estado}
              onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
              options={estadoOptions}
            />
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Medidas de Resguardo</label>
              <textarea
                value={editForm.medidasResguardo}
                onChange={(e) => setEditForm({ ...editForm, medidasResguardo: e.target.value })}
                rows={3}
                placeholder="Medidas adoptadas para proteger al denunciante..."
                className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Resultado</label>
              <textarea
                value={editForm.resultado}
                onChange={(e) => setEditForm({ ...editForm, resultado: e.target.value })}
                rows={3}
                placeholder="Resultado de la investigación..."
                className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
