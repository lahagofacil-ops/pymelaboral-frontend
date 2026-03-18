import { useState, useEffect } from 'react'
import { Plus, Pencil, ToggleLeft, ToggleRight, Building2, X } from 'lucide-react'
import { apiClient } from '../../api/client'

const emptyForm = { nombre: '', email: '', password: '' }

export default function SupervisorasPage() {
  const [supervisoras, setSupervisoras] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [assigningId, setAssigningId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [selectedEmpresas, setSelectedEmpresas] = useState([])
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    try {
      const [supRes, empRes] = await Promise.all([
        apiClient.get('/api/admin/supervisoras'),
        apiClient.get('/api/admin/empresas')
      ])
      if (supRes.success) setSupervisoras(supRes.data)
      else setError(supRes.error || 'Error al cargar supervisoras')
      if (empRes.success) setEmpresas(empRes.data)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (sup) => {
    setEditingId(sup.id)
    setForm({ nombre: sup.nombre || '', email: sup.email || '', password: '' })
    setShowModal(true)
  }

  const openAssign = (sup) => {
    setAssigningId(sup.id)
    const currentIds = (sup.empresas || []).map((e) => e.id || e.empresaId)
    setSelectedEmpresas(currentIds)
    setShowAssignModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = { ...form }
      if (editingId && !body.password) delete body.password

      const res = editingId
        ? await apiClient.put(`/api/admin/supervisoras/${editingId}`, body)
        : await apiClient.post('/api/admin/supervisoras', body)

      if (res.success) {
        setShowModal(false)
        await fetchData()
      } else {
        alert(res.error || 'Error al guardar')
      }
    } catch {
      alert('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (id) => {
    try {
      const res = await apiClient.put(`/api/admin/supervisoras/${id}/toggle`)
      if (res.success) await fetchData()
      else alert(res.error || 'Error al cambiar estado')
    } catch {
      alert('Error de conexión')
    }
  }

  const handleAssign = async () => {
    setSaving(true)
    try {
      const res = await apiClient.put(`/api/admin/supervisoras/${assigningId}/empresas`, {
        empresaIds: selectedEmpresas
      })
      if (res.success) {
        setShowAssignModal(false)
        await fetchData()
      } else {
        alert(res.error || 'Error al asignar empresas')
      }
    } catch {
      alert('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const toggleEmpresaSelection = (id) => {
    setSelectedEmpresas((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    )
  }

  const onChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Supervisoras</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1E40AF] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nueva Supervisora
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#DC2626] rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#6B7280]">Nombre</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#6B7280]">Email</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#6B7280]">Empresas</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#6B7280]">Estado</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#6B7280]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {supervisoras.map((sup) => (
                <tr key={sup.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-[#111827]">{sup.nombre}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{sup.email}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">
                    {sup.empresas?.length ?? sup._count?.empresas ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${sup.activo ? 'bg-green-100 text-[#059669]' : 'bg-red-100 text-[#DC2626]'}`}>
                      {sup.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(sup)}
                        className="p-1 text-[#6B7280] hover:text-[#2563EB] transition-colors cursor-pointer" title="Editar">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleToggle(sup.id)}
                        className="p-1 text-[#6B7280] hover:text-[#D97706] transition-colors cursor-pointer"
                        title={sup.activo ? 'Desactivar' : 'Activar'}>
                        {sup.activo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openAssign(sup)}
                        className="p-1 text-[#6B7280] hover:text-[#059669] transition-colors cursor-pointer" title="Asignar empresas">
                        <Building2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {supervisoras.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-[#6B7280]">
                    No hay supervisoras registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-[#111827]">
                {editingId ? 'Editar Supervisora' : 'Nueva Supervisora'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:text-[#111827] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1">Nombre</label>
                <input type="text" value={form.nombre} onChange={onChange('nombre')} required
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1">Email</label>
                <input type="email" value={form.email} onChange={onChange('email')} required
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1">
                  Password {editingId && <span className="text-[#6B7280] font-normal">(dejar vacío para no cambiar)</span>}
                </label>
                <input type="password" value={form.password} onChange={onChange('password')}
                  required={!editingId}
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50 cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 text-sm text-white bg-[#2563EB] rounded-lg hover:bg-[#1E40AF] disabled:opacity-50 cursor-pointer">
                  {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Empresas Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-[#111827]">Asignar Empresas</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-[#6B7280] hover:text-[#111827] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {empresas.length === 0 && (
                <p className="text-sm text-[#6B7280]">No hay empresas disponibles</p>
              )}
              {empresas.map((emp) => (
                <label key={emp.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEmpresas.includes(emp.id)}
                    onChange={() => toggleEmpresaSelection(emp.id)}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span className="text-sm text-[#111827]">{emp.razonSocial}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ml-auto ${emp.activo ? 'bg-green-100 text-[#059669]' : 'bg-red-100 text-[#DC2626]'}`}>
                    {emp.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-[#E5E7EB]">
              <button onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50 cursor-pointer">
                Cancelar
              </button>
              <button onClick={handleAssign} disabled={saving}
                className="px-4 py-2 text-sm text-white bg-[#2563EB] rounded-lg hover:bg-[#1E40AF] disabled:opacity-50 cursor-pointer">
                {saving ? 'Guardando...' : 'Guardar Asignación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
