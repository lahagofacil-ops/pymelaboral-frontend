import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Eye } from 'lucide-react'
import { get, post, put } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatRut, formatDate } from '../../lib/formatters'
import { AFP_OPTIONS, SALUD_OPTIONS, REGIONES_CHILE } from '../../lib/constants'

const estadoOptions = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' },
]

const sexoOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
]

const estadoCivilOptions = [
  { value: 'SOLTERO', label: 'Soltero/a' },
  { value: 'CASADO', label: 'Casado/a' },
  { value: 'DIVORCIADO', label: 'Divorciado/a' },
  { value: 'VIUDO', label: 'Viudo/a' },
  { value: 'SEPARADO', label: 'Separado/a' },
]

const emptyForm = {
  rut: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '',
  fechaNacimiento: '', nacionalidad: 'Chilena', sexo: '', estadoCivil: '',
  direccion: '', comuna: '', telefono: '', email: '',
  afp: '', salud: '', tasaSalud: '', fechaIngreso: '',
}

export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchTrabajadores = useCallback(async () => {
    setLoading(true)
    try {
      let url = `/api/trabajadores?page=${page}&limit=20`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (filterEstado) url += `&estado=${filterEstado}`
      const res = await get(url)
      if (res.success) {
        setTrabajadores(res.data.trabajadores || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [search, filterEstado, page])

  useEffect(() => {
    fetchTrabajadores()
  }, [fetchTrabajadores])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setModalError('')
    setShowModal(true)
  }

  const openEdit = (trab) => {
    setEditing(trab)
    setForm({
      rut: trab.rut || '',
      nombre: trab.nombre || '',
      apellidoPaterno: trab.apellidoPaterno || '',
      apellidoMaterno: trab.apellidoMaterno || '',
      fechaNacimiento: trab.fechaNacimiento?.slice(0, 10) || '',
      nacionalidad: trab.nacionalidad || 'Chilena',
      sexo: trab.sexo || '',
      estadoCivil: trab.estadoCivil || '',
      direccion: trab.direccion || '',
      comuna: trab.comuna || '',
      telefono: trab.telefono || '',
      email: trab.email || '',
      afp: trab.afp || '',
      salud: trab.salud || '',
      tasaSalud: trab.tasaSalud || '',
      fechaIngreso: trab.fechaIngreso?.slice(0, 10) || '',
    })
    setModalError('')
    setShowModal(true)
  }

  const openDetail = (trab) => {
    setDetailData(trab)
    setShowDetail(true)
  }

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    setModalError('')
    try {
      const body = { ...form }
      if (body.tasaSalud) body.tasaSalud = parseFloat(body.tasaSalud)
      if (editing) {
        await put(`/api/trabajadores/${editing.id}`, body)
      } else {
        await post('/api/trabajadores', body)
      }
      setShowModal(false)
      fetchTrabajadores()
    } catch (err) {
      setModalError(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre Completo',
      render: (_, row) => `${row.nombre || ''} ${row.apellidoPaterno || ''} ${row.apellidoMaterno || ''}`.trim(),
    },
    {
      key: 'rut',
      label: 'RUT',
      render: (val) => formatRut(val),
    },
    {
      key: 'cargo',
      label: 'Cargo',
      render: (_, row) => row.contratoActual?.cargo || row.cargo || '-',
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => (
        <Badge variant={val === 'ACTIVO' ? 'success' : 'neutral'}>
          {val || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openDetail(row)}
            className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#2563EB] transition-colors"
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#2563EB] transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Trabajadores</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Nuevo Trabajador
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          name="search"
          placeholder="Buscar por nombre o RUT..."
          icon={Search}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 max-w-md"
        />
        <Select
          name="filterEstado"
          value={filterEstado}
          onChange={(e) => { setFilterEstado(e.target.value); setPage(1) }}
          options={estadoOptions}
          placeholder="Estado"
          className="w-40"
        />
      </div>

      <Table
        columns={columns}
        data={trabajadores}
        loading={loading}
        emptyTitle="Sin trabajadores"
        emptyDescription="No hay trabajadores registrados."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Editar Trabajador' : 'Nuevo Trabajador'}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? 'Guardar' : 'Crear'}</Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="RUT" name="rut" value={form.rut} onChange={handleFormChange} required placeholder="12345678-9" />
          <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleFormChange} required />
          <Input label="Apellido Paterno" name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleFormChange} required />
          <Input label="Apellido Materno" name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleFormChange} />
          <Input label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleFormChange} />
          <Input label="Nacionalidad" name="nacionalidad" value={form.nacionalidad} onChange={handleFormChange} />
          <Select label="Sexo" name="sexo" value={form.sexo} onChange={handleFormChange} options={sexoOptions} />
          <Select label="Estado Civil" name="estadoCivil" value={form.estadoCivil} onChange={handleFormChange} options={estadoCivilOptions} />
          <Input label="Dirección" name="direccion" value={form.direccion} onChange={handleFormChange} />
          <Input label="Comuna" name="comuna" value={form.comuna} onChange={handleFormChange} />
          <Input label="Teléfono" name="telefono" value={form.telefono} onChange={handleFormChange} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleFormChange} />
          <Select label="AFP" name="afp" value={form.afp} onChange={handleFormChange} options={AFP_OPTIONS} />
          <Select label="Salud" name="salud" value={form.salud} onChange={handleFormChange} options={SALUD_OPTIONS} />
          <Input label="Tasa Salud (%)" name="tasaSalud" type="number" step="0.01" value={form.tasaSalud} onChange={handleFormChange} placeholder="7" />
          <Input label="Fecha de Ingreso" name="fechaIngreso" type="date" value={form.fechaIngreso} onChange={handleFormChange} required />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title="Detalle del Trabajador"
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setShowDetail(false)}>Cerrar</Button>
        }
      >
        {detailData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#6B7280]">Nombre Completo</p>
                <p className="text-sm font-medium text-[#111827]">
                  {`${detailData.nombre} ${detailData.apellidoPaterno} ${detailData.apellidoMaterno || ''}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">RUT</p>
                <p className="text-sm font-medium text-[#111827]">{formatRut(detailData.rut)}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Email</p>
                <p className="text-sm font-medium text-[#111827]">{detailData.email || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Teléfono</p>
                <p className="text-sm font-medium text-[#111827]">{detailData.telefono || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">AFP</p>
                <p className="text-sm font-medium text-[#111827]">{detailData.afp || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Salud</p>
                <p className="text-sm font-medium text-[#111827]">{detailData.salud || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Fecha Ingreso</p>
                <p className="text-sm font-medium text-[#111827]">{formatDate(detailData.fechaIngreso)}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Estado</p>
                <Badge variant={detailData.estado === 'ACTIVO' ? 'success' : 'neutral'}>
                  {detailData.estado || 'N/A'}
                </Badge>
              </div>
            </div>
            {detailData.contratos && detailData.contratos.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-[#111827] mb-2">Contratos</h4>
                <div className="space-y-2">
                  {detailData.contratos.map((c) => (
                    <div key={c.id} className="p-3 bg-gray-50 rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#111827]">{c.cargo || c.tipo}</span>
                        <Badge variant={c.estado === 'VIGENTE' ? 'success' : 'neutral'}>{c.estado}</Badge>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1">
                        {c.tipo} | {formatDate(c.fechaInicio)} - {c.fechaTermino ? formatDate(c.fechaTermino) : 'Indefinido'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
