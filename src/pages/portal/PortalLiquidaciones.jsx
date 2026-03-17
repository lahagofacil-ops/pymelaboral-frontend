import { useState, useEffect, useCallback } from 'react'
import { Eye } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'

export default function PortalLiquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedLiq, setSelectedLiq] = useState(null)

  const fetchLiquidaciones = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/liquidaciones')
      if (res.success) {
        setLiquidaciones(res.data)
      } else {
        setError(res.error || 'Error al cargar liquidaciones')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLiquidaciones()
  }, [fetchLiquidaciones])

  const handleViewDetail = async (liq) => {
    try {
      const res = await apiClient.get(`/api/liquidaciones/${liq.id}`)
      if (res.success) {
        setSelectedLiq(res.data)
        setDetailOpen(true)
      }
    } catch {
      setError('Error al cargar detalle')
    }
  }

  const estadoBadge = (estado) => {
    const map = { APROBADA: 'success', PENDIENTE: 'warning', BORRADOR: 'neutral' }
    return <Badge variant={map[estado] || 'neutral'}>{estado || '-'}</Badge>
  }

  const columns = [
    { key: 'periodo', label: 'Periodo' },
    { key: 'sueldoBase', label: 'Sueldo Base', render: (val) => formatCLP(val) },
    { key: 'totalHaberes', label: 'Haberes', render: (val) => formatCLP(val) },
    { key: 'totalDescuentos', label: 'Descuentos', render: (val) => formatCLP(val) },
    { key: 'liquido', label: 'Liquido', render: (val) => <span className="font-medium">{formatCLP(val)}</span> },
    { key: 'estado', label: 'Estado', render: (val) => estadoBadge(val) },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <button
          onClick={() => handleViewDetail(row)}
          className="p-1.5 rounded-lg text-[#2563EB] hover:bg-blue-50 transition-colors"
          title="Ver detalle"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#111827]">Mis Liquidaciones</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Table columns={columns} data={liquidaciones} loading={loading} emptyMessage="No hay liquidaciones" />

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Detalle de liquidacion"
        size="lg"
      >
        {selectedLiq && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-[#6B7280]">Periodo:</span> <span className="font-medium text-[#111827]">{selectedLiq.periodo}</span></div>
              <div><span className="text-[#6B7280]">Sueldo base:</span> <span className="font-medium text-[#111827]">{formatCLP(selectedLiq.sueldoBase)}</span></div>
            </div>
            {selectedLiq.haberes && typeof selectedLiq.haberes === 'object' && (
              <div className="border-t border-[#E5E7EB] pt-4">
                <h4 className="text-sm font-semibold text-[#111827] mb-2">Haberes</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(selectedLiq.haberes).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-[#6B7280]">{key}</span>
                      <span>{formatCLP(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedLiq.descuentos && typeof selectedLiq.descuentos === 'object' && (
              <div className="border-t border-[#E5E7EB] pt-4">
                <h4 className="text-sm font-semibold text-[#111827] mb-2">Descuentos</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(selectedLiq.descuentos).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-[#6B7280]">{key}</span>
                      <span>{formatCLP(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="border-t border-[#E5E7EB] pt-4 flex justify-between text-base font-semibold text-[#111827]">
              <span>Liquido a pagar:</span>
              <span>{formatCLP(selectedLiq.liquido)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
