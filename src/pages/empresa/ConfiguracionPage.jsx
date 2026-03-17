import { useState, useEffect } from 'react'
import { Save, UserPlus } from 'lucide-react'
import { apiClient } from '../../api/client'
import { REGIONES } from '../../lib/constants'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { roleLabel } from '../../lib/utils'

export default function ConfiguracionPage() {
  const [empresa, setEmpresa] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    razonSocial: '', rut: '', giro: '', direccion: '', comuna: '', region: '', email: '',
  })
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState({ email: '', nombre: '', password: '', role: 'ADMIN' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eRes, uRes] = await Promise.all([
          apiClient.get('/api/empresa'),
          apiClient.get('/api/empresa/usuarios'),
        ])
        if (eRes.success) {
          setEmpresa(eRes.data)
          setForm({
            razonSocial: eRes.data.razonSocial || '',
            rut: eRes.data.rut || '',
            giro: eRes.data.giro || '',
            direccion: eRes.data.direccion || '',
            comuna: eRes.data.comuna || '',
            region: eRes.data.region || '',
            email: eRes.data.email || '',
          })
        }
        if (uRes.success) setUsuarios(uRes.data)
      } catch {
        setError('Error de conexion')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await apiClient.put('/api/empresa', form)
      if (res.success) {
        setSuccess('Configuracion guardada')
        setEmpresa(res.data)
      } else {
        setError(res.error || 'Error al guardar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleInvite = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.post('/api/empresa/usuarios', inviteForm)
      if (res.success) {
        setInviteOpen(false)
        setInviteForm({ email: '', nombre: '', password: '', role: 'ADMIN' })
        const uRes = await apiClient.get('/api/empresa/usuarios')
        if (uRes.success) setUsuarios(uRes.data)
      } else {
        setError(res.error || 'Error al invitar')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const userColumns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Rol',
      render: (val) => <Badge variant="info">{roleLabel(val)}</Badge>,
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (val) => <Badge variant={val !== false ? 'success' : 'neutral'}>{val !== false ? 'Activo' : 'Inactivo'}</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#111827]">Configuracion</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Company Settings */}
      <Card title="Datos de la empresa">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Razon Social" value={form.razonSocial} onChange={(e) => setForm({ ...form, razonSocial: e.target.value })} />
          <Input label="RUT" value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} />
          <Input label="Giro" value={form.giro} onChange={(e) => setForm({ ...form, giro: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Direccion" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          <Input label="Comuna" value={form.comuna} onChange={(e) => setForm({ ...form, comuna: e.target.value })} />
          <Select
            label="Region"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            options={REGIONES.map((r) => ({ value: r, label: r }))}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4" />
            Guardar cambios
          </Button>
        </div>
      </Card>

      {/* Users */}
      <Card title="Usuarios">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <UserPlus className="w-4 h-4" />
              Invitar usuario
            </Button>
          </div>
          <Table columns={userColumns} data={usuarios} emptyMessage="No hay usuarios" />
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invitar usuario"
        footer={
          <>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancelar</Button>
            <Button onClick={handleInvite} loading={saving}>Invitar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nombre" value={inviteForm.nombre} onChange={(e) => setInviteForm({ ...inviteForm, nombre: e.target.value })} required />
          <Input label="Email" type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} required />
          <Input label="Contrasena" type="password" value={inviteForm.password} onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })} required />
          <Select
            label="Rol"
            value={inviteForm.role}
            onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
            options={[
              { value: 'ADMIN', label: 'Administrador' },
              { value: 'WORKER', label: 'Trabajador' },
            ]}
          />
        </div>
      </Modal>
    </div>
  )
}
