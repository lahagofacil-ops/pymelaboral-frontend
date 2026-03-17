import { useState, useEffect, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { get, post, put } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatMoney, formatPeriodo } from '../../lib/formatters'

const estadoOptions = [
  { value: '', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'DECLARADA', label: 'Declarada' },
  { value: 'PAGADA', label: 'Pagada' },
]

const estadoTransitions = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'DECLARADA', label: 'Declarada' },
  { value: 'PAGADA', label: 'Pagada' },
]

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterPeriodo, setFilterPeriodo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [generating, setGenerating] = useState(false)
  const [showGenerar, setShowGenerar] = useState(false)
  const [generarPeriodo, setGenerarPeriodo] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchCotizaciones = useCallback(async () => {
    setLoading(true)
    try {
      let url = `/api/cotizaciones?page=${page}&limit=20`
      if (filterPeriodo) url += `&periodo=${filterPeriodo}`
      if (filterEstado) url += `&estadoPrevired=${filterEstado}`
      const res = await get(url)
      if (res.success) {
        setCotizaciones(res.data.cotizaciones || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filterPeriodo, filterEstado, page])

  useEffect(() => {
    fetchCotizaciones()
  }, [fetchCotizaciones])

  const handleGenerar = async () => {
    if (!generarPeriodo) return
    setGenerating(true)
    setError('')
    setSuccess('')
    try {
      const res = await post('/api/cotizaciones/generar', { periodo: generarPeriodo })
      if (res.success) {
        setSuccess('Cotizaciones generadas correctamente')
        setShowGenerar(false)
        setGenerarPeriodo('')
        fetchCotizaciones()
      }
    } catch (err) {
      setError(err.message || 'Error al generar cotizaciones')
    } finally {
      setGenerating(false)
    }
  }

  const handleUpdateEstado = async (cotId, newEstado) => {
    setUpdatingId(cotId)
    try {
      await put(`/api/cotizaciones/${cotId}/estado`, { estadoPrevired: newEstado })
      fetchCotizaciones()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const estadoBadgeVariant = (estado) => {
    const map = { PENDIENTE: 'warning', DECLARADA: 'info', PAGADA: 'success' }
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
      key: 'rentaImponible',
      label: 'Renta Imponible',
      render: (val) => formatMoney(val),
    },
    {
      key: 'afpTrabajador',
      label: 'AFP',
      render: (val) => formatMoney(val),
    },
    {
      key: 'salud',
      label: 'Salud',
      render: (val) => formatMoney(val),
    },
    {
      key: 'cesantia',
      label: 'Cesantía',
      render: (val) => formatMoney(val),
    },
    {
      key: 'estadoPrevired',
      label: 'Estado',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <Badge variant={estadoBadgeVariant(val)}>{val}</Badge>
          {val !== 'PAGADA' && (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) handleUpdateEstado(row.id, e.target.value)
              }}
              disabled={updatingId === row.id}
              className="text-xs border border-[#E5E7EB] rounded px-1 py-0.5 text-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="">Cambiar...</option>
              {estadoTransitions
                .filter((et) => et.value !== val)
                .map((et) => (
                  <option key={et.value} value={et.value}>{et.label}</option>
                ))}
            </select>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Cotizaciones</h1>
        <Button onClick={() => setShowGenerar(true)}>
          <RefreshCw className="w-4 h-4" />
          Generar Cotizaciones
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message={success} closable className="mb-4" />}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          name="filterPeriodo"
          type="month"
          value={filterPeriodo}
          onChange={(e) => { setFilterPeriodo(e.target.value); setPage(1) }}
          className="w-44"
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
        data={cotizaciones}
        loading={loading}
        emptyTitle="Sin cotizaciones"
        emptyDescription="No hay cotizaciones registradas."
        pagination={pagination}
        onPageChange={setPage}
      />

      <Modal
        isOpen={showGenerar}
        onClose={() => setShowGenerar(false)}
        title="Generar Cotizaciones"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowGenerar(false)}>Cancelar</Button>
            <Button onClick={handleGenerar} loading={generating}>Generar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Periodo"
            name="generarPeriodo"
            type="month"
            value={generarPeriodo}
            onChange={(e) => setGenerarPeriodo(e.target.value)}
            required
          />
          <p className="text-xs text-[#6B7280]">
            Se generarán las cotizaciones previsionales de todos los trabajadores activos para el periodo seleccionado, basado en sus liquidaciones.
          </p>
        </div>
      </Modal>
    </div>
  )
}
