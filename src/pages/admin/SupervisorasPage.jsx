import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, ToggleLeft, ToggleRight, Building2 } from 'lucide-react'
import { get, post, put } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'

export default function SupervisorasPage() {
  const [supervisoras, setSupervisoras] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const [editing, setEditing] = useState(null)
  const [assignTarget, setAssignTarget] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState('')
  const [allEmpresas, setAllEmpresas] = useState([])
  const [selectedEmpresas, setSelectedEmpresas] = useState([])
  const [assignSaving, setAssignSaving] = useState(false)

  const fetchSupervisoras = useCallback(async () => {
    setLoading(true)
    try {
      const res = await get('/api/admin/supervisoras')
      if (res.success) setSupervisoras(res.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSupervisoras()
  }, [fetchSupervisoras])

  const openCreate = () => {
    setEditing(null)
    setForm({ nombre: '', email: '', password: '' })
    setModalError('')
    setShowModal(true)
  }

  const openEdit = (sup) => {
    setEditing(sup)
    setForm({ nombre: sup.nombre || '', email: sup.email || '', password: '' })
    setModalError('')
    setShowModal(true)
  }

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    setModalError('')
    try {
      if (editing) {
        const body = { nombre: form.nombre, email: form.email }
        if (form.password) body.password = form.password
        await put(`/api/admin/supervisoras/${editing.id}`, body)
      } else {
        await post('/api/admin/supervisoras', form)
      }
      setShowModal(false)
      fetchSupervisoras()
    } catch (err) {
      setModalError(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (sup) => {
    try {
      await post(`/api/admin/supervisoras/${sup.id}/toggle`)
      fetchSupervisoras()
    } catch (err) {
      setError(err.message)
    }
  }

  const openAssign = async (sup) => {
    setAssignTarget(sup)
    setSelectedEmpresas(sup.empresas?.map((e) => e.id) || [])
    setModalError('')
    try {
      const res = await get('/api/admin/empresas?limit=1000')
      if (res.success) setAllEmpresas(res.data.empresas || [])
    } catch (err) {
      setModalError(err.message)
    }
    setShowAssign(true)
  }

  const toggleEmpresaSelection = (empresaId) => {
    setSelectedEmpresas((prev) =>
      prev.includes(empresaId)
        ? prev.filter((id) => id !== empresaId)
        : [...prev, empresaId]
    )
  }

  const handleAssign = async () => {
    setAssignSaving(true)
    setModalError('')
    try {
      await post(`/api/admin/supervisoras/${assignTarget.id}/empresas`, {
        empresaIds: selectedEmpresas,
      })
      setShowAssign(false)
      fetchSupervisoras()
    } catch (err) {
      setModalError(err.message || 'Error al asignar')
    } finally {
      setAssignSaving(false)
    }
  }

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    {
      key: 'activo',
      label: 'Activo',
      render: (val, row) => (
        <button
          onClick={() => handleToggle(row)}
          className="text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          {val ? (
            <ToggleRight className="w-6 h-6 text-[#059669]" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-[#6B7280]" />
          )}
        </button>
      ),
    },
    {
      key: 'empresas',
      label: 'Empresas',
      render: (val) => val?.length || 0,
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#2563EB] transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => openAssign(row)}
            className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#2563EB] transition-colors"
            title="Asignar empresas"
          >
            <Building2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Supervisoras</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Nueva Supervisora
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <Table
        columns={columns}
        data={supervisoras}
        loading={loading}
        emptyTitle="Sin supervisoras"
        emptyDescription="No hay supervisoras registradas."
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Editar Supervisora' : 'Nueva Supervisora'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? 'Guardar' : 'Crear'}</Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}
        <div className="space-y-4">
          <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleFormChange} required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleFormChange} required />
          <Input
            label={editing ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
            name="password"
            type="password"
            value={form.password}
            onChange={handleFormChange}
            required={!editing}
          />
        </div>
      </Modal>

      <Modal
        isOpen={showAssign}
        onClose={() => setShowAssign(false)}
        title={`Asignar Empresas - ${assignTarget?.nombre || ''}`}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAssign(false)}>Cancelar</Button>
            <Button onClick={handleAssign} loading={assignSaving}>Guardar Asignación</Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {allEmpresas.length === 0 && (
            <p className="text-sm text-[#6B7280]">No hay empresas disponibles.</p>
          )}
          {allEmpresas.map((empresa) => (
            <label
              key={empresa.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedEmpresas.includes(empresa.id)}
                onChange={() => toggleEmpresaSelection(empresa.id)}
                className="rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]"
              />
              <div>
                <p className="text-sm font-medium text-[#111827]">{empresa.razonSocial}</p>
                <p className="text-xs text-[#6B7280]">{empresa.rut}</p>
              </div>
            </label>
          ))}
        </div>
      </Modal>
    </div>
  )
}
