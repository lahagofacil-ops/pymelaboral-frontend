import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, LogIn, ToggleLeft, ToggleRight } from 'lucide-react'
import { apiClient } from '../../api/client'
import { useEmpresa } from '../../context/EmpresaContext'
import { formatRut } from '../../lib/utils'
import { PLANS, REGIONES } from '../../lib/constants'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

const emptyForm = {
  razonSocial: '', rut: '', giro: '', direccion: '', comuna: '', region: '',
  plan: 'starter', email: '', ownerEmail: '', ownerNombre: '', ownerPassword: '',
}

export default function EmpresasPage() {
  const navigate = useNavigate()
  const { enterEmpresa } = useEmpresa()
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchEmpresas = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/admin/empresas')
      if (res.success) {
        setEmpresas(res.data)
      } else {
        setError(res.error || 'Error al cargar empresas')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmpresas()
  }, [fetchEmpresas])

  const handleOpenNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const handleEdit = (empresa) => {
    setEditingId(empresa.id)
    setForm({
      razonSocial: empresa.razonSocial || '',
      rut: empresa.rut || '',
      giro: empresa.giro || '',
      direccion: empresa.direccion || '',
      comuna: empresa.comuna || '',
      region: empresa.region || '',
      plan: empresa.plan || 'starter',
      email: empresa.email || '',
      ownerEmail: '',
      ownerNombre: '',
      ownerPassword: '',
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      let res
      if (editingId) {
        res = await apiClient.put(`/api/admin/empresas/${editingId}`, form)
      } else {
        res = await apiClient.post('/api/admin/empresas', form)
      }
      if (res.success) {
        setModalOpen(false)
        await fetchEmpresas()
      } else {
        setError(res.error || 'Error al guardar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (empresa) => {
    try {
      const res = await apiClient.put(`/api/admin/empresas/${empresa.id}/toggle`)
      if (res.success) {
        await fetchEmpresas()
      } else {
        setError(res.error || 'Error al cambiar estado')
      }
    } catch {
      setError('Error de conexion')
    }
  }

  const handleEntrar = (empresa) => {
    enterEmpresa(empresa.id, empresa.razonSocial)
    navigate('/empresa')
  }

  const filtered = empresas.filter((e) =>
    (e.razonSocial || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.rut || '').includes(search)
  )

  const columns = [
    { key: 'razonSocial', label: 'Razon Social' },
    {
      key: 'rut',
      label: 'RUT',
      render: (val) => formatRut(val),
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (val) => (
        <Badge variant="info">{(val || '').charAt(0).toUpperCase() + (val || '').slice(1)}</Badge>
      ),
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (val) => (
        <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Activo' : 'Inactivo'}</Badge>
      ),
    },
    {
      key: '_trabajadores',
      label: 'Trabajadores',
      render: (_, row) => row.trabajadoresCount ?? row._count?.trabajadores ?? 0,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEntrar(row)}
            className="p-1.5 rounded-lg text-[#2563EB] hover:bg-blue-50 transition-colors"
            title="Entrar"
          >
            <LogIn className="w-4 h-4" />
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
        <h1 className="text-2xl font-bold text-[#111827]">Empresas</h1>
        <Button onClick={handleOpenNew}>
          <Plus className="w-4 h-4" />
          Nueva empresa
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Input
        icon={Search}
        placeholder="Buscar por nombre o RUT..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table columns={columns} data={filtered} loading={loading} emptyMessage="No hay empresas" />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar empresa' : 'Nueva empresa'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>Guardar</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Razon Social"
            value={form.razonSocial}
            onChange={(e) => setForm({ ...form, razonSocial: e.target.value })}
            required
          />
          <Input
            label="RUT"
            value={form.rut}
            onChange={(e) => setForm({ ...form, rut: e.target.value })}
            placeholder="12345678-9"
          />
          <Input
            label="Giro"
            value={form.giro}
            onChange={(e) => setForm({ ...form, giro: e.target.value })}
          />
          <Input
            label="Email empresa"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Direccion"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
          <Input
            label="Comuna"
            value={form.comuna}
            onChange={(e) => setForm({ ...form, comuna: e.target.value })}
          />
          <Select
            label="Region"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            options={REGIONES.map((r) => ({ value: r, label: r }))}
          />
          <Select
            label="Plan"
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value })}
            options={PLANS.map((p) => ({ value: p.id, label: p.name }))}
          />
          {!editingId && (
            <>
              <div className="col-span-full">
                <p className="text-sm font-medium text-[#6B7280] mb-2">Datos del propietario</p>
              </div>
              <Input
                label="Nombre propietario"
                value={form.ownerNombre}
                onChange={(e) => setForm({ ...form, ownerNombre: e.target.value })}
              />
              <Input
                label="Email propietario"
                type="email"
                value={form.ownerEmail}
                onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
              />
              <Input
                label="Contrasena propietario"
                type="password"
                value={form.ownerPassword}
                onChange={(e) => setForm({ ...form, ownerPassword: e.target.value })}
              />
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
