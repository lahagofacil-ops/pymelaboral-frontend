import { useState, useEffect, useCallback } from 'react'
import { Plus, Eye, Users } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP, formatDate } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'

export default function LiquidacionesPage() {
  const [liquidaciones, setLiquidaciones] = useState([])
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [periodo, setPeriodo] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedLiq, setSelectedLiq] = useState(null)
  const [form, setForm] = useState({ trabajadorId: '', periodo: '' })
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [lRes, tRes] = await Promise.all([
        apiClient.get(`/api/liquidaciones?periodo=${periodo}`),
        apiClient.get('/api/trabajadores'),
      ])
      if (lRes.success) setLiquidaciones(lRes.data)
      if (tRes.success) setTrabajadores(tRes.data)
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
      const res = await apiClient.post('/api/liquidaciones', {
        trabajadorId: form.trabajadorId,
        periodo: form.periodo || periodo,
      })
      if (res.success) {
        setModalOpen(false)
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

  const handleGenerarMasivo = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.post('/api/liquidaciones/generar-masivo', { periodo })
      if (res.success) {
        await fetchData()
      } else {
        setError(res.error || 'Error al generar masivo')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

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
    const map = { APROBADA: 'success', PENDIENTE: 'warning', BORRADOR: 'neutral', RECHAZADA: 'danger' }
    return <Badge variant={map[estado] || 'neutral'}>{estado || '-'}</Badge>
  }

  const columns = [
    {
      key: 'trabajador',
      label: 'Trabajador',
      render: (val, row) => val ? `${val.nombre} ${val.apellidoPaterno}` : '-',
    },
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Liquidaciones</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerarMasivo} loading={saving}>
            <Users className="w-4 h-4" />
            Generar masivo
          </Button>
          <Button onClick={() => { setForm({ trabajadorId: '', periodo }); setModalOpen(true) }}>
            <Plus className="w-4 h-4" />
            Generar liquidacion
          </Button>
        </div>
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

      <Table columns={columns} data={liquidaciones} loading={loading} emptyMessage="No hay liquidaciones para este periodo" />

      {/* Generate Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Generar liquidacion"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleGenerar} loading={saving}>Generar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Trabajador"
            value={form.trabajadorId}
            onChange={(e) => setForm({ ...form, trabajadorId: e.target.value })}
            options={trabajadores.map((t) => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))}
          />
          <Input
            label="Periodo"
            type="month"
            value={form.periodo}
            onChange={(e) => setForm({ ...form, periodo: e.target.value })}
          />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Detalle de liquidacion"
        size="lg"
      >
        {selectedLiq && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-[#6B7280]">Trabajador:</span> <span className="font-medium text-[#111827]">{selectedLiq.trabajador ? `${selectedLiq.trabajador.nombre} ${selectedLiq.trabajador.apellidoPaterno}` : '-'}</span></div>
              <div><span className="text-[#6B7280]">Periodo:</span> <span className="font-medium text-[#111827]">{selectedLiq.periodo}</span></div>
              <div><span className="text-[#6B7280]">Sueldo base:</span> <span className="font-medium text-[#111827]">{formatCLP(selectedLiq.sueldoBase)}</span></div>
              <div><span className="text-[#6B7280]">Estado:</span> {estadoBadge(selectedLiq.estado)}</div>
            </div>
            <div className="border-t border-[#E5E7EB] pt-4">
              <h4 className="text-sm font-semibold text-[#111827] mb-2">Haberes</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {selectedLiq.haberes && typeof selectedLiq.haberes === 'object' ? (
                  Object.entries(selectedLiq.haberes).map(([key, val]) => (
                    <div key={key} className="flex justify-between"><span className="text-[#6B7280]">{key}:</span> <span>{formatCLP(val)}</span></div>
                  ))
                ) : (
                  <div>Total haberes: {formatCLP(selectedLiq.totalHaberes)}</div>
                )}
              </div>
            </div>
            <div className="border-t border-[#E5E7EB] pt-4">
              <h4 className="text-sm font-semibold text-[#111827] mb-2">Descuentos</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {selectedLiq.descuentos && typeof selectedLiq.descuentos === 'object' ? (
                  Object.entries(selectedLiq.descuentos).map(([key, val]) => (
                    <div key={key} className="flex justify-between"><span className="text-[#6B7280]">{key}:</span> <span>{formatCLP(val)}</span></div>
                  ))
                ) : (
                  <div>Total descuentos: {formatCLP(selectedLiq.totalDescuentos)}</div>
                )}
              </div>
            </div>
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
