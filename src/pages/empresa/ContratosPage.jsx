import { useState, useEffect, useCallback } from 'react'
import { Plus, Eye } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP, formatDate } from '../../lib/utils'
import { TIPO_CONTRATO } from '../../lib/constants'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'

const emptyForm = {
  trabajadorId: '', tipo: '', cargo: '', sueldoBase: '',
  fechaInicio: '', fechaTermino: '', jornadaSemanal: '45',
}

export default function ContratosPage() {
  const [contratos, setContratos] = useState([])
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedContrato, setSelectedContrato] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [cRes, tRes] = await Promise.all([
        apiClient.get('/api/contratos'),
        apiClient.get('/api/trabajadores'),
      ])
      if (cRes.success) setContratos(cRes.data)
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
      const body = { ...form, sueldoBase: Number(form.sueldoBase), jornadaSemanal: Number(form.jornadaSemanal) }
      const res = await apiClient.post('/api/contratos', body)
      if (res.success) {
        setModalOpen(false)
        setForm(emptyForm)
        await fetchData()
      } else {
        setError(res.error || 'Error al crear contrato')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleViewDetail = async (contrato) => {
    try {
      const res = await apiClient.get(`/api/contratos/${contrato.id}`)
      if (res.success) {
        setSelectedContrato(res.data)
        setDetailOpen(true)
      }
    } catch {
      setError('Error al cargar detalle')
    }
  }

  const trabajadorName = (id) => {
    const t = trabajadores.find((x) => x.id === id)
    return t ? `${t.nombre} ${t.apellidoPaterno}` : '-'
  }

  const estadoBadge = (estado) => {
    const map = { VIGENTE: 'success', TERMINADO: 'neutral', PENDIENTE: 'warning' }
    return <Badge variant={map[estado] || 'neutral'}>{estado || '-'}</Badge>
  }

  const columns = [
    {
      key: 'trabajadorId',
      label: 'Trabajador',
      render: (val, row) => row.trabajador ? `${row.trabajador.nombre} ${row.trabajador.apellidoPaterno}` : trabajadorName(val),
    },
    { key: 'tipo', label: 'Tipo', render: (val) => TIPO_CONTRATO.find((t) => t.value === val)?.label || val },
    { key: 'cargo', label: 'Cargo' },
    { key: 'sueldoBase', label: 'Sueldo Base', render: (val) => formatCLP(val) },
    { key: 'estado', label: 'Estado', render: (val) => estadoBadge(val) },
    { key: 'fechaInicio', label: 'Inicio', render: (val) => formatDate(val) },
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
        <h1 className="text-2xl font-bold text-[#111827]">Contratos</h1>
        <Button onClick={() => { setForm(emptyForm); setModalOpen(true) }}>
          <Plus className="w-4 h-4" />
          Nuevo contrato
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Table columns={columns} data={contratos} loading={loading} emptyMessage="No hay contratos" />

      {/* New Contract Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo contrato"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>Crear</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Trabajador"
            value={form.trabajadorId}
            onChange={(e) => setForm({ ...form, trabajadorId: e.target.value })}
            options={trabajadores.map((t) => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))}
          />
          <Select
            label="Tipo"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            options={TIPO_CONTRATO}
          />
          <Input label="Cargo" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
          <Input label="Sueldo base" type="number" value={form.sueldoBase} onChange={(e) => setForm({ ...form, sueldoBase: e.target.value })} />
          <Input label="Fecha inicio" type="date" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} />
          <Input label="Fecha termino" type="date" value={form.fechaTermino} onChange={(e) => setForm({ ...form, fechaTermino: e.target.value })} />
          <Input label="Jornada semanal (hrs)" type="number" value={form.jornadaSemanal} onChange={(e) => setForm({ ...form, jornadaSemanal: e.target.value })} />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Detalle del contrato"
        size="lg"
      >
        {selectedContrato && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-[#6B7280]">Trabajador:</span> <span className="font-medium text-[#111827]">{selectedContrato.trabajador ? `${selectedContrato.trabajador.nombre} ${selectedContrato.trabajador.apellidoPaterno}` : '-'}</span></div>
            <div><span className="text-[#6B7280]">Tipo:</span> <span className="font-medium text-[#111827]">{TIPO_CONTRATO.find((t) => t.value === selectedContrato.tipo)?.label || selectedContrato.tipo}</span></div>
            <div><span className="text-[#6B7280]">Cargo:</span> <span className="font-medium text-[#111827]">{selectedContrato.cargo}</span></div>
            <div><span className="text-[#6B7280]">Sueldo base:</span> <span className="font-medium text-[#111827]">{formatCLP(selectedContrato.sueldoBase)}</span></div>
            <div><span className="text-[#6B7280]">Inicio:</span> <span className="font-medium text-[#111827]">{formatDate(selectedContrato.fechaInicio)}</span></div>
            <div><span className="text-[#6B7280]">Termino:</span> <span className="font-medium text-[#111827]">{formatDate(selectedContrato.fechaTermino) || 'Indefinido'}</span></div>
            <div><span className="text-[#6B7280]">Estado:</span> {estadoBadge(selectedContrato.estado)}</div>
            <div><span className="text-[#6B7280]">Jornada:</span> <span className="font-medium text-[#111827]">{selectedContrato.jornadaSemanal} hrs/semana</span></div>
          </div>
        )}
      </Modal>
    </div>
  )
}
