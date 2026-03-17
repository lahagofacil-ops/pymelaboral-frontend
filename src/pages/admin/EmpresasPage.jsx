import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, LogIn, ToggleLeft, ToggleRight } from 'lucide-react'
import { get, post, put } from '../../api/client'
import { useEmpresa } from '../../hooks/useEmpresa'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatRut } from '../../lib/formatters'
import { REGIONES_CHILE } from '../../lib/constants'

const planOptions = [
  { value: 'FREE', label: 'Gratuito' },
  { value: 'STARTER', label: 'Starter' },
  { value: 'PRO', label: 'Profesional' },
  { value: 'ENTERPRISE', label: 'Empresa' },
]

const emptyForm = {
  rut: '',
  razonSocial: '',
  nombreFantasia: '',
  giro: '',
  direccion: '',
  comuna: '',
  region: '',
  telefono: '',
  email: '',
  plan: 'STARTER',
  representanteLegal: '',
  representanteRut: '',
  ownerEmail: '',
  ownerPassword: '',
  ownerNombre: '',
}

export default function EmpresasPage() {
  const navigate = useNavigate()
  const { startImpersonation } = useEmpresa()
  const [empresas, setEmpresas] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchEmpresas = useCallback(async () => {
    setLoading(true)
    try {
      const res = await get(`/api/admin/empresas?search=${encodeURIComponent(search)}&page=${page}&limit=20`)
      if (res.success) {
        setEmpresas(res.data.empresas || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => {
    fetchEmpresas()
  }, [fetchEmpresas])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setModalError('')
    setShowModal(true)
  }

  const openEdit = (empresa) => {
    setEditing(empresa)
    setForm({
      rut: empresa.rut || '',
      razonSocial: empresa.razonSocial || '',
      nombreFantasia: empresa.nombreFantasia || '',
      giro: empresa.giro || '',
      direccion: empresa.direccion || '',
      comuna: empresa.comuna || '',
      region: empresa.region || '',
      telefono: empresa.telefono || '',
      email: empresa.email || '',
      plan: empresa.plan || 'STARTER',
      representanteLegal: empresa.representanteLegal || '',
      representanteRut: empresa.representanteRut || '',
      ownerEmail: '',
      ownerPassword: '',
      ownerNombre: '',
    })
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
        const { ownerEmail, ownerPassword, ownerNombre, ...empresaData } = form
        await put(`/api/admin/empresas/${editing.id}`, empresaData)
      } else {
        await post('/api/admin/empresas', form)
      }
      setShowModal(false)
      fetchEmpresas()
    } catch (err) {
      setModalError(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (empresa) => {
    try {
      await post(`/api/admin/empresas/${empresa.id}/toggle`)
      fetchEmpresas()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleImpersonate = (empresa) => {
    startImpersonation(empresa.id, empresa)
    navigate('/empresa/dashboard')
  }

  const regionOptions = REGIONES_CHILE.map((r) => ({ value: r, label: r }))

  const columns = [
    { key: 'razonSocial', label: 'Razón Social' },
    {
      key: 'rut',
      label: 'RUT',
      render: (val) => formatRut(val),
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (val) => <Badge variant="info">{val}</Badge>,
    },
    {
      key: 'activo',
      label: 'Activo',
      render: (val, row) => (
        <button
          onClick={() => handleToggle(row)}
          className="text-[#6B7280] hover:text-[#111827] transition-colors"
          title={val ? 'Desactivar' : 'Activar'}
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
      key: 'trabajadoresCount',
      label: 'Trabajadores',
      render: (val) => val || 0,
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
            onClick={() => handleImpersonate(row)}
            className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#2563EB] transition-colors"
            title="Entrar como empresa"
          >
            <LogIn className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Empresas</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Nueva Empresa
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="mb-4">
        <Input
          name="search"
          placeholder="Buscar por razón social o RUT..."
          icon={Search}
          value={search}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>

      <Table
        columns={columns}
        data={empresas}
        loading={loading}
        emptyTitle="Sin empresas"
        emptyDescription="No se encontraron empresas."
        pagination={pagination}
        onPageChange={setPage}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Editar Empresa' : 'Nueva Empresa'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editing ? 'Guardar Cambios' : 'Crear Empresa'}
            </Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="RUT Empresa" name="rut" value={form.rut} onChange={handleFormChange} required placeholder="12345678-9" />
          <Input label="Razón Social" name="razonSocial" value={form.razonSocial} onChange={handleFormChange} required />
          <Input label="Nombre Fantasía" name="nombreFantasia" value={form.nombreFantasia} onChange={handleFormChange} />
          <Input label="Giro" name="giro" value={form.giro} onChange={handleFormChange} />
          <Input label="Dirección" name="direccion" value={form.direccion} onChange={handleFormChange} />
          <Input label="Comuna" name="comuna" value={form.comuna} onChange={handleFormChange} />
          <Select label="Región" name="region" value={form.region} onChange={handleFormChange} options={regionOptions} />
          <Input label="Teléfono" name="telefono" value={form.telefono} onChange={handleFormChange} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleFormChange} />
          <Select label="Plan" name="plan" value={form.plan} onChange={handleFormChange} options={planOptions} />
          <Input label="Representante Legal" name="representanteLegal" value={form.representanteLegal} onChange={handleFormChange} />
          <Input label="RUT Representante" name="representanteRut" value={form.representanteRut} onChange={handleFormChange} />
        </div>
        {!editing && (
          <>
            <h3 className="text-sm font-semibold text-[#111827] mt-6 mb-3">Usuario Propietario</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email" name="ownerEmail" type="email" value={form.ownerEmail} onChange={handleFormChange} required />
              <Input label="Contraseña" name="ownerPassword" type="password" value={form.ownerPassword} onChange={handleFormChange} required />
              <Input label="Nombre" name="ownerNombre" value={form.ownerNombre} onChange={handleFormChange} required />
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
