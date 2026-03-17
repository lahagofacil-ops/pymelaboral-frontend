import { useState, useEffect, useCallback } from 'react'
import { Plus, Info } from 'lucide-react'
import { get, post } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatDate } from '../../lib/formatters'

export default function MisVacaciones() {
  const [vacaciones, setVacaciones] = useState([])
  const [pagination, setPagination] = useState(null)
  const [saldo, setSaldo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ fechaDesde: '', fechaHasta: '', diasHabiles: '' })
  const [creating, setCreating] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchVacaciones = useCallback(async () => {
    setLoading(true)
    try {
      const res = await get(`/api/vacaciones?page=${page}&limit=20`)
      if (res.success) {
        setVacaciones(res.data.vacaciones || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchVacaciones()
  }, [fetchVacaciones])

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const res = await get('/api/dashboard')
        if (res.success && res.data?.vacaciones) {
          setSaldo(res.data.vacaciones)
        }
      } catch {}
    }
    fetchSaldo()
  }, [])

  const handleCreate = async () => {
    setCreating(true)
    setModalError('')
    try {
      await post('/api/vacaciones', {
        ...form,
        diasHabiles: parseInt(form.diasHabiles) || 0,
      })
      setShowCreate(false)
      setForm({ fechaDesde: '', fechaHasta: '', diasHabiles: '' })
      fetchVacaciones()
    } catch (err) {
      setModalError(err.message || 'Error al solicitar vacaciones')
    } finally {
      setCreating(false)
    }
  }

  const estadoBadgeVariant = (estado) => {
    const map = { PENDIENTE: 'warning', APROBADO: 'success', RECHAZADO: 'danger' }
    return map[estado] || 'neutral'
  }

  const columns = [
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
    { key: 'diasHabiles', label: 'Días Hábiles' },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => <Badge variant={estadoBadgeVariant(val)}>{val}</Badge>,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Mis Vacaciones</h1>
          <p className="text-sm text-[#6B7280]">Solicitudes y saldo de vacaciones</p>
        </div>
        <Button onClick={() => { setModalError(''); setShowCreate(true) }}>
          <Plus className="w-4 h-4" />
          Solicitar Vacaciones
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {saldo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-[#2563EB]">Saldo de Vacaciones</p>
            <p className="text-[#6B7280]">
              Total: {saldo.diasTotales || 0} | Usados: {saldo.diasUsados || 0} | Pendientes: {saldo.diasPendientes || 0} | <strong className="text-[#2563EB]">Disponible: {saldo.saldo || 0}</strong>
            </p>
          </div>
        </div>
      )}

      <Table
        columns={columns}
        data={vacaciones}
        loading={loading}
        emptyTitle="Sin vacaciones"
        emptyDescription="No tienes solicitudes de vacaciones."
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
            <Button onClick={handleCreate} loading={creating}>Enviar Solicitud</Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}
        <div className="space-y-4">
          <Input
            label="Fecha Desde"
            name="fechaDesde"
            type="date"
            value={form.fechaDesde}
            onChange={(e) => setForm({ ...form, fechaDesde: e.target.value })}
            required
          />
          <Input
            label="Fecha Hasta"
            name="fechaHasta"
            type="date"
            value={form.fechaHasta}
            onChange={(e) => setForm({ ...form, fechaHasta: e.target.value })}
            required
          />
          <Input
            label="Días Hábiles"
            name="diasHabiles"
            type="number"
            min="1"
            value={form.diasHabiles}
            onChange={(e) => setForm({ ...form, diasHabiles: e.target.value })}
            required
          />
        </div>
      </Modal>
    </div>
  )
}
