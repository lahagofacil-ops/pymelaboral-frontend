import { useState, useEffect, useCallback } from 'react'
import { Plus, Eye } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP, formatDate } from '../../lib/utils'
import { CAUSAL_TERMINO } from '../../lib/constants'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'

export default function FiniquitosPage() {
  const [finiquitos, setFiniquitos] = useState([])
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedFiniquito, setSelectedFiniquito] = useState(null)
  const [form, setForm] = useState({ trabajadorId: '', causal: '', fechaTermino: '' })
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [fRes, tRes] = await Promise.all([
        apiClient.get('/api/finiquitos'),
        apiClient.get('/api/trabajadores'),
      ])
      if (fRes.success) setFiniquitos(fRes.data)
      if (tRes.success) setTrabajadores(tRes.data)
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.post('/api/finiquitos', form)
      if (res.success) {
        setModalOpen(false)
        setForm({ trabajadorId: '', causal: '', fechaTermino: '' })
        await fetchData()
      } else {
        setError(res.error || 'Error al crear finiquito')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleViewDetail = async (f) => {
    try {
      const res = await apiClient.get(`/api/finiquitos/${f.id}`)
      if (res.success) {
        setSelectedFiniquito(res.data)
        setDetailOpen(true)
      }
    } catch {
      setError('Error al cargar detalle')
    }
  }

  const estadoBadge = (estado) => {
    const map = { PAGADO: 'success', PENDIENTE: 'warning', BORRADOR: 'neutral' }
    return <Badge variant={map[estado] || 'neutral'}>{estado || '-'}</Badge>
  }

  const columns = [
    {
      key: 'trabajador',
      label: 'Trabajador',
      render: (val) => val ? `${val.nombre} ${val.apellidoPaterno}` : '-',
    },
    {
      key: 'causal',
      label: 'Causal',
      render: (val) => CAUSAL_TERMINO.find((c) => c.value === val)?.label || val,
    },
    { key: 'fechaTermino', label: 'Fecha', render: (val) => formatDate(val) },
    { key: 'total', label: 'Total', render: (val) => formatCLP(val) },
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
        <h1 className="text-2xl font-bold text-[#111827]">Finiquitos</h1>
        <Button onClick={() => { setForm({ trabajadorId: '', causal: '', fechaTermino: '' }); setModalOpen(true) }}>
          <Plus className="w-4 h-4" />
          Nuevo finiquito
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Table columns={columns} data={finiquitos} loading={loading} emptyMessage="No hay finiquitos" />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo finiquito"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>Crear</Button>
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
          <Select
            label="Causal de termino"
            value={form.causal}
            onChange={(e) => setForm({ ...form, causal: e.target.value })}
            options={CAUSAL_TERMINO}
          />
          <Input label="Fecha de termino" type="date" value={form.fechaTermino} onChange={(e) => setForm({ ...form, fechaTermino: e.target.value })} />
        </div>
      </Modal>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Detalle del finiquito"
        size="lg"
      >
        {selectedFiniquito && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-[#6B7280]">Trabajador:</span> <span className="font-medium text-[#111827]">{selectedFiniquito.trabajador ? `${selectedFiniquito.trabajador.nombre} ${selectedFiniquito.trabajador.apellidoPaterno}` : '-'}</span></div>
              <div><span className="text-[#6B7280]">Causal:</span> <span className="font-medium text-[#111827]">{CAUSAL_TERMINO.find((c) => c.value === selectedFiniquito.causal)?.label || selectedFiniquito.causal}</span></div>
              <div><span className="text-[#6B7280]">Fecha:</span> <span className="font-medium text-[#111827]">{formatDate(selectedFiniquito.fechaTermino)}</span></div>
              <div><span className="text-[#6B7280]">Estado:</span> {estadoBadge(selectedFiniquito.estado)}</div>
            </div>
            {selectedFiniquito.desglose && typeof selectedFiniquito.desglose === 'object' && (
              <div className="border-t border-[#E5E7EB] pt-4">
                <h4 className="text-sm font-semibold text-[#111827] mb-2">Desglose</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(selectedFiniquito.desglose).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-[#6B7280]">{key}</span>
                      <span className="font-medium text-[#111827]">{formatCLP(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="border-t border-[#E5E7EB] pt-4 flex justify-between text-base font-semibold text-[#111827]">
              <span>Total:</span>
              <span>{formatCLP(selectedFiniquito.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
