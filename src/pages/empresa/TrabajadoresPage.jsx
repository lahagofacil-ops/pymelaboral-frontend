import { useState, useEffect } from 'react'
import { Plus, Pencil } from 'lucide-react'
import { apiClient } from '../../api/client'
import { AFPS } from '../../lib/constants'
import { formatCLP } from '../../lib/utils'
import { downloadPDF } from '../../lib/pdfDownload'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

const SALUD_OPTIONS = [
  { value: 'FONASA', label: 'FONASA' },
  { value: 'BANMEDICA', label: 'Banmédica' },
  { value: 'COLMENA', label: 'Colmena' },
  { value: 'CRUZBLANCA', label: 'CruzBlanca' },
  { value: 'MASVIDA', label: 'Más Vida' },
  { value: 'NUEVAMASVIDA', label: 'Nueva Más Vida' },
  { value: 'VIDATRES', label: 'VidaTres' },
  { value: 'ISAPRE', label: 'Otra Isapre' },
]

const BANCO_OPTIONS = [
  { value: '', label: '— Sin banco —' },
  { value: 'BANCO_ESTADO', label: 'BancoEstado' },
  { value: 'BANCO_CHILE', label: 'Banco de Chile' },
  { value: 'BCI', label: 'BCI' },
  { value: 'SANTANDER', label: 'Santander' },
  { value: 'SCOTIABANK', label: 'Scotiabank' },
  { value: 'ITAU', label: 'Itaú' },
  { value: 'BICE', label: 'BICE' },
  { value: 'SECURITY', label: 'Security' },
  { value: 'FALABELLA', label: 'Banco Falabella' },
  { value: 'RIPLEY', label: 'Banco Ripley' },
  { value: 'CONSORCIO', label: 'Consorcio' },
  { value: 'INTERNACIONAL', label: 'Internacional' },
  { value: 'OTRO', label: 'Otro' },
]

const TIPO_CUENTA_OPTIONS = [
  { value: 'CORRIENTE', label: 'Cuenta Corriente' },
  { value: 'VISTA', label: 'Cuenta Vista / RUT' },
  { value: 'AHORRO', label: 'Cuenta de Ahorro' },
  { value: 'RUT', label: 'Cuenta RUT' },
]

const initialTrabajador = {
  rut: '', nombre: '', apellidoPaterno: '', apellidoMaterno: '',
  fechaNacimiento: '', nacionalidad: 'Chilena', sexo: '', estadoCivil: '',
  direccion: '', comuna: '', telefono: '', email: '',
  afp: '', salud: '', tasaSalud: '0.07',
  banco: '', tipoCuenta: '', numeroCuenta: '',
  fechaIngreso: '',
}

const initialContrato = {
  trabajadorId: '', tipo: 'INDEFINIDO', fechaInicio: '', fechaTermino: '',
  cargo: '', funciones: '', lugarTrabajo: '',
  sueldoBase: '', jornadaTipo: 'COMPLETA', horasSemanales: '42', distribucionDias: '5',
  gratificacion: true, otrosHaberes: [], clausulasExtra: [],
  estado: 'BORRADOR',
}

export default function TrabajadoresPage() {
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(initialTrabajador)
  const [saving, setSaving] = useState(false)
  // Contract flow
  const [showContratoModal, setShowContratoModal] = useState(false)
  const [contratoForm, setContratoForm] = useState(initialContrato)
  const [savingContrato, setSavingContrato] = useState(false)
  const [createdContratoId, setCreatedContratoId] = useState(null)
  const [downloadingPdf, setDownloadingPdf] = useState(false)

  useEffect(() => { fetchTrabajadores() }, [])

  const fetchTrabajadores = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get('/api/trabajadores')
      if (result.success) {
        const list = result.data?.trabajadores || result.data
        setTrabajadores(Array.isArray(list) ? list : [])
      } else {
        setError(result.error || 'Error al cargar trabajadores')
      }
    } catch { setError('Error de conexión') }
    finally { setLoading(false) }
  }

  const openCreate = () => { setEditing(null); setForm(initialTrabajador); setError(null); setSuccess(null); setShowModal(true) }

  const openEdit = (t) => {
    setEditing(t)
    setForm({
      rut: t.rut || '', nombre: t.nombre || '', apellidoPaterno: t.apellidoPaterno || '',
      apellidoMaterno: t.apellidoMaterno || '', fechaNacimiento: t.fechaNacimiento?.split('T')[0] || '',
      nacionalidad: t.nacionalidad || 'Chilena', sexo: t.sexo || '', estadoCivil: t.estadoCivil || '',
      direccion: t.direccion || '', comuna: t.comuna || '', telefono: t.telefono || '', email: t.email || '',
      afp: t.afp || '', salud: t.salud || '', tasaSalud: String(t.tasaSalud || '0.07'),
      banco: t.banco || '', tipoCuenta: t.tipoCuenta || '', numeroCuenta: t.numeroCuenta || '',
      fechaIngreso: t.fechaIngreso?.split('T')[0] || '',
    })
    setError(null); setSuccess(null); setShowModal(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true); setError(null)
      const payload = { ...form }
      if (payload.tasaSalud) payload.tasaSalud = Number(payload.tasaSalud)
      if (!payload.banco) { delete payload.banco; delete payload.tipoCuenta; delete payload.numeroCuenta }
      if (!payload.estadoCivil) delete payload.estadoCivil
      if (!payload.email) delete payload.email

      const result = editing
        ? await apiClient.put(`/api/trabajadores/${editing.id}`, payload)
        : await apiClient.post('/api/trabajadores', payload)

      if (result.success) {
        setShowModal(false)
        fetchTrabajadores()
        if (!editing) {
          // New worker created — open contract modal
          const newTrabajador = result.data?.trabajador || result.data
          setSuccess(`Trabajador ${form.nombre} ${form.apellidoPaterno} creado correctamente`)
          setContratoForm({ ...initialContrato, trabajadorId: newTrabajador.id, fechaInicio: form.fechaIngreso })
          setCreatedContratoId(null)
          setShowContratoModal(true)
        }
      } else {
        setError(result.error || 'Error al guardar')
      }
    } catch { setError('Error de conexión') }
    finally { setSaving(false) }
  }

  // --- Contract form handlers ---
  const handleContratoChange = (e) => {
    const { name, value, type, checked } = e.target
    setContratoForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const addHaber = () => {
    setContratoForm(prev => ({
      ...prev, otrosHaberes: [...prev.otrosHaberes, { nombre: '', monto: '', imponible: false }]
    }))
  }
  const removeHaber = (i) => {
    setContratoForm(prev => ({ ...prev, otrosHaberes: prev.otrosHaberes.filter((_, idx) => idx !== i) }))
  }
  const updateHaber = (i, field, value) => {
    setContratoForm(prev => {
      const copy = [...prev.otrosHaberes]
      copy[i] = { ...copy[i], [field]: value }
      return { ...prev, otrosHaberes: copy }
    })
  }

  const addClausula = () => {
    setContratoForm(prev => ({ ...prev, clausulasExtra: [...prev.clausulasExtra, ''] }))
  }
  const removeClausula = (i) => {
    setContratoForm(prev => ({ ...prev, clausulasExtra: prev.clausulasExtra.filter((_, idx) => idx !== i) }))
  }
  const updateClausula = (i, value) => {
    setContratoForm(prev => {
      const copy = [...prev.clausulasExtra]
      copy[i] = value
      return { ...prev, clausulasExtra: copy }
    })
  }

  const handleContratoSubmit = async (e) => {
    e.preventDefault()
    try {
      setSavingContrato(true); setError(null)
      const payload = {
        ...contratoForm,
        sueldoBase: Number(contratoForm.sueldoBase),
        horasSemanales: Number(contratoForm.horasSemanales),
        distribucionDias: Number(contratoForm.distribucionDias),
        otrosHaberes: contratoForm.otrosHaberes
          .filter(h => h.nombre && h.monto)
          .map(h => ({ ...h, monto: Number(h.monto) })),
        clausulasExtra: contratoForm.clausulasExtra.filter(c => c.trim()),
      }
      if (!payload.fechaTermino) delete payload.fechaTermino
      if (payload.otrosHaberes.length === 0) delete payload.otrosHaberes
      if (payload.clausulasExtra.length === 0) delete payload.clausulasExtra

      const result = await apiClient.post('/api/contratos', payload)
      if (result.success) {
        const contrato = result.data?.contrato || result.data
        setCreatedContratoId(contrato.id)
        setSuccess('Contrato creado correctamente')
        fetchTrabajadores()
      } else {
        setError(result.error || 'Error al crear contrato')
      }
    } catch { setError('Error de conexión') }
    finally { setSavingContrato(false) }
  }

  const handleDownloadContratoPDF = async () => {
    if (!createdContratoId) return
    try {
      setDownloadingPdf(true)
      await downloadPDF(`/api/contratos/${createdContratoId}/pdf`, `contrato_${createdContratoId}.pdf`)
    } catch (err) {
      setError('Error al descargar PDF: ' + err.message)
    } finally {
      setDownloadingPdf(false)
    }
  }

  const columns = [
    { header: 'RUT', accessor: (row) => row.rutFormateado || row.rut },
    { header: 'Nombre', accessor: (row) => `${row.nombre} ${row.apellidoPaterno}` },
    { header: 'Cargo', accessor: (row) => row.contratoActivo?.cargo || '—' },
    { header: 'AFP', accessor: 'afp' },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={row.estado === 'ACTIVO' ? 'success' : row.estado === 'DESVINCULADO' ? 'danger' : 'default'}>
          {row.estado}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
          <Pencil className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Trabajadores</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Trabajador
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <Table columns={columns} data={trabajadores} emptyMessage="No hay trabajadores registrados" />

      {/* ===== MODAL CREAR/EDITAR TRABAJADOR ===== */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar Trabajador' : 'Nuevo Trabajador'}>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Sección 1: Datos personales */}
          <div>
            <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wide mb-3">Datos Personales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {!editing && <Input label="RUT *" name="rut" value={form.rut} onChange={handleChange} required placeholder="12345678-9" />}
              <Input label="Nombre *" name="nombre" value={form.nombre} onChange={handleChange} required />
              <Input label="Apellido Paterno *" name="apellidoPaterno" value={form.apellidoPaterno} onChange={handleChange} required />
              <Input label="Apellido Materno" name="apellidoMaterno" value={form.apellidoMaterno} onChange={handleChange} />
              <Input label="Fecha Nacimiento *" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} required />
              <Input label="Nacionalidad" name="nacionalidad" value={form.nacionalidad} onChange={handleChange} />
              <Select label="Sexo *" name="sexo" value={form.sexo} onChange={handleChange} required options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }]} />
              <Select label="Estado Civil" name="estadoCivil" value={form.estadoCivil} onChange={handleChange} options={[
                { value: '', label: '— Seleccionar —' },
                { value: 'Soltero/a', label: 'Soltero/a' }, { value: 'Casado/a', label: 'Casado/a' },
                { value: 'Divorciado/a', label: 'Divorciado/a' }, { value: 'Viudo/a', label: 'Viudo/a' },
                { value: 'Conviviente civil', label: 'Conviviente civil' },
              ]} />
            </div>
          </div>

          {/* Sección 2: Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wide mb-3">Contacto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} />
              <Input label="Comuna" name="comuna" value={form.comuna} onChange={handleChange} />
              <Input label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+56912345678" />
              <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
          </div>

          {/* Sección 3: Previsión */}
          <div>
            <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wide mb-3">Previsión</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select label="AFP *" name="afp" value={form.afp} onChange={handleChange} required options={AFPS} />
              <Select label="Salud *" name="salud" value={form.salud} onChange={handleChange} required options={SALUD_OPTIONS} />
              {form.salud && form.salud !== 'FONASA' && (
                <Input label="Tasa Salud" name="tasaSalud" type="number" step="0.001" min="0.07" max="1" value={form.tasaSalud} onChange={handleChange} />
              )}
            </div>
          </div>

          {/* Sección 4: Datos bancarios */}
          <div>
            <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wide mb-3">Datos Bancarios</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select label="Banco" name="banco" value={form.banco} onChange={handleChange} options={BANCO_OPTIONS} />
              {form.banco && (
                <>
                  <Select label="Tipo Cuenta" name="tipoCuenta" value={form.tipoCuenta} onChange={handleChange} options={TIPO_CUENTA_OPTIONS} />
                  <Input label="N° Cuenta" name="numeroCuenta" value={form.numeroCuenta} onChange={handleChange} />
                </>
              )}
            </div>
          </div>

          {/* Sección 5: Datos laborales */}
          <div>
            <h3 className="text-sm font-semibold text-[#374151] uppercase tracking-wide mb-3">Datos Laborales</h3>
            <Input label="Fecha de Ingreso *" name="fechaIngreso" type="date" value={form.fechaIngreso} onChange={handleChange} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editing ? 'Guardar Cambios' : 'Crear Trabajador'}</Button>
          </div>
        </form>
      </Modal>

      {/* ===== MODAL CREAR CONTRATO (post-creación de trabajador) ===== */}
      <Modal open={showContratoModal} onClose={() => setShowContratoModal(false)} title="Crear Contrato">
        {createdContratoId ? (
          <div className="text-center py-6 space-y-4">
            <div className="text-green-600 text-xl font-semibold">Contrato creado exitosamente</div>
            <p className="text-[#6B7280]">El trabajador y su contrato fueron registrados correctamente.</p>
            <div className="flex justify-center gap-3">
              <Button onClick={handleDownloadContratoPDF} loading={downloadingPdf}>
                Descargar PDF del Contrato
              </Button>
              <Button variant="outline" onClick={() => setShowContratoModal(false)}>Cerrar</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleContratoSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
            {/* Tipo y fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select label="Tipo de Contrato *" name="tipo" value={contratoForm.tipo} onChange={handleContratoChange} options={[
                { value: 'INDEFINIDO', label: 'Indefinido' },
                { value: 'PLAZO_FIJO', label: 'Plazo Fijo' },
                { value: 'OBRA_FAENA', label: 'Por Obra o Faena' },
                { value: 'PART_TIME', label: 'Jornada Parcial' },
              ]} />
              <Input label="Fecha Inicio *" name="fechaInicio" type="date" value={contratoForm.fechaInicio} onChange={handleContratoChange} required />
              {(contratoForm.tipo === 'PLAZO_FIJO' || contratoForm.tipo === 'OBRA_FAENA') && (
                <Input label="Fecha Término" name="fechaTermino" type="date" value={contratoForm.fechaTermino} onChange={handleContratoChange} />
              )}
            </div>

            {/* Cargo y funciones */}
            <Input label="Cargo *" name="cargo" value={contratoForm.cargo} onChange={handleContratoChange} required />
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Funciones *</label>
              <textarea name="funciones" value={contratoForm.funciones} onChange={handleContratoChange} required
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] min-h-[80px]"
                placeholder="Descripción de las funciones del cargo (mínimo 10 caracteres)" />
            </div>
            <Input label="Lugar de Trabajo *" name="lugarTrabajo" value={contratoForm.lugarTrabajo} onChange={handleContratoChange} required />

            {/* Sueldo y jornada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Sueldo Base *" name="sueldoBase" type="number" value={contratoForm.sueldoBase} onChange={handleContratoChange} required placeholder="539000" />
              <Select label="Tipo Jornada" name="jornadaTipo" value={contratoForm.jornadaTipo} onChange={handleContratoChange} options={[
                { value: 'COMPLETA', label: 'Completa' }, { value: 'PARCIAL', label: 'Parcial' },
              ]} />
              <Input label="Horas Semanales" name="horasSemanales" type="number" value={contratoForm.horasSemanales} onChange={handleContratoChange} />
              <Input label="Días por Semana" name="distribucionDias" type="number" min="1" max="6" value={contratoForm.distribucionDias} onChange={handleContratoChange} />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="gratificacion" checked={contratoForm.gratificacion} onChange={handleContratoChange} id="gratif" className="rounded" />
              <label htmlFor="gratif" className="text-sm text-[#374151]">Incluir gratificación legal (Art. 50)</label>
            </div>

            {/* Otros haberes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#374151]">Otros Haberes</h4>
                <Button type="button" variant="outline" size="sm" onClick={addHaber}>+ Agregar</Button>
              </div>
              {contratoForm.otrosHaberes.map((h, i) => (
                <div key={i} className="flex items-end gap-2 mb-2">
                  <Input label="Nombre" value={h.nombre} onChange={(e) => updateHaber(i, 'nombre', e.target.value)} className="flex-1" />
                  <Input label="Monto" type="number" value={h.monto} onChange={(e) => updateHaber(i, 'monto', e.target.value)} className="w-32" />
                  <div className="flex items-center gap-1 pb-1">
                    <input type="checkbox" checked={h.imponible} onChange={(e) => updateHaber(i, 'imponible', e.target.checked)} />
                    <span className="text-xs text-[#6B7280]">Imp.</span>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeHaber(i)} className="text-red-500 pb-1">✕</Button>
                </div>
              ))}
            </div>

            {/* Cláusulas extra */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#374151]">Cláusulas Adicionales</h4>
                <Button type="button" variant="outline" size="sm" onClick={addClausula}>+ Agregar</Button>
              </div>
              {contratoForm.clausulasExtra.map((c, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <textarea value={c} onChange={(e) => updateClausula(i, e.target.value)}
                    className="flex-1 rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] min-h-[60px]"
                    placeholder="Texto de la cláusula adicional" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeClausula(i)} className="text-red-500">✕</Button>
                </div>
              ))}
            </div>

            <Select label="Estado" name="estado" value={contratoForm.estado} onChange={handleContratoChange} options={[
              { value: 'BORRADOR', label: 'Borrador' }, { value: 'VIGENTE', label: 'Vigente' },
            ]} />

            {error && <Alert type="error">{error}</Alert>}

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
              <Button type="button" variant="outline" onClick={() => setShowContratoModal(false)}>Omitir</Button>
              <Button type="submit" loading={savingContrato}>Crear Contrato</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
