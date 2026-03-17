import { useState, useEffect, useCallback } from 'react'
import { Plus, Eye } from 'lucide-react'
import { get, post } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatMoney, formatDate } from '../../lib/formatters'
import { CAUSAL_TERMINO } from '../../lib/constants'

export default function FiniquitosPage() {
  const [finiquitos, setFiniquitos] = useState([])
  const [pagination, setPagination] = useState(null)
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [createForm, setCreateForm] = useState({
    trabajadorId: '', causal: '', fechaTermino: '', fechaAviso: '',
  })
  const [creating, setCreating] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchFiniquitos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await get(`/api/finiquitos?page=${page}&limit=20`)
      if (res.success) {
        setFiniquitos(res.data.finiquitos || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchFiniquitos()
  }, [fetchFiniquitos])

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
      await post('/api/finiquitos', createForm)
      setShowCreate(false)
      setCreateForm({ trabajadorId: '', causal: '', fechaTermino: '', fechaAviso: '' })
      fetchFiniquitos()
    } catch (err) {
      setModalError(err.message || 'Error al crear finiquito')
    } finally {
      setCreating(false)
    }
  }

  const openDetail = (fin) => {
    setDetailData(fin)
    setShowDetail(true)
  }

  const estadoBadgeVariant = (estado) => {
    const map = { BORRADOR: 'neutral', EMITIDO: 'info', FIRMADO: 'success', PAGADO: 'success' }
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
      key: 'causal',
      label: 'Causal',
      render: (val) => {
        const found = CAUSAL_TERMINO.find((c) => c.value === val)
        return found ? found.label : val
      },
    },
    {
      key: 'fechaTermino',
      label: 'Fecha Término',
      render: (val) => formatDate(val),
    },
    {
      key: 'total',
      label: 'Total',
      render: (val) => <span className="font-semibold">{formatMoney(val)}</span>,
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
        <button
          onClick={() => openDetail(row)}
          className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#2563EB] transition-colors"
          title="Ver detalle"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Finiquitos</h1>
        <Button onClick={() => { setModalError(''); setShowCreate(true) }}>
          <Plus className="w-4 h-4" />
          Nuevo Finiquito
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <Table
        columns={columns}
        data={finiquitos}
        loading={loading}
        emptyTitle="Sin finiquitos"
        emptyDescription="No hay finiquitos registrados."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Nuevo Finiquito"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button onClick={handleCreate} loading={creating}>Crear Finiquito</Button>
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
            label="Causal de Término"
            name="causal"
            value={createForm.causal}
            onChange={(e) => setCreateForm({ ...createForm, causal: e.target.value })}
            options={CAUSAL_TERMINO}
            required
          />
          <Input
            label="Fecha de Término"
            name="fechaTermino"
            type="date"
            value={createForm.fechaTermino}
            onChange={(e) => setCreateForm({ ...createForm, fechaTermino: e.target.value })}
            required
          />
          <Input
            label="Fecha de Aviso"
            name="fechaAviso"
            type="date"
            value={createForm.fechaAviso}
            onChange={(e) => setCreateForm({ ...createForm, fechaAviso: e.target.value })}
          />
          <p className="text-xs text-[#6B7280]">
            El sistema calculará automáticamente los montos de indemnización según la causal y la antigüedad del trabajador.
          </p>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title="Detalle de Finiquito"
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setShowDetail(false)}>Cerrar</Button>
        }
      >
        {detailData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#6B7280]">Trabajador</p>
                <p className="text-sm font-medium text-[#111827]">
                  {detailData.trabajador ? `${detailData.trabajador.nombre} ${detailData.trabajador.apellidoPaterno || ''}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Causal</p>
                <p className="text-sm font-medium text-[#111827]">
                  {CAUSAL_TERMINO.find((c) => c.value === detailData.causal)?.label || detailData.causal}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Fecha Término</p>
                <p className="text-sm font-medium text-[#111827]">{formatDate(detailData.fechaTermino)}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Estado</p>
                <Badge variant={estadoBadgeVariant(detailData.estado)}>{detailData.estado}</Badge>
              </div>
            </div>

            {detailData.montos && (
              <div>
                <h4 className="text-sm font-semibold text-[#111827] mb-2">Desglose de Montos</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {Object.entries(detailData.montos).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{key}</span>
                      <span className="text-[#111827] font-medium">{formatMoney(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#2563EB] text-white rounded-lg p-4 flex justify-between items-center">
              <span className="text-lg font-semibold">Total Finiquito</span>
              <span className="text-2xl font-bold">{formatMoney(detailData.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
