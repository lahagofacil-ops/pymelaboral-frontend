import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

export default function PortalLiquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDetail, setShowDetail] = useState(null)

  useEffect(() => {
    fetchLiquidaciones()
  }, [])

  const fetchLiquidaciones = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get('/api/liquidaciones')
      if (result.success) {
        setLiquidaciones(result.data.liquidaciones || [])
      } else {
        setError(result.error || 'Error al cargar liquidaciones')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { header: 'Periodo', accessor: 'periodo' },
    {
      header: 'Total Haberes',
      accessor: (row) => formatCLP(row.totalHaberes),
    },
    {
      header: 'Total Descuentos',
      accessor: (row) => formatCLP(row.totalDescuentos),
    },
    {
      header: 'Líquido',
      accessor: (row) => <span className="font-semibold">{formatCLP(row.liquido)}</span>,
    },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={row.estado === 'PAGADA' ? 'success' : row.estado === 'GENERADA' ? 'warning' : 'default'}>
          {row.estado}
        </Badge>
      ),
    },
    {
      header: 'Detalle',
      accessor: (row) => (
        <Button variant="ghost" size="sm" onClick={() => setShowDetail(row)}>
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#111827]">Mis Liquidaciones</h1>

      {error && <Alert type="error">{error}</Alert>}

      <Table columns={columns} data={liquidaciones} emptyMessage="No hay liquidaciones disponibles" />

      <Modal open={!!showDetail} onClose={() => setShowDetail(null)} title={`Liquidación ${showDetail?.periodo || ''}`}>
        {showDetail && (
          <div className="space-y-4">
            {showDetail.haberes && Array.isArray(showDetail.haberes) && (
              <div>
                <h3 className="font-semibold text-[#111827] mb-2">Haberes</h3>
                <div className="space-y-1">
                  {showDetail.haberes.map((h, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{h.nombre}</span>
                      <span className="text-[#111827]">{formatCLP(h.monto)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {showDetail.descuentos && Array.isArray(showDetail.descuentos) && (
              <div>
                <h3 className="font-semibold text-[#111827] mb-2">Descuentos</h3>
                <div className="space-y-1">
                  {showDetail.descuentos.map((d, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{d.nombre}</span>
                      <span className="text-[#DC2626]">-{formatCLP(d.monto)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="border-t border-[#E5E7EB] pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Total Haberes</span>
                <span className="text-[#111827]">{formatCLP(showDetail.totalHaberes)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Total Descuentos</span>
                <span className="text-[#DC2626]">-{formatCLP(showDetail.totalDescuentos)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span className="text-[#111827]">Líquido</span>
                <span className="text-[#111827]">{formatCLP(showDetail.liquido)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
