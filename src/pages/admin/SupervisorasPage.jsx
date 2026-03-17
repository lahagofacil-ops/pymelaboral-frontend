import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, ToggleLeft, ToggleRight, Building2 } from 'lucide-react'
import { apiClient } from '../../api/client'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'

const emptyForm = { nombre: '', email: '', password: '' }

export default function SupervisorasPage() {
  const [supervisoras, setSupervisoras] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [selectedSupervisora, setSelectedSupervisora] = useState(null)
  const [selectedEmpresas, setSelectedEmpresas] = useState([])

  const fetchData = useCallback(async () => {
    try {
      const [supRes, empRes] = await Promise.all([
        apiClient.get('/api/admin/supervisoras'),
        apiClient.get('/api/admin/empresas'),
      ])
      if (supRes.success) setSupervisoras(supRes.data)
      if (empRes.success) setEmpresas(empRes.data)
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleOpenNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const handleEdit = (sup) => {
    setEditingId(sup.id)
    setForm({ nombre: sup.nombre || '', email: sup.email || '', password: '' })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      let res
      if (editingId) {
        const body = { nombre: form.nombre, email: form.email }
        if (form.password) body.password = form.password
        res = await apiClient.put(`/api/admin/supervisoras/${editingId}`, body)
      } else {
        res = await apiClient.post('/api/admin/supervisoras', form)
      }
      if (res.success) {
        setModalOpen(false)
        await fetchData()
      } else {
        setError(res.error || 'Error al guardar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (sup) => {
    try {
      const res = await apiClient.put(`/api/admin/supervisoras/${sup.id}/toggle`)
      if (res.success) {
        await fetchData()
      }
    } catch {
      setError('Error de conexion')
    }
  }

  const handleOpenAssign = (sup) => {
    setSelectedSupervisora(sup)
    const assigned = sup.empresas?.map((e) => e.id) || sup.empresaIds || []
    setSelectedEmpresas(assigned)
    setAssignOpen(true)
  }

  const handleToggleEmpresa = (id) => {
    setSelectedEmpresas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSaveAssign = async () => {
    setSaving(true)
    try {
      const res = await apiClient.put(
        `/api/admin/supervisoras/${selectedSupervisora.id}/empresas`,
        { empresaIds: selectedEmpresas }
      )
      if (res.success) {
        setAssignOpen(false)
        await fetchData()
      } else {
        setError(res.error || 'Error al asignar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    {
      key: '_empresas',
      label: 'Empresas',
      render: (_, row) => row.empresas?.length ?? row.empresasCount ?? 0,
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (val) => (
        <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Activa' : 'Inactiva'}</Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleOpenAssign(row)}
            className="p-1.5 rounded-lg text-[#2563EB] hover:bg-blue-50 transition-colors"
            title="Asignar empresas"
          >
            <Building2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggle(row)}
            className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 transition-colors"
            title={row.activo ? 'Desactivar' : 'Activar'}
          >
            {row.activo ? <ToggleRight className="w-4 h-4 text-[#059669]" /> : <ToggleLeft className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Supervisoras</h1>
        <Button onClick={handleOpenNew}>
          <Plus className="w-4 h-4" />
          Nueva supervisora
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Table columns={columns} data={supervisoras} loading={loading} emptyMessage="No hay supervisoras" />

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar supervisora' : 'Nueva supervisora'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label={editingId ? 'Nueva contrasena (dejar vacio para no cambiar)' : 'Contrasena'}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editingId}
          />
        </div>
      </Modal>

      {/* Assign Empresas Modal */}
      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title={`Asignar empresas a ${selectedSupervisora?.nombre || ''}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveAssign} loading={saving}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {empresas.length === 0 && (
            <p className="text-sm text-[#6B7280]">No hay empresas disponibles</p>
          )}
          {empresas.map((emp) => (
            <label
              key={emp.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedEmpresas.includes(emp.id)}
                onChange={() => handleToggleEmpresa(emp.id)}
                className="w-4 h-4 text-[#2563EB] rounded border-[#E5E7EB] focus:ring-[#2563EB]"
              />
              <span className="text-sm text-[#111827]">{emp.razonSocial}</span>
            </label>
          ))}
        </div>
      </Modal>
    </div>
  )
}
