import { useState, useEffect, useCallback } from 'react'
import { Plus, Check, X, Info } from 'lucide-react'
import { get, post, put } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatDate } from '../../lib/formatters'

const estadoOptions = [
  { value: '', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'APROBADO', label: 'Aprobado' },
  { value: 'RECHAZADO', label: 'Rechazado' },
]

export default function VacacionesPage() {
  const [vacaciones, setVacaciones] = useState([])
  const [pagination, setPagination] = useState(null)
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterEstado, setFilterEstado] = useState('')
  const [filterTrabajador, setFilterTrabajador] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [saldo, setSaldo] = useState(null)
  const [saldoTrabajadorId, setSaldoTrabajadorId] = useState('')
  const [createForm, setCreateForm] = useState({
    trabajadorId: '', fechaDesde: '', fechaHasta: '', diasHabiles: '',
  })
  const [creating, setCreating] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchVacaciones = useCallback(async () => {
    setLoading(true)
    try {
      let url = `/api/vacaciones?page=${page}&limit=20`
      if (filterEstado) url += `&estado=${filterEstado}`
      if (filterTrabajador) url += `&trabajadorId=${filterTrabajador}`
      const res = await get(url)
      if (res.success) {
        setVacaciones(res.data.vacaciones || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filterEstado, filterTrabajador, page])

  useEffect(() => {
    fetchVacaciones()
  }, [fetchVacaciones])

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

  const fetchSaldo = async (trabId) => {
    if (!trabId) { setSaldo(null); return }
    try {
      const res = await get(`/api/vacaciones/saldo/${trabId}`)
      if (res.success) setSaldo(res.data)
    } catch {
      setSaldo(null)
    }
  }

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target
    const updated = { ...createForm, [name]: value }
    setCreateForm(updated)
    if (name === 'trabajadorId') {
      setSaldoTrabajadorId(value)
      fetchSaldo(value)
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    setModalError('')
    try {
      const body = {
        ...createForm,
        diasHabiles: parseInt(createForm.diasHabiles) || 0,
      }
      await post('/api/vacaciones', body)
      setShowCreate(false)
      setCreateForm({ trabajadorId: '', fechaDesde: '', fechaHasta: '', diasHabiles: '' })
      setSaldo(null)
      fetchVacaciones()
    } catch (err) {
      setModalError(err.message || 'Error al crear solicitud')
    } finally {
      setCreating(false)
    }
  }

  const handleApproveReject = async (id, approved) => {
    try {
      await put(`/api/vacaciones/${id}/aprobar`, { aprobado: approved })
      fetchVacaciones()
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
      key: 'fechaDesde',
      label: 'Desde',
      render: (val) => formatDate(val),
    },
    {
      key: 'fechaHasta',
      label: 'Hasta',
      render: (val) => formatDate(val),
    },
    {
      key: 'diasHabiles',
      label: 'Días Hábiles',
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
        <h1 className="text-2xl font-bold text-[#111827]">Vacaciones</h1>
        <Button onClick={() => { setModalError(''); setShowCreate(true) }}>
          <Plus className="w-4 h-4" />
          Nueva Solicitud
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Select
          name="filterEstado"
          value={filterEstado}
          onChange={(e) => { setFilterEstado(e.target.value); setPage(1) }}
          options={estadoOptions}
          placeholder="Estado"
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
        data={vacaciones}
        loading={loading}
        emptyTitle="Sin vacaciones"
        emptyDescription="No hay solicitudes de vacaciones."
        pagination={pagination}
        onPageChange={setPage}
      />

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Solicitar Vacaciones"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button onClick={handleCreate} loading={creating}>Crear Solicitud</Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}

        {saldo && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-[#2563EB]">Saldo de Vacaciones</p>
              <p className="text-[#6B7280]">
                Total: {saldo.diasTotales} | Usados: {saldo.diasUsados} | Pendientes: {saldo.diasPendientes} | <strong>Disponible: {saldo.saldo}</strong>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Select
            label="Trabajador"
            name="trabajadorId"
            value={createForm.trabajadorId}
            onChange={handleCreateFormChange}
            options={trabajadorOptions}
            required
          />
          <Input
            label="Fecha Desde"
            name="fechaDesde"
            type="date"
            value={createForm.fechaDesde}
            onChange={handleCreateFormChange}
            required
          />
          <Input
            label="Fecha Hasta"
            name="fechaHasta"
            type="date"
            value={createForm.fechaHasta}
            onChange={handleCreateFormChange}
            required
          />
          <Input
            label="Días Hábiles"
            name="diasHabiles"
            type="number"
            value={createForm.diasHabiles}
            onChange={handleCreateFormChange}
            required
          />
        </div>
      </Modal>
    </div>
  )
}
