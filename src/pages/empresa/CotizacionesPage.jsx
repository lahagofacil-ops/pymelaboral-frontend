import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, CheckCircle } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Card from '../../components/ui/Card'

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [resumen, setResumen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [periodo, setPeriodo] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [cRes, rRes] = await Promise.all([
        apiClient.get(`/api/cotizaciones?periodo=${periodo}`),
        apiClient.get(`/api/cotizaciones/resumen?periodo=${periodo}`),
      ])
      if (cRes.success) setCotizaciones(cRes.data)
      if (rRes.success) setResumen(rRes.data)
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [periodo])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleGenerar = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.post('/api/cotizaciones/generar', { periodo })
      if (res.success) {
        await fetchData()
      } else {
        setError(res.error || 'Error al generar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleMarcarPagada = async (id) => {
    try {
      const res = await apiClient.put(`/api/cotizaciones/${id}/marcar-pagada`)
      if (res.success) {
        await fetchData()
      } else {
        setError(res.error || 'Error al marcar')
      }
    } catch {
      setError('Error de conexion')
    }
  }

  const columns = [
    {
      key: 'trabajador',
      label: 'Trabajador',
      render: (val) => val ? `${val.nombre} ${val.apellidoPaterno}` : '-',
    },
    { key: 'periodo', label: 'Periodo' },
    { key: 'rentaImponible', label: 'Renta Imponible', render: (val) => formatCLP(val) },
    { key: 'afp', label: 'AFP', render: (val) => formatCLP(val) },
    { key: 'salud', label: 'Salud', render: (val) => formatCLP(val) },
    { key: 'cesantia', label: 'Cesantia', render: (val) => formatCLP(val) },
    {
      key: 'estado',
      label: 'Previred',
      render: (val) => (
        <Badge variant={val === 'PAGADA' ? 'success' : val === 'PENDIENTE' ? 'warning' : 'neutral'}>
          {val || 'Pendiente'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => row.estado !== 'PAGADA' ? (
        <button
          onClick={() => handleMarcarPagada(row.id)}
          className="p-1.5 rounded-lg text-[#059669] hover:bg-green-50 transition-colors"
          title="Marcar pagada"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Cotizaciones Previsionales</h1>
        <Button onClick={handleGenerar} loading={saving}>
          <RefreshCw className="w-4 h-4" />
          Generar cotizaciones
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="flex items-center gap-3">
        <Input
          label="Periodo"
          type="month"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="w-48"
        />
      </div>

      {resumen && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-[#6B7280]">Total AFP</p>
            <p className="text-lg font-bold text-[#111827]">{formatCLP(resumen.totalAfp)}</p>
          </Card>
          <Card>
            <p className="text-sm text-[#6B7280]">Total Salud</p>
            <p className="text-lg font-bold text-[#111827]">{formatCLP(resumen.totalSalud)}</p>
          </Card>
          <Card>
            <p className="text-sm text-[#6B7280]">Total Cesantia</p>
            <p className="text-lg font-bold text-[#111827]">{formatCLP(resumen.totalCesantia)}</p>
          </Card>
          <Card>
            <p className="text-sm text-[#6B7280]">Total General</p>
            <p className="text-lg font-bold text-[#111827]">{formatCLP(resumen.total)}</p>
          </Card>
        </div>
      )}

      <Table columns={columns} data={cotizaciones} loading={loading} emptyMessage="No hay cotizaciones para este periodo" />
    </div>
  )
}
