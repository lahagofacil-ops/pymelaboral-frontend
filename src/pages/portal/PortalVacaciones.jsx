import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { apiClient } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

const initialForm = {
  fechaDesde: '',
  fechaHasta: '',
  diasHabiles: '',
  observacion: '',
}

export default function PortalVacaciones() {
  const { user } = useAuth()
  const [vacaciones, setVacaciones] = useState([])
  const [saldo, setSaldo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get('/api/vacaciones')
      if (result.success) {
        setVacaciones(result.data.vacaciones || [])
      } else {
        setError(result.error || 'Error al cargar vacaciones')
      }

      if (user?.trabajadorId) {
        const saldoRes = await apiClient.get(`/api/vacaciones/saldo/${user.trabajadorId}`)
        if (saldoRes.success) {
          setSaldo(saldoRes.data)
        }
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      const payload = {
        ...form,
        diasHabiles: Number(form.diasHabiles),
        trabajadorId: user?.trabajadorId,
      }
      const result = await apiClient.post('/api/vacaciones', payload)
      if (result.success) {
        setShowModal(false)
        setForm(initialForm)
        fetchData()
      } else {
        setError(result.error || 'Error al solicitar vacaciones')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      header: 'Desde',
      accessor: (row) => formatDate(row.fechaDesde),
    },
    {
      header: 'Hasta',
      accessor: (row) => formatDate(row.fechaHasta),
    },
    { header: 'Días Hábiles', accessor: 'diasHabiles' },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={row.estado === 'APROBADA' ? 'success' : row.estado === 'RECHAZADA' ? 'danger' : 'warning'}>
          {row.estado}
        </Badge>
      ),
    },
  ]

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Mis Vacaciones</h1>
        <Button onClick={() => { setForm(initialForm); setShowModal(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Solicitar Vacaciones
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {saldo && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-sm text-[#6B7280]">Días Disponibles</p>
            <p className="text-2xl font-bold text-[#2563EB]">{saldo.diasDisponibles ?? saldo.disponibles ?? 0}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-[#6B7280]">Días Tomados</p>
            <p className="text-2xl font-bold text-[#111827]">{saldo.diasTomados ?? saldo.tomados ?? 0}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-[#6B7280]">Días Totales</p>
            <p className="text-2xl font-bold text-[#111827]">{saldo.diasTotales ?? saldo.total ?? 0}</p>
          </Card>
        </div>
      )}

      <Table columns={columns} data={vacaciones} emptyMessage="No tienes solicitudes de vacaciones" />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Solicitar Vacaciones">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Fecha Desde" name="fechaDesde" type="date" value={form.fechaDesde} onChange={handleChange} required />
          <Input label="Fecha Hasta" name="fechaHasta" type="date" value={form.fechaHasta} onChange={handleChange} required />
          <Input label="Días Hábiles" name="diasHabiles" type="number" value={form.diasHabiles} onChange={handleChange} required />
          <Input label="Observación" name="observacion" value={form.observacion} onChange={handleChange} />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Enviar Solicitud</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
