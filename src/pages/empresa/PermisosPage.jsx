import { useState, useEffect, useCallback } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { get, post, put } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatDate } from '../../lib/formatters'

const tipoPermisoOptions = [
  { value: 'ADMINISTRATIVO', label: 'Administrativo' },
  { value: 'MEDICO', label: 'Médico' },
  { value: 'PATERNAL', label: 'Paternal' },
  { value: 'MATRIMONIO', label: 'Matrimonio' },
  { value: 'FALLECIMIENTO', label: 'Fallecimiento familiar' },
  { value: 'SINDICAL', label: 'Sindical' },
  { value: 'OTRO', label: 'Otro' },
]

const estadoFilterOptions = [
  { value: '', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'APROBADO', label: 'Aprobado' },
  { value: 'RECHAZADO', label: 'Rechazado' },
]

const tipoFilterOptions = [
  { value: '', label: 'Todos' },
  ...tipoPermisoOptions,
]

export default function PermisosPage() {
  const [permisos, setPermisos] = useState([])
  const [pagination, setPagination] = useState(null)
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({
    trabajadorId: '', tipo: '', fecha: '', dias: '1', conGoce: true, observacion: '',
  })
  const [creating, setCreating] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchPermisos = useCallback(async () => {
    setLoading(true)
    try {
      let url = `/api/permisos?page=${page}&limit=20`
      if (filterTipo) url += `&tipo=${filterTipo}`
      if (filterEstado) url += `&estado=${filterEstado}`
      const res = await get(url)
      if (res.success) {
        setPermisos(res.data.permisos || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filterTipo, filterEstado, page])

  useEffect(() => {
    fetchPermisos()
  }, [fetchPermisos])

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

  const handleCreate = async () => {
    setCreating(true)
    setModalError('')
    try {
      const body = {
        ...createForm,
        dias: parseInt(createForm.dias) || 1,
      }
      await post('/api/permisos', body)
      setShowCreate(false)
      setCreateForm({ trabajadorId: '', tipo: '', fecha: '', dias: '1', conGoce: true, observacion: '' })
      fetchPermisos()
    } catch (err) {
      setModalError(err.message || 'Error al crear permiso')
    } finally {
      setCreating(false)
    }
  }

  const handleApproveReject = async (id, approved) => {
    try {
      await put(`/api/permisos/${id}/aprobar`, { aprobado: approved })
      fetchPermisos()
    } catch (err) {
      setError(err.message)
    }
  }

  const estadoBadgeVariant = (estado) => {
    const map = { PENDIENTE: 'warning', APROBADO: 'success', RECHAZADO: 'danger' }
    return map[estado] || 'neutral'
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
      key: 'tipo',
      label: 'Tipo',
      render: (val) => tipoPermisoOptions.find((t) => t.value === val)?.label || val,
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (val) => formatDate(val),
    },
    { key: 'dias', label: 'Días' },
    {
      key: 'conGoce',
      label: 'Con Goce',
      render: (val) => (
        <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Sí' : 'No'}</Badge>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => <Badge variant={estadoBadgeVariant(val)}>{val}</Badge>,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        row.estado === 'PENDIENTE' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApproveReject(row.id, true)}
              className="p-1.5 rounded-lg text-[#059669] hover:bg-green-50 transition-colors"
              title="Aprobar"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleApproveReject(row.id, false)}
              className="p-1.5 rounded-lg text-[#DC2626] hover:bg-red-50 transition-colors"
              title="Rechazar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : null
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Permisos</h1>
        <Button onClick={() => { setModalError(''); setShowCreate(true) }}>
          <Plus className="w-4 h-4" />
          Nuevo Permiso
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Select
          name="filterTipo"
          value={filterTipo}
          onChange={(e) => { setFilterTipo(e.target.value); setPage(1) }}
          options={tipoFilterOptions}
          placeholder="Tipo"
          className="w-48"
        />
        <Select
          name="filterEstado"
          value={filterEstado}
          onChange={(e) => { setFilterEstado(e.target.value); setPage(1) }}
          options={estadoFilterOptions}
          placeholder="Estado"
          className="w-44"
        />
      </div>

      <Table
        columns={columns}
        data={permisos}
        loading={loading}
        emptyTitle="Sin permisos"
        emptyDescription="No hay permisos registrados."
        pagination={pagination}
        onPageChange={setPage}
      />

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Nuevo Permiso"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button onClick={handleCreate} loading={creating}>Crear Permiso</Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}
        <div className="space-y-4">
          <Select
            label="Trabajador"
            name="trabajadorId"
            value={createForm.trabajadorId}
            onChange={(e) => setCreateForm({ ...createForm, trabajadorId: e.target.value })}
            options={trabajadorOptions}
            required
          />
          <Select
            label="Tipo de Permiso"
            name="tipo"
            value={createForm.tipo}
            onChange={(e) => setCreateForm({ ...createForm, tipo: e.target.value })}
            options={tipoPermisoOptions}
            required
          />
          <Input
            label="Fecha"
            name="fecha"
            type="date"
            value={createForm.fecha}
            onChange={(e) => setCreateForm({ ...createForm, fecha: e.target.value })}
            required
          />
          <Input
            label="Días"
            name="dias"
            type="number"
            min="1"
            value={createForm.dias}
            onChange={(e) => setCreateForm({ ...createForm, dias: e.target.value })}
            required
          />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="conGoce"
              checked={createForm.conGoce}
              onChange={(e) => setCreateForm({ ...createForm, conGoce: e.target.checked })}
              className="rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]"
            />
            <label htmlFor="conGoce" className="text-sm text-[#111827]">Con goce de sueldo</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Observación</label>
            <textarea
              value={createForm.observacion}
              onChange={(e) => setCreateForm({ ...createForm, observacion: e.target.value })}
              rows={3}
              className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
