import { useState, useEffect } from 'react'
import { Plus, Pencil, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { apiClient } from '../../api/client'

const REGIONES = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
  'Valparaíso', "O'Higgins", 'Maule', 'Ñuble', 'Biobío', 'Araucanía',
  'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes', 'Metropolitana'
]

const PLANES = ['STARTER', 'PROFESIONAL', 'BUSINESS']

const PLAN_COLORS = {
  STARTER: 'bg-blue-100 text-[#2563EB]',
  PROFESIONAL: 'bg-purple-100 text-purple-700',
  BUSINESS: 'bg-amber-100 text-amber-700'
}

const emptyForm = {
  razonSocial: '', rut: '', giro: '', direccion: '', comuna: '', region: '',
  email: '', plan: 'STARTER', ownerEmail: '', ownerNombre: '', ownerPassword: ''
}

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchEmpresas = async () => {
    try {
      const res = await apiClient.get('/api/admin/empresas')
      if (res.success) {
        const list = res.data?.empresas || res.data
        setEmpresas(Array.isArray(list) ? list : [])
      } else {
        setError(res.error || 'Error al cargar empresas')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEmpresas() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (empresa) => {
    setEditingId(empresa.id)
    setForm({
      razonSocial: empresa.razonSocial || '',
      rut: empresa.rut || '',
      giro: empresa.giro || '',
      direccion: empresa.direccion || '',
      comuna: empresa.comuna || '',
      region: empresa.region || '',
      email: empresa.email || '',
      plan: empresa.plan || 'STARTER',
      ownerEmail: '', ownerNombre: '', ownerPassword: ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let res
      if (editingId) {
        const { ownerEmail, ownerNombre, ownerPassword, ...editData } = form
        res = await apiClient.put(`/api/admin/empresas/${editingId}`, editData)
      } else {
        res = await apiClient.post('/api/admin/empresas', form)
      }
      if (res.success) {
        setShowModal(false)
        await fetchEmpresas()
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
      const res = await apiClient.put(`/api/admin/empresas/${id}/toggle`)
      if (res.success) {
        await fetchEmpresas()
      } else {
        alert(res.error || 'Error al cambiar estado')
      }
    } catch {
      alert('Error de conexión')
    }
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
        <h1 className="text-2xl font-bold text-[#111827]">Empresas</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1E40AF] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nueva Empresa
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
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#6B7280]">Razón Social</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#6B7280]">RUT</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#6B7280]">Plan</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#6B7280]">Estado</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#6B7280]">Trabajadores</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#6B7280]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {empresas.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-[#111827]">{emp.razonSocial}</td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{emp.rut}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${PLAN_COLORS[emp.plan] || 'bg-gray-100 text-gray-700'}`}>
                      {emp.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${emp.activo ? 'bg-green-100 text-[#059669]' : 'bg-red-100 text-[#DC2626]'}`}>
                      {emp.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{emp._count?.trabajadores ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(emp)}
                        className="p-1 text-[#6B7280] hover:text-[#2563EB] transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggle(emp.id)}
                        className="p-1 text-[#6B7280] hover:text-[#D97706] transition-colors cursor-pointer"
                        title={emp.activo ? 'Desactivar' : 'Activar'}
                      >
                        {emp.activo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {empresas.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#6B7280]">
                    No hay empresas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-[#111827]">
                {editingId ? 'Editar Empresa' : 'Nueva Empresa'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:text-[#111827] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Razón Social</label>
                  <input type="text" value={form.razonSocial} onChange={onChange('razonSocial')} required
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">RUT</label>
                  <input type="text" value={form.rut} onChange={onChange('rut')} required
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Giro</label>
                  <input type="text" value={form.giro} onChange={onChange('giro')}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Dirección</label>
                  <input type="text" value={form.direccion} onChange={onChange('direccion')}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Comuna</label>
                  <input type="text" value={form.comuna} onChange={onChange('comuna')}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Región</label>
                  <select value={form.region} onChange={onChange('region')}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    <option value="">Seleccionar...</option>
                    {REGIONES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Email</label>
                  <input type="email" value={form.email} onChange={onChange('email')}
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1">Plan</label>
                  <select value={form.plan} onChange={onChange('plan')} required
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]">
                    {PLANES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {!editingId && (
                <>
                  <hr className="border-[#E5E7EB]" />
                  <p className="text-sm font-medium text-[#6B7280]">Datos del Owner</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-1">Email Owner</label>
                      <input type="email" value={form.ownerEmail} onChange={onChange('ownerEmail')} required
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-1">Nombre Owner</label>
                      <input type="text" value={form.ownerNombre} onChange={onChange('ownerNombre')} required
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-1">Password Owner</label>
                      <input type="password" value={form.ownerPassword} onChange={onChange('ownerPassword')} required
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-gray-50 cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 text-sm text-white bg-[#2563EB] rounded-lg hover:bg-[#1E40AF] disabled:opacity-50 cursor-pointer">
                  {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
