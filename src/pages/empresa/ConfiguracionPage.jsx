import { useState, useEffect } from 'react'
import { Save, UserPlus, Link } from 'lucide-react'
import { get, put, post } from '../../api/client'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { REGIONES_CHILE } from '../../lib/constants'

const tabs = [
  { id: 'datos', label: 'Datos Empresa' },
  { id: 'laboral', label: 'Configuración Laboral' },
  { id: 'usuarios', label: 'Usuarios' },
]

const roleOptions = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'OWNER', label: 'Propietario' },
]

const gratificacionOptions = [
  { value: 'ARTICULO_50', label: 'Art. 50 (Proporcional)' },
  { value: 'ARTICULO_47', label: 'Art. 47 (Tope)' },
]

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState('datos')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Datos Empresa
  const [empresaForm, setEmpresaForm] = useState({
    razonSocial: '', nombreFantasia: '', rut: '', giro: '',
    direccion: '', comuna: '', region: '', telefono: '', email: '',
    representanteLegal: '', representanteRut: '',
  })

  // Config Laboral
  const [laboralForm, setLaboralForm] = useState({
    mutualidad: '', tasaMutual: '', sistemaGratificacion: '',
  })

  // Usuarios
  const [usuarios, setUsuarios] = useState([])
  const [loadingUsuarios, setLoadingUsuarios] = useState(false)
  const [inviteForm, setInviteForm] = useState({ email: '', nombre: '', role: 'ADMIN' })
  const [inviting, setInviting] = useState(false)
  const [vincularForm, setVincularForm] = useState({ userId: '', trabajadorId: '' })
  const [vinculando, setVinculando] = useState(false)
  const [trabajadores, setTrabajadores] = useState([])

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await get('/api/empresa')
        if (res.success && res.data) {
          const e = res.data
          setEmpresaForm({
            razonSocial: e.razonSocial || '',
            nombreFantasia: e.nombreFantasia || '',
            rut: e.rut || '',
            giro: e.giro || '',
            direccion: e.direccion || '',
            comuna: e.comuna || '',
            region: e.region || '',
            telefono: e.telefono || '',
            email: e.email || '',
            representanteLegal: e.representanteLegal || '',
            representanteRut: e.representanteRut || '',
          })
          setLaboralForm({
            mutualidad: e.mutualidad || '',
            tasaMutual: e.tasaMutual || '',
            sistemaGratificacion: e.sistemaGratificacion || '',
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEmpresa()
  }, [])

  useEffect(() => {
    if (activeTab === 'usuarios') {
      fetchUsuarios()
      fetchTrabajadores()
    }
  }, [activeTab])

  const fetchUsuarios = async () => {
    setLoadingUsuarios(true)
    try {
      const res = await get('/api/empresa/usuarios')
      if (res.success) setUsuarios(res.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingUsuarios(false)
    }
  }

  const fetchTrabajadores = async () => {
    try {
      const res = await get('/api/trabajadores?limit=1000')
      if (res.success) setTrabajadores(res.data.trabajadores || [])
    } catch {}
  }

  const handleSaveEmpresa = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await put('/api/empresa', empresaForm)
      setSuccess('Datos de empresa guardados correctamente')
    } catch (err) {
      setError(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLaboral = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const body = {
        ...laboralForm,
        tasaMutual: laboralForm.tasaMutual ? parseFloat(laboralForm.tasaMutual) : null,
      }
      await put('/api/empresa', body)
      setSuccess('Configuración laboral guardada correctamente')
    } catch (err) {
      setError(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleInvite = async () => {
    setInviting(true)
    setError('')
    setSuccess('')
    try {
      await post('/api/empresa/usuarios', inviteForm)
      setSuccess('Usuario invitado correctamente')
      setInviteForm({ email: '', nombre: '', role: 'ADMIN' })
      fetchUsuarios()
    } catch (err) {
      setError(err.message || 'Error al invitar usuario')
    } finally {
      setInviting(false)
    }
  }

  const handleVincular = async () => {
    setVinculando(true)
    setError('')
    setSuccess('')
    try {
      await post('/api/empresa/usuarios/vincular', vincularForm)
      setSuccess('Usuario vinculado al trabajador correctamente')
      setVincularForm({ userId: '', trabajadorId: '' })
      fetchUsuarios()
    } catch (err) {
      setError(err.message || 'Error al vincular')
    } finally {
      setVinculando(false)
    }
  }

  const regionOptions = REGIONES_CHILE.map((r) => ({ value: r, label: r }))

  const usuarioColumns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Rol',
      render: (val) => <Badge variant="info">{val}</Badge>,
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (val) => (
        <Badge variant={val !== false ? 'success' : 'neutral'}>
          {val !== false ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ]

  const trabajadorOptions = trabajadores.map((t) => ({
    value: t.id,
    label: `${t.nombre} ${t.apellidoPaterno || ''}`.trim(),
  }))

  const usuarioOptions = usuarios.map((u) => ({
    value: u.id,
    label: `${u.nombre || u.email}`,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Configuración</h1>

      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message={success} closable className="mb-4" />}

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Datos Empresa */}
      {activeTab === 'datos' && (
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input label="Razón Social" name="razonSocial" value={empresaForm.razonSocial} onChange={(e) => setEmpresaForm({ ...empresaForm, razonSocial: e.target.value })} />
            <Input label="Nombre Fantasía" name="nombreFantasia" value={empresaForm.nombreFantasia} onChange={(e) => setEmpresaForm({ ...empresaForm, nombreFantasia: e.target.value })} />
            <Input label="RUT" name="rut" value={empresaForm.rut} onChange={(e) => setEmpresaForm({ ...empresaForm, rut: e.target.value })} />
            <Input label="Giro" name="giro" value={empresaForm.giro} onChange={(e) => setEmpresaForm({ ...empresaForm, giro: e.target.value })} />
            <Input label="Dirección" name="direccion" value={empresaForm.direccion} onChange={(e) => setEmpresaForm({ ...empresaForm, direccion: e.target.value })} />
            <Input label="Comuna" name="comuna" value={empresaForm.comuna} onChange={(e) => setEmpresaForm({ ...empresaForm, comuna: e.target.value })} />
            <Select label="Región" name="region" value={empresaForm.region} onChange={(e) => setEmpresaForm({ ...empresaForm, region: e.target.value })} options={regionOptions} />
            <Input label="Teléfono" name="telefono" value={empresaForm.telefono} onChange={(e) => setEmpresaForm({ ...empresaForm, telefono: e.target.value })} />
            <Input label="Email" name="email" type="email" value={empresaForm.email} onChange={(e) => setEmpresaForm({ ...empresaForm, email: e.target.value })} />
            <Input label="Representante Legal" name="representanteLegal" value={empresaForm.representanteLegal} onChange={(e) => setEmpresaForm({ ...empresaForm, representanteLegal: e.target.value })} />
            <Input label="RUT Representante" name="representanteRut" value={empresaForm.representanteRut} onChange={(e) => setEmpresaForm({ ...empresaForm, representanteRut: e.target.value })} />
          </div>
          <Button onClick={handleSaveEmpresa} loading={saving}>
            <Save className="w-4 h-4" />
            Guardar Cambios
          </Button>
        </div>
      )}

      {/* Config Laboral */}
      {activeTab === 'laboral' && (
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              label="Mutualidad"
              name="mutualidad"
              value={laboralForm.mutualidad}
              onChange={(e) => setLaboralForm({ ...laboralForm, mutualidad: e.target.value })}
              placeholder="IST, ACHS, Mutual de Seguridad..."
            />
            <Input
              label="Tasa Mutual (%)"
              name="tasaMutual"
              type="number"
              step="0.01"
              value={laboralForm.tasaMutual}
              onChange={(e) => setLaboralForm({ ...laboralForm, tasaMutual: e.target.value })}
              placeholder="0.95"
            />
            <Select
              label="Sistema de Gratificación"
              name="sistemaGratificacion"
              value={laboralForm.sistemaGratificacion}
              onChange={(e) => setLaboralForm({ ...laboralForm, sistemaGratificacion: e.target.value })}
              options={gratificacionOptions}
            />
          </div>
          <Button onClick={handleSaveLaboral} loading={saving}>
            <Save className="w-4 h-4" />
            Guardar Configuración
          </Button>
        </div>
      )}

      {/* Usuarios */}
      {activeTab === 'usuarios' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Usuarios de la Empresa</h3>
            <Table
              columns={usuarioColumns}
              data={usuarios}
              loading={loadingUsuarios}
              emptyTitle="Sin usuarios"
              emptyDescription="No hay usuarios registrados."
            />
          </div>

          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Invitar Usuario</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                label="Email"
                name="inviteEmail"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                required
              />
              <Input
                label="Nombre"
                name="inviteNombre"
                value={inviteForm.nombre}
                onChange={(e) => setInviteForm({ ...inviteForm, nombre: e.target.value })}
                required
              />
              <Select
                label="Rol"
                name="inviteRole"
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                options={roleOptions}
              />
            </div>
            <Button onClick={handleInvite} loading={inviting}>
              <UserPlus className="w-4 h-4" />
              Invitar Usuario
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Vincular Usuario a Trabajador</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select
                label="Usuario"
                name="vincularUserId"
                value={vincularForm.userId}
                onChange={(e) => setVincularForm({ ...vincularForm, userId: e.target.value })}
                options={usuarioOptions}
              />
              <Select
                label="Trabajador"
                name="vincularTrabajadorId"
                value={vincularForm.trabajadorId}
                onChange={(e) => setVincularForm({ ...vincularForm, trabajadorId: e.target.value })}
                options={trabajadorOptions}
              />
            </div>
            <Button variant="secondary" onClick={handleVincular} loading={vinculando}>
              <Link className="w-4 h-4" />
              Vincular
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
