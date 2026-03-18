import { useState, useEffect } from 'react'
import { Plus, Eye } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

const initialForm = {
  trabajadorId: '',
  tipo: 'INDEFINIDO',
  cargo: '',
  sueldoBase: '',
  horasSemanales: '45',
  fechaInicio: '',
  fechaTermino: '',
}

export default function ContratosPage() {
  const [contratos, setContratos] = useState([])
  const [trabajadores, setTrabajadores] = useState([])
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
      const [contratosRes, trabajadoresRes] = await Promise.all([
        apiClient.get('/api/contratos'),
        apiClient.get('/api/trabajadores'),
      ])
      if (contratosRes.success) {
        setContratos(Array.isArray(contratosRes.data) ? contratosRes.data : [])
      } else {
        setError(contratosRes.error || 'Error al cargar contratos')
      }
      if (trabajadoresRes.success) {
        setTrabajadores(Array.isArray(trabajadoresRes.data) ? trabajadoresRes.data : [])
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setForm(initialForm)
    setShowModal(true)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = { ...form, sueldoBase: Number(form.sueldoBase), horasSemanales: Number(form.horasSemanales) }
      const result = await apiClient.post('/api/contratos', payload)
      if (result.success) {
        setShowModal(false)
        fetchData()
      } else {
        setError(result.error || 'Error al crear contrato')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      header: 'Trabajador',
      accessor: (row) => row.trabajador ? `${row.trabajador.nombre} ${row.trabajador.apellidoPaterno}` : '—',
    },
    { header: 'Tipo', accessor: 'tipo' },
    { header: 'Cargo', accessor: 'cargo' },
    {
      header: 'Sueldo Base',
      accessor: (row) => formatCLP(row.sueldoBase),
    },
    { header: 'Horas Semanales', accessor: 'horasSemanales' },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={row.estado === 'VIGENTE' ? 'success' : 'default'}>
          {row.estado}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Contratos</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Contrato
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Table columns={columns} data={contratos} emptyMessage="No hay contratos registrados" />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo Contrato">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Trabajador"
            name="trabajadorId"
            value={form.trabajadorId}
            onChange={handleChange}
            required
            options={trabajadores.map((t) => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))}
          />
          <Select
            label="Tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            options={[
              { value: 'INDEFINIDO', label: 'Indefinido' },
              { value: 'PLAZO_FIJO', label: 'Plazo Fijo' },
              { value: 'POR_OBRA', label: 'Por Obra o Faena' },
            ]}
          />
          <Input label="Cargo" name="cargo" value={form.cargo} onChange={handleChange} required />
          <Input label="Sueldo Base" name="sueldoBase" type="number" value={form.sueldoBase} onChange={handleChange} required />
          <Input label="Horas Semanales" name="horasSemanales" type="number" value={form.horasSemanales} onChange={handleChange} />
          <Input label="Fecha Inicio" name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleChange} required />
          <Input label="Fecha Término" name="fechaTermino" type="date" value={form.fechaTermino} onChange={handleChange} />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Crear Contrato</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
