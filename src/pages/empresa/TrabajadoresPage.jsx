import { useState, useEffect } from 'react'
import { Plus, Pencil } from 'lucide-react'
import { apiClient } from '../../api/client'
import { AFPS } from '../../lib/constants'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

const initialForm = {
  rut: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  fechaNacimiento: '',
  sexo: '',
  nacionalidad: 'Chilena',
  afp: '',
  salud: '',
  fechaIngreso: '',
  estado: 'ACTIVO',
}

export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchTrabajadores()
  }, [])

  const fetchTrabajadores = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get('/api/trabajadores')
      if (result.success) {
        setTrabajadores(Array.isArray(result.data) ? result.data : [])
      } else {
        setError(result.error || 'Error al cargar trabajadores')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditing(null)
    setForm(initialForm)
    setShowModal(true)
  }

  const openEdit = (trabajador) => {
    setEditing(trabajador)
    setForm({
      rut: trabajador.rut || '',
      nombre: trabajador.nombre || '',
      apellidoPaterno: trabajador.apellidoPaterno || '',
      apellidoMaterno: trabajador.apellidoMaterno || '',
      fechaNacimiento: trabajador.fechaNacimiento?.split('T')[0] || '',
      sexo: trabajador.sexo || '',
      nacionalidad: trabajador.nacionalidad || 'Chilena',
      afp: trabajador.afp || '',
      salud: trabajador.salud || '',
      fechaIngreso: trabajador.fechaIngreso?.split('T')[0] || '',
      estado: trabajador.estado || 'ACTIVO',
    })
    setShowModal(true)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const result = editing
        ? await apiClient.put(`/api/trabajadores/${editing.id}`, form)
        : await apiClient.post('/api/trabajadores', form)
      if (result.success) {
        setShowModal(false)
        fetchTrabajadores()
      } else {
        setError(result.error || 'Error al guardar')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { header: 'RUT', accessor: 'rut' },
    {
      header: 'Nombre',
      accessor: (row) => `${row.nombre} ${row.apellidoPaterno}`,
    },
    {
      header: 'Cargo',
      accessor: (row) => row.contratos?.[0]?.cargo || '—',
    },
    { header: 'AFP', accessor: 'afp' },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={row.estado === 'ACTIVO' ? 'success' : 'default'}>
          {row.estado}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
          <Pencil className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Trabajadores</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Trabajador
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Table columns={columns} data={trabajadores} emptyMessage="No hay trabajadores registrados" />

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar Trabajador' : 'Nuevo Trabajador'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="RUT" name="rut" value={form.rut} onChange={handleChange} required />
          <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
          <Input label="Apellido Paterno" name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange} required />
          <Input label="Apellido Materno" name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange} />
          <Input label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} />
          <Select label="Sexo" name="sexo" value={form.sexo} onChange={handleChange} options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }]} />
          <Input label="Nacionalidad" name="nacionalidad" value={form.nacionalidad} onChange={handleChange} />
          <Select label="AFP" name="afp" value={form.afp} onChange={handleChange} options={AFPS.map((a) => ({ value: a, label: a }))} />
          <Input label="Salud (Isapre/Fonasa)" name="salud" value={form.salud} onChange={handleChange} />
          <Input label="Fecha de Ingreso" name="fechaIngreso" type="date" value={form.fechaIngreso} onChange={handleChange} required />
          <Select label="Estado" name="estado" value={form.estado} onChange={handleChange} options={[{ value: 'ACTIVO', label: 'Activo' }, { value: 'INACTIVO', label: 'Inactivo' }, { value: 'DESVINCULADO', label: 'Desvinculado' }]} />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
