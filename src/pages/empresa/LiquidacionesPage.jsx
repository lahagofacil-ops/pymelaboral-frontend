import { useState, useEffect } from 'react'
import { FileText, Plus } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP, formatDate } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
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
        if (result.data.pagination) setPagination(result.data.pagination)
      } else {
        setError(result.error || 'Error al cargar liquidaciones')
      }
    } catch (err) {
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
      const result = await apiClient.post('/api/liquidaciones/generar', { periodo })
      if (result.success) {
        fetchLiquidaciones()
      } else {
        setError(result.error || 'Error al generar liquidaciones')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setGenerating(false)
    }
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const columns = [
    {
      header: 'Trabajador',
      accessor: (row) => row.trabajador ? `${row.trabajador.nombre} ${row.trabajador.apellidoPaterno}` : '—',
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
        <Badge variant={row.estado === 'PAGADA' ? 'success' : row.estado === 'GENERADA' ? 'warning' : 'default'}>
          {row.estado}
        </Badge>
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
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Anterior
              </Button>
              <span className="flex items-center text-sm text-[#6B7280]">
                Página {pagination.page} de {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
