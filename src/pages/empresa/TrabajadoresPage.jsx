import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatRut } from '../../lib/utils'
import { AFP_LIST, SALUD_LIST } from '../../lib/constants'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'

const emptyForm = {
  rut: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '',
  fechaNacimiento: '', sexo: '', nacionalidad: 'Chilena',
  afp: '', salud: '', fechaIngreso: '',
}

export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchTrabajadores = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/trabajadores')
      if (res.success) {
        setTrabajadores(res.data)
      } else {
        setError(res.error || 'Error al cargar trabajadores')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrabajadores()
  }, [fetchTrabajadores])

  const handleOpenNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const handleEdit = (t) => {
    setEditingId(t.id)
    setForm({
      rut: t.rut || '',
      nombre: t.nombre || '',
      apellidoPaterno: t.apellidoPaterno || '',
      apellidoMaterno: t.apellidoMaterno || '',
      fechaNacimiento: t.fechaNacimiento ? t.fechaNacimiento.split('T')[0] : '',
      sexo: t.sexo || '',
      nacionalidad: t.nacionalidad || 'Chilena',
      afp: t.afp || '',
      salud: t.salud || '',
      fechaIngreso: t.fechaIngreso ? t.fechaIngreso.split('T')[0] : '',
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      let res
      if (editingId) {
        res = await apiClient.put(`/api/trabajadores/${editingId}`, form)
      } else {
        res = await apiClient.post('/api/trabajadores', form)
      }
      if (res.success) {
        setModalOpen(false)
        await fetchTrabajadores()
      } else {
        setError(res.error || 'Error al guardar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Eliminar este trabajador?')) return
    try {
      const res = await apiClient.delete(`/api/trabajadores/${id}`)
      if (res.success) {
        await fetchTrabajadores()
      } else {
        setError(res.error || 'Error al eliminar')
      }
    } catch {
      setError('Error de conexion')
    }
  }

  const filtered = trabajadores.filter((t) => {
    const fullName = `${t.nombre} ${t.apellidoPaterno} ${t.apellidoMaterno}`.toLowerCase()
    return fullName.includes(search.toLowerCase()) || (t.rut || '').includes(search)
  })

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre completo',
      render: (_, row) => `${row.nombre} ${row.apellidoPaterno} ${row.apellidoMaterno || ''}`.trim(),
    },
    {
      key: 'rut',
      label: 'RUT',
      render: (val) => formatRut(val),
    },
    {
      key: 'cargo',
      label: 'Cargo',
      render: (_, row) => row.contratoActivo?.cargo || row.cargo || '-',
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val, row) => {
        const activo = row.activo !== false && row.estado !== 'INACTIVO'
        return (
          <Badge variant={activo ? 'success' : 'neutral'}>
            {activo ? 'Activo' : 'Inactivo'}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 rounded-lg text-[#DC2626] hover:bg-red-50 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Trabajadores</h1>
        <Button onClick={handleOpenNew}>
          <Plus className="w-4 h-4" />
          Nuevo trabajador
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Input
        icon={Search}
        placeholder="Buscar por nombre o RUT..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table columns={columns} data={filtered} loading={loading} emptyMessage="No hay trabajadores" />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar trabajador' : 'Nuevo trabajador'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>Guardar</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="RUT" value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} placeholder="12345678-9" />
          <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <Input label="Apellido paterno" value={form.apellidoPaterno} onChange={(e) => setForm({ ...form, apellidoPaterno: e.target.value })} required />
          <Input label="Apellido materno" value={form.apellidoMaterno} onChange={(e) => setForm({ ...form, apellidoMaterno: e.target.value })} />
          <Input label="Fecha nacimiento" type="date" value={form.fechaNacimiento} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} />
          <Select label="Sexo" value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }]} />
          <Input label="Nacionalidad" value={form.nacionalidad} onChange={(e) => setForm({ ...form, nacionalidad: e.target.value })} />
          <Select label="AFP" value={form.afp} onChange={(e) => setForm({ ...form, afp: e.target.value })} options={AFP_LIST.map((a) => ({ value: a, label: a }))} />
          <Select label="Salud" value={form.salud} onChange={(e) => setForm({ ...form, salud: e.target.value })} options={SALUD_LIST.map((s) => ({ value: s, label: s }))} />
          <Input label="Fecha ingreso" type="date" value={form.fechaIngreso} onChange={(e) => setForm({ ...form, fechaIngreso: e.target.value })} />
        </div>
      </Modal>
    </div>
  )
}
