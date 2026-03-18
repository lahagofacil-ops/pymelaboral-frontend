import { useState, useEffect } from 'react'
import { DollarSign, Plus, CheckCircle } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [resumen, setResumen] = useState(null)
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 })
  const [periodo, setPeriodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (periodo) {
      fetchCotizaciones()
      fetchResumen()
    }
  }, [periodo])

  const fetchCotizaciones = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get(`/api/cotizaciones?periodo=${periodo}`)
      if (result.success) {
        setCotizaciones(result.data.cotizaciones || [])
        if (result.data.pagination) setPagination(result.data.pagination)
      } else {
        setError(result.error || 'Error al cargar cotizaciones')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const fetchResumen = async () => {
    try {
      const result = await apiClient.get(`/api/cotizaciones/resumen?periodo=${periodo}`)
      if (result.success) {
        setResumen(result.data)
      }
    } catch (err) {
      // silent
    }
  }

  const handleGenerar = async () => {
    if (!periodo) {
      setError('Seleccione un periodo')
      return
    }
    try {
      setGenerating(true)
      setError(null)
      const result = await apiClient.post('/api/cotizaciones/generar', { periodo })
      if (result.success) {
        fetchCotizaciones()
        fetchResumen()
      } else {
        setError(result.error || 'Error al generar cotizaciones')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setGenerating(false)
    }
  }

  const handleMarcarPagada = async (id) => {
    try {
      const result = await apiClient.put(`/api/cotizaciones/${id}/pagar`)
      if (result.success) {
        fetchCotizaciones()
        fetchResumen()
      } else {
        setError(result.error || 'Error al marcar como pagada')
      }
    } catch (err) {
      setError('Error de conexión')
    }
  }

  const columns = [
    {
      header: 'Trabajador',
      accessor: (row) => row.trabajador ? `${row.trabajador.nombre} ${row.trabajador.apellidoPaterno}` : '—',
    },
    { header: 'Periodo', accessor: 'periodo' },
    {
      header: 'Renta Imponible',
      accessor: (row) => formatCLP(row.rentaImponible),
    },
    {
      header: 'AFP Trabajador',
      accessor: (row) => formatCLP(row.afpTrabajador),
    },
    {
      header: 'Salud',
      accessor: (row) => formatCLP(row.salud),
    },
    {
      header: 'Estado Previred',
      accessor: (row) => (
        <Badge variant={row.estadoPrevired === 'PAGADA' ? 'success' : row.estadoPrevired === 'PENDIENTE' ? 'warning' : 'default'}>
          {row.estadoPrevired}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      accessor: (row) =>
        row.estadoPrevired !== 'PAGADA' ? (
          <Button variant="ghost" size="sm" onClick={() => handleMarcarPagada(row.id)}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Pagada
          </Button>
        ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Cotizaciones Previsionales</h1>
        <Button onClick={handleGenerar} loading={generating}>
          <Plus className="w-4 h-4 mr-2" />
          Generar Cotizaciones
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

      {resumen?.totales && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4 text-center">
            <p className="text-xs text-[#6B7280]">AFP Trabajador</p>
            <p className="font-semibold text-[#111827]">{formatCLP(resumen.totales.afpTrabajador)}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-xs text-[#6B7280]">Salud</p>
            <p className="font-semibold text-[#111827]">{formatCLP(resumen.totales.salud)}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-xs text-[#6B7280]">Cesantía Trab.</p>
            <p className="font-semibold text-[#111827]">{formatCLP(resumen.totales.cesantiaTrab)}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-xs text-[#6B7280]">Cesantía Emp.</p>
            <p className="font-semibold text-[#111827]">{formatCLP(resumen.totales.cesantiaEmp)}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-xs text-[#6B7280]">SIS</p>
            <p className="font-semibold text-[#111827]">{formatCLP(resumen.totales.sis)}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-xs text-[#6B7280]">Mutual</p>
            <p className="font-semibold text-[#111827]">{formatCLP(resumen.totales.mutual)}</p>
          </Card>
        </div>
      )}

      {resumen && (
        <div className="flex gap-4 text-sm text-[#6B7280]">
          <span>Total: {resumen.cantidad}</span>
          <span>Pendientes: {resumen.pendientes}</span>
          <span>Pagadas: {resumen.pagadas}</span>
        </div>
      )}

      {!periodo ? (
        <p className="text-center text-[#6B7280] py-8">Seleccione un periodo para ver cotizaciones</p>
      ) : loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <Table columns={columns} data={cotizaciones} emptyMessage="No hay cotizaciones para este periodo" />
      )}
    </div>
  )
}
