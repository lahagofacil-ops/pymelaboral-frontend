import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { apiClient } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Card from '../../components/ui/Card'

export default function PortalVacaciones() {
  const { user } = useAuth()
  const [vacaciones, setVacaciones] = useState([])
  const [saldo, setSaldo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ fechaDesde: '', fechaHasta: '', observacion: '' })
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [vRes, sRes] = await Promise.all([
        apiClient.get('/api/vacaciones'),
        user?.trabajadorId ? apiClient.get(`/api/vacaciones/saldo/${user.trabajadorId}`) : Promise.resolve({ success: false }),
      ])
      if (vRes.success) setVacaciones(vRes.data)
      if (sRes.success) setSaldo(sRes.data)
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [user?.trabajadorId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSolicitar = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.post('/api/vacaciones', form)
      if (res.success) {
        setModalOpen(false)
        setForm({ fechaDesde: '', fechaHasta: '', observacion: '' })
        await fetchData()
      } else {
        setError(res.error || 'Error al solicitar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const estadoBadge = (estado) => {
    const map = { APROBADA: 'success', PENDIENTE: 'warning', RECHAZADA: 'danger' }
    return <Badge variant={map[estado] || 'neutral'}>{estado || '-'}</Badge>
  }

  const columns = [
    { key: 'fechaDesde', label: 'Desde', render: (val) => formatDate(val) },
    { key: 'fechaHasta', label: 'Hasta', render: (val) => formatDate(val) },
    { key: 'diasHabiles', label: 'Dias' },
    { key: 'estado', label: 'Estado', render: (val) => estadoBadge(val) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Mis Vacaciones</h1>
        <Button onClick={() => { setForm({ fechaDesde: '', fechaHasta: '', observacion: '' }); setModalOpen(true) }}>
          <Plus className="w-4 h-4" />
          Solicitar vacaciones
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {saldo && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-[#6B7280]">Dias disponibles</p>
            <p className="text-2xl font-bold text-[#111827]">{saldo.diasDisponibles ?? saldo.disponibles ?? 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-[#6B7280]">Dias tomados</p>
            <p className="text-2xl font-bold text-[#111827]">{saldo.diasTomados ?? saldo.tomados ?? 0}</p>
          </Card>
          <Card>
            <p className="text-sm text-[#6B7280]">Dias totales</p>
            <p className="text-2xl font-bold text-[#111827]">{saldo.diasTotales ?? saldo.total ?? 15}</p>
          </Card>
        </div>
      )}

      <Table columns={columns} data={vacaciones} loading={loading} emptyMessage="No tienes solicitudes de vacaciones" />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Solicitar vacaciones"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSolicitar} loading={saving}>Solicitar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Desde" type="date" value={form.fechaDesde} onChange={(e) => setForm({ ...form, fechaDesde: e.target.value })} />
          <Input label="Hasta" type="date" value={form.fechaHasta} onChange={(e) => setForm({ ...form, fechaHasta: e.target.value })} />
          <Input label="Observacion" value={form.observacion} onChange={(e) => setForm({ ...form, observacion: e.target.value })} />
        </div>
      </Modal>
    </div>
  )
}
