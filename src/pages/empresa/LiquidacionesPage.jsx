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
import { formatMoney, formatPeriodo } from '../../lib/formatters'

export default function LiquidacionesPage() {
  const [liquidaciones, setLiquidaciones] = useState([])
  const [pagination, setPagination] = useState(null)
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterPeriodo, setFilterPeriodo] = useState('')
  const [filterTrabajador, setFilterTrabajador] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [createForm, setCreateForm] = useState({ trabajadorId: '', periodo: '' })
  const [creating, setCreating] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchLiquidaciones = useCallback(async () => {
    setLoading(true)
    try {
      let url = `/api/liquidaciones?page=${page}&limit=20`
      if (filterPeriodo) url += `&periodo=${filterPeriodo}`
      if (filterTrabajador) url += `&trabajadorId=${filterTrabajador}`
      if (filterEstado) url += `&estado=${filterEstado}`
      const res = await get(url)
      if (res.success) {
        setLiquidaciones(res.data.liquidaciones || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filterPeriodo, filterTrabajador, filterEstado, page])

  useEffect(() => {
    fetchLiquidaciones()
  }, [fetchLiquidaciones])

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

  const estadoOptions = [
    { value: '', label: 'Todos' },
    { value: 'BORRADOR', label: 'Borrador' },
    { value: 'EMITIDA', label: 'Emitida' },
    { value: 'PAGADA', label: 'Pagada' },
  ]

  const handleCreate = async () => {
    setCreating(true)
    setModalError('')
    try {
      await post('/api/liquidaciones', createForm)
      setShowCreate(false)
      setCreateForm({ trabajadorId: '', periodo: '' })
      fetchLiquidaciones()
    } catch (err) {
      setModalError(err.message || 'Error al crear liquidación')
    } finally {
      setCreating(false)
    }
  }

  const openDetail = (liq) => {
    setDetailData(liq)
    setShowDetail(true)
  }

  const estadoBadgeVariant = (estado) => {
    const map = { BORRADOR: 'neutral', EMITIDA: 'info', PAGADA: 'success' }
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
      key: 'periodo',
      label: 'Periodo',
      render: (val) => formatPeriodo(val),
    },
    {
      key: 'totalHaberes',
      label: 'Total Haberes',
      render: (val) => formatMoney(val),
    },
    {
      key: 'totalDescuentos',
      label: 'Total Descuentos',
      render: (val) => formatMoney(val),
    },
    {
      key: 'liquido',
      label: 'Líquido',
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
        <h1 className="text-2xl font-bold text-[#111827]">Liquidaciones</h1>
        <Button onClick={() => { setModalError(''); setShowCreate(true) }}>
          <Plus className="w-4 h-4" />
          Nueva Liquidación
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          name="filterPeriodo"
          type="month"
          value={filterPeriodo}
          onChange={(e) => { setFilterPeriodo(e.target.value); setPage(1) }}
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
        <Select
          name="filterEstado"
          value={filterEstado}
          onChange={(e) => { setFilterEstado(e.target.value); setPage(1) }}
          options={estadoOptions}
          placeholder="Estado"
          className="w-44"
        />
      </div>

      <Table
        columns={columns}
        data={liquidaciones}
        loading={loading}
        emptyTitle="Sin liquidaciones"
        emptyDescription="No hay liquidaciones registradas."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Nueva Liquidación"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button onClick={handleCreate} loading={creating}>Crear Liquidación</Button>
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
          <Input
            label="Periodo"
            name="periodo"
            type="month"
            value={createForm.periodo}
            onChange={(e) => setCreateForm({ ...createForm, periodo: e.target.value })}
            required
          />
          <p className="text-xs text-[#6B7280]">
            El sistema calculará automáticamente todos los haberes y descuentos según el contrato vigente.
          </p>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={`Liquidación ${detailData ? formatPeriodo(detailData.periodo) : ''}`}
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
                <p className="text-xs text-[#6B7280]">Periodo</p>
                <p className="text-sm font-medium text-[#111827]">{formatPeriodo(detailData.periodo)}</p>
              </div>
            </div>

            {detailData.haberes && (
              <div>
                <h4 className="text-sm font-semibold text-[#111827] mb-2">Haberes</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {Object.entries(detailData.haberes).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{key}</span>
                      <span className="text-[#111827] font-medium">{formatMoney(val)}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#E5E7EB] pt-2 flex justify-between text-sm font-semibold">
                    <span className="text-[#111827]">Total Haberes</span>
                    <span className="text-[#111827]">{formatMoney(detailData.totalHaberes)}</span>
                  </div>
                </div>
              </div>
            )}

            {detailData.descuentos && (
              <div>
                <h4 className="text-sm font-semibold text-[#111827] mb-2">Descuentos</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {Object.entries(detailData.descuentos).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{key}</span>
                      <span className="text-[#DC2626] font-medium">-{formatMoney(val)}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#E5E7EB] pt-2 flex justify-between text-sm font-semibold">
                    <span className="text-[#111827]">Total Descuentos</span>
                    <span className="text-[#DC2626]">-{formatMoney(detailData.totalDescuentos)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#2563EB] text-white rounded-lg p-4 flex justify-between items-center">
              <span className="text-lg font-semibold">Líquido a Pagar</span>
              <span className="text-2xl font-bold">{formatMoney(detailData.liquido)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
