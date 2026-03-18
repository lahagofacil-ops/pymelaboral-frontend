import { useState, useEffect } from 'react'
import { FileText, Plus, Download, Eye } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP, formatDate } from '../../lib/utils'
import { downloadPDF } from '../../lib/pdfDownload'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

export default function LiquidacionesPage() {
  const [liquidaciones, setLiquidaciones] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 })
  const [periodo, setPeriodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [downloadingPdf, setDownloadingPdf] = useState(null)

  useEffect(() => {
    fetchLiquidaciones()
  }, [periodo, pagination.page])

  const fetchLiquidaciones = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (periodo) params.append('periodo', periodo)
      params.append('page', pagination.page)
      params.append('limit', pagination.limit)
      const result = await apiClient.get(`/api/liquidaciones?${params.toString()}`)
      if (result.success) {
        setLiquidaciones(result.data.liquidaciones || [])
        if (result.data.total) setPagination(prev => ({ ...prev, total: result.data.total, pages: result.data.totalPages || 1 }))
      } else {
        setError(result.error || 'Error al cargar liquidaciones')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerar = async () => {
    if (!periodo) {
      setError('Seleccione un periodo para generar liquidaciones')
      return
    }
    try {
      setGenerating(true)
      setError(null)
      const result = await apiClient.post('/api/liquidaciones/masiva', { periodo })
      if (result.success) {
        fetchLiquidaciones()
      } else {
        setError(result.error || 'Error al generar liquidaciones')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadPDF = async (id, periodo) => {
    try {
      setDownloadingPdf(id)
      await downloadPDF(`/api/liquidaciones/${id}/pdf`, `liquidacion_${periodo}.pdf`)
    } catch {
      setError('Error al descargar PDF')
    } finally {
      setDownloadingPdf(null)
    }
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const columns = [
    {
      header: 'Trabajador',
      accessor: (row) => row.trabajadorNombre || (row.trabajador ? `${row.trabajador.nombre} ${row.trabajador.apellidoPaterno}` : '—'),
    },
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
        <Badge variant={row.estado === 'APROBADA' || row.estado === 'PAGADA' ? 'success' : row.estado === 'VERIFICADA' ? 'warning' : 'default'}>
          {row.estado}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setShowDetail(row)} title="Ver detalle">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(row.id, row.periodo)}
            loading={downloadingPdf === row.id} title="Descargar PDF">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Liquidaciones</h1>
        <Button onClick={handleGenerar} loading={generating}>
          <Plus className="w-4 h-4 mr-2" />
          Generar Liquidaciones
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="flex items-center gap-4">
        <Input
          label="Periodo"
          type="month"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="w-48"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <>
          <Table columns={columns} data={liquidaciones} emptyMessage="No hay liquidaciones para este periodo" />

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => handlePageChange(pagination.page - 1)}>
                Anterior
              </Button>
              <span className="flex items-center text-sm text-[#6B7280]">
                Página {pagination.page} de {pagination.pages}
              </span>
              <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => handlePageChange(pagination.page + 1)}>
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}

      {/* ===== MODAL DETALLE LIQUIDACIÓN ===== */}
      <Modal open={!!showDetail} onClose={() => setShowDetail(null)} title={`Liquidación ${showDetail?.periodo || ''}`}>
        {showDetail && (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
            {/* Info trabajador */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-[#111827]">{showDetail.trabajadorNombre || '—'}</p>
                <p className="text-sm text-[#6B7280]">{showDetail.trabajadorRut || ''}</p>
              </div>
              <Badge variant={showDetail.estado === 'APROBADA' || showDetail.estado === 'PAGADA' ? 'success' : 'warning'}>
                {showDetail.estado}
              </Badge>
            </div>

            {/* HABERES */}
            <div>
              <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wide mb-2">Haberes</h3>
              <div className="bg-[#F9FAFB] rounded-lg p-3 space-y-1">
                <Row label="Sueldo Base" value={showDetail.sueldoBase} />
                <Row label="Gratificación" value={showDetail.gratificacion} />
                <Row label="Horas Extra" value={showDetail.horasExtra} />
                <Row label="Bonos" value={showDetail.bonos} />
                <Row label="Otros Haberes" value={showDetail.otrosHaberes} />
                <div className="border-t border-[#E5E7EB] pt-1 mt-1">
                  <Row label="Total Haberes" value={showDetail.totalHaberes} bold />
                </div>
              </div>
            </div>

            {/* DESCUENTOS */}
            <div>
              <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wide mb-2">Descuentos</h3>
              <div className="bg-[#F9FAFB] rounded-lg p-3 space-y-1">
                <Row label={`AFP${showDetail.detalleCalculo?.nombreAFP ? ` (${showDetail.detalleCalculo.nombreAFP})` : ''}`} value={showDetail.afp} />
                <Row label="Comisión AFP" value={showDetail.comisionAfp} />
                <Row label="Salud (7%)" value={showDetail.salud} />
                <Row label="Seguro Cesantía" value={showDetail.cesantiaTrab} />
                <Row label="Impuesto Único" value={showDetail.impuestoRenta} />
                <Row label="Otros Descuentos" value={showDetail.otrosDescuentos} />
                <div className="border-t border-[#E5E7EB] pt-1 mt-1">
                  <Row label="Total Descuentos" value={showDetail.totalDescuentos} bold />
                </div>
              </div>
            </div>

            {/* LÍQUIDO */}
            <div className="bg-[#1a3a5c] text-white rounded-lg p-4 flex justify-between items-center">
              <span className="text-lg font-semibold">Líquido a Pagar</span>
              <span className="text-2xl font-bold">{formatCLP(showDetail.liquido)}</span>
            </div>

            {/* COSTO EMPLEADOR */}
            <div>
              <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wide mb-2">Costo Empleador</h3>
              <div className="bg-[#F9FAFB] rounded-lg p-3 space-y-1">
                <Row label="SIS (1.54%)" value={showDetail.sis} />
                <Row label="Cesantía Empleador" value={showDetail.cesantiaEmp} />
                <Row label="Mutual" value={showDetail.mutual} />
                <Row label="Aporte Reforma Previsional" value={showDetail.aporteReforma} />
                <div className="border-t border-[#E5E7EB] pt-1 mt-1">
                  <Row label="Total Costo Empleador" value={showDetail.totalCostoEmp} bold />
                </div>
              </div>
            </div>

            {/* PDF button */}
            <div className="flex justify-end pt-2 border-t border-[#E5E7EB]">
              <Button onClick={() => handleDownloadPDF(showDetail.id, showDetail.periodo)}
                loading={downloadingPdf === showDetail.id}>
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// Helper row component for detail tables
function Row({ label, value, bold = false }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? 'font-semibold' : ''}`}>
      <span className="text-[#6B7280]">{label}</span>
      <span className="text-[#111827]">{formatCLP(value)}</span>
    </div>
  )
}
