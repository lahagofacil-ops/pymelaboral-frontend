import { useState, useEffect, useCallback } from 'react'
import { Eye } from 'lucide-react'
import { get } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatMoney, formatPeriodo } from '../../lib/formatters'

export default function MisLiquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [showDetail, setShowDetail] = useState(false)
  const [detailData, setDetailData] = useState(null)

  const fetchLiquidaciones = useCallback(async () => {
    setLoading(true)
    try {
      const res = await get(`/api/liquidaciones?page=${page}&limit=20`)
      if (res.success) {
        setLiquidaciones(res.data.liquidaciones || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchLiquidaciones()
  }, [fetchLiquidaciones])

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
      label: '',
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Mis Liquidaciones</h1>
        <p className="text-sm text-[#6B7280]">Historial de liquidaciones de sueldo</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <Table
        columns={columns}
        data={liquidaciones}
        loading={loading}
        emptyTitle="Sin liquidaciones"
        emptyDescription="No tienes liquidaciones registradas."
        pagination={pagination}
        onPageChange={setPage}
      />

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
