import { useState, useEffect } from 'react'
import { Save, Plus, UserPlus } from 'lucide-react'
import { apiClient } from '../../api/client'
import { REGIONES } from '../../lib/constants'
import { roleLabel } from '../../lib/utils'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

const initialUserForm = {
  email: '',
  nombre: '',
  role: 'ADMIN',
}

export default function ConfiguracionPage() {
  const [empresa, setEmpresa] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userForm, setUserForm] = useState(initialUserForm)
  const [savingUser, setSavingUser] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [empRes, usrRes] = await Promise.all([
        apiClient.get('/api/empresa'),
        apiClient.get('/api/empresa/usuarios'),
      ])
      if (empRes.success) {
        setEmpresa(empRes.data)
      } else {
        setError(empRes.error || 'Error al cargar datos de empresa')
      }
      if (usrRes.success) {
        setUsuarios(Array.isArray(usrRes.data) ? usrRes.data : [])
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleEmpresaChange = (e) => {
    setEmpresa({ ...empresa, [e.target.name]: e.target.value })
  }

  const handleSaveEmpresa = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      const result = await apiClient.put('/api/empresa', empresa)
      if (result.success) {
        setSuccess('Datos de empresa actualizados correctamente')
      } else {
        setError(result.error || 'Error al guardar')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleUserChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value })
  }

  const handleInviteUser = async (e) => {
    e.preventDefault()
    try {
      setSavingUser(true)
      setError(null)
      const result = await apiClient.post('/api/empresa/usuarios', userForm)
      if (result.success) {
        setShowUserModal(false)
        setUserForm(initialUserForm)
        fetchData()
      } else {
        setError(result.error || 'Error al invitar usuario')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSavingUser(false)
    }
  }

  const regionOptions = Array.isArray(REGIONES)
    ? REGIONES.map((r) => ({ value: r, label: r }))
    : Object.entries(REGIONES).map(([value, label]) => ({ value, label }))

  const userColumns = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Rol',
      accessor: (row) => (
        <Badge variant="default">{roleLabel(row.role)}</Badge>
      ),
    },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={row.activo ? 'success' : 'default'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ]

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#111827]">Configuración</h1>

      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[#111827] mb-4">Datos de la Empresa</h2>
        {empresa && (
          <form onSubmit={handleSaveEmpresa} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Razón Social" name="razonSocial" value={empresa.razonSocial || ''} onChange={handleEmpresaChange} required />
              <Input label="RUT" name="rut" value={empresa.rut || ''} onChange={handleEmpresaChange} required />
              <Input label="Giro" name="giro" value={empresa.giro || ''} onChange={handleEmpresaChange} />
              <Input label="Dirección" name="direccion" value={empresa.direccion || ''} onChange={handleEmpresaChange} />
              <Input label="Comuna" name="comuna" value={empresa.comuna || ''} onChange={handleEmpresaChange} />
              <Select label="Región" name="region" value={empresa.region || ''} onChange={handleEmpresaChange} options={regionOptions} />
              <Input label="Email" name="email" type="email" value={empresa.email || ''} onChange={handleEmpresaChange} />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" loading={saving}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </form>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#111827]">Usuarios</h2>
          <Button onClick={() => { setUserForm(initialUserForm); setShowUserModal(true) }} size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Invitar Usuario
          </Button>
        </div>

        <Table columns={userColumns} data={usuarios} emptyMessage="No hay usuarios registrados" />
      </Card>

      <Modal open={showUserModal} onClose={() => setShowUserModal(false)} title="Invitar Usuario">
        <form onSubmit={handleInviteUser} className="space-y-4">
          <Input label="Nombre" name="nombre" value={userForm.nombre} onChange={handleUserChange} required />
          <Input label="Email" name="email" type="email" value={userForm.email} onChange={handleUserChange} required />
          <Select
            label="Rol"
            name="role"
            value={userForm.role}
            onChange={handleUserChange}
            options={[
              { value: 'ADMIN', label: 'Administrador' },
              { value: 'CONTADOR', label: 'Contador' },
              { value: 'RRHH', label: 'Recursos Humanos' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowUserModal(false)}>Cancelar</Button>
            <Button type="submit" loading={savingUser}>Enviar Invitación</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
