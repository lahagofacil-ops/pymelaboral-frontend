import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil } from 'lucide-react'
import { get, post, put } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatMoney, formatDate } from '../../lib/formatters'
import { TIPO_CONTRATO } from '../../lib/constants'

const estadoFilter = [
  { value: '', label: 'Todos' },
  { value: 'VIGENTE', label: 'Vigente' },
  { value: 'TERMINADO', label: 'Terminado' },
  { value: 'POR_VENCER', label: 'Por Vencer' },
]

const jornadaOptions = [
  { value: 'COMPLETA', label: 'Jornada Completa' },
  { value: 'PARCIAL', label: 'Jornada Parcial' },
  { value: 'ART22', label: 'Art. 22 (Sin horario)' },
]

const emptyForm = {
  trabajadorId: '',
  tipo: '',
  fechaInicio: '',
  fechaTermino: '',
  sueldoBase: '',
  gratificacion: true,
  cargo: '',
  funciones: '',
  lugarTrabajo: '',
  jornadaTipo: 'COMPLETA',
  horasSemanales: '45',
  distribucionDias: '5',
  otrosHaberes: '',
}

export default function ContratosPage() {
  const [contratos, setContratos] = useState([])
  const [pagination, setPagination] = useState(null)
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterEstado, setFilterEstado] = useState('')
  const [filterTrabajador, setFilterTrabajador] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchContratos = useCallback(async () => {
    setLoading(true)
    try {
      let url = `/api/contratos?page=${page}&limit=20`
      if (filterEstado) url += `&estado=${filterEstado}`
      if (filterTrabajador) url += `&trabajadorId=${filterTrabajador}`
      const res = await get(url)
      if (res.success) {
        setContratos(res.data.contratos || [])
        setPagination(res.data.pagination || null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filterEstado, filterTrabajador, page])

  useEffect(() => {
    fetchContratos()
  }, [fetchContratos])

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const res = await get('/api/trabajadores?limit=1000')
        if (res.success) setTrabajadores(res.data.trabajadores || [])
      } catch {}
    }
    fetchTrabajadores()
  }, [])

  const trabajadorOptions = trabajadores.map((t) => ({
    value: t.id,
    label: `${t.nombre} ${t.apellidoPaterno || ''}`.trim(),
  }))

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setModalError('')
    setShowModal(true)
  }

  const openEdit = (contrato) => {
    setEditing(contrato)
    setForm({
      trabajadorId: contrato.trabajadorId || '',
      tipo: contrato.tipo || '',
      fechaInicio: contrato.fechaInicio?.slice(0, 10) || '',
      fechaTermino: contrato.fechaTermino?.slice(0, 10) || '',
      sueldoBase: contrato.sueldoBase || '',
      gratificacion: contrato.gratificacion ?? true,
      cargo: contrato.cargo || '',
      funciones: contrato.funciones || '',
      lugarTrabajo: contrato.lugarTrabajo || '',
      jornadaTipo: contrato.jornadaTipo || 'COMPLETA',
      horasSemanales: contrato.horasSemanales || '45',
      distribucionDias: contrato.distribucionDias || '5',
      otrosHaberes: contrato.otrosHaberes ? JSON.stringify(contrato.otrosHaberes) : '',
    })
    setModalError('')
    setShowModal(true)
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSave = async () => {
    setSaving(true)
    setModalError('')
    try {
      const body = {
        ...form,
        sueldoBase: parseFloat(form.sueldoBase) || 0,
        horasSemanales: parseInt(form.horasSemanales) || 45,
        distribucionDias: parseInt(form.distribucionDias) || 5,
      }
      if (form.otrosHaberes) {
        try {
          body.otrosHaberes = JSON.parse(form.otrosHaberes)
        } catch {
          body.otrosHaberes = null
        }
      } else {
        body.otrosHaberes = null
      }
      if (!body.fechaTermino) delete body.fechaTermino

      if (editing) {
        await put(`/api/contratos/${editing.id}`, body)
      } else {
        await post('/api/contratos', body)
      }
      setShowModal(false)
      fetchContratos()
    } catch (err) {
      setModalError(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const estadoBadgeVariant = (estado) => {
    const map = { VIGENTE: 'success', TERMINADO: 'neutral', POR_VENCER: 'warning' }
    return map[estado] || 'neutral'
  }

  const columns = [
    {
      key: 'trabajador',
      label: 'Trabajador',
      render: (_, row) => {
        const t = row.trabajador
        return t ? `${t.nombre} ${t.apellidoPaterno || ''}`.trim() : '-'
      },
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (val) => TIPO_CONTRATO.find((t) => t.value === val)?.label || val,
    },
    { key: 'cargo', label: 'Cargo' },
    {
      key: 'sueldoBase',
      label: 'Sueldo Base',
      render: (val) => formatMoney(val),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (val) => <Badge variant={estadoBadgeVariant(val)}>{val}</Badge>,
    },
    {
      key: 'fechaInicio',
      label: 'Inicio',
      render: (val) => formatDate(val),
    },
    {
      key: 'fechaTermino',
      label: 'Término',
      render: (val) => val ? formatDate(val) : 'Indefinido',
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        <button
          onClick={() => openEdit(row)}
          className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#2563EB] transition-colors"
          title="Editar"
        >
          <Pencil className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Contratos</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Nuevo Contrato
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Select
          name="filterEstado"
          value={filterEstado}
          onChange={(e) => { setFilterEstado(e.target.value); setPage(1) }}
          options={estadoFilter}
          placeholder="Estado"
          className="w-44"
        />
        <Select
          name="filterTrabajador"
          value={filterTrabajador}
          onChange={(e) => { setFilterTrabajador(e.target.value); setPage(1) }}
          options={trabajadorOptions}
          placeholder="Trabajador"
          className="w-56"
        />
      </div>

      <Table
        columns={columns}
        data={contratos}
        loading={loading}
        emptyTitle="Sin contratos"
        emptyDescription="No hay contratos registrados."
        pagination={pagination}
        onPageChange={setPage}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Editar Contrato' : 'Nuevo Contrato'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>{editing ? 'Guardar' : 'Crear'}</Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Trabajador" name="trabajadorId" value={form.trabajadorId} onChange={handleFormChange} options={trabajadorOptions} required />
          <Select label="Tipo de Contrato" name="tipo" value={form.tipo} onChange={handleFormChange} options={TIPO_CONTRATO} required />
          <Input label="Fecha Inicio" name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleFormChange} required />
          <Input label="Fecha Término" name="fechaTermino" type="date" value={form.fechaTermino} onChange={handleFormChange} />
          <Input label="Sueldo Base ($)" name="sueldoBase" type="number" value={form.sueldoBase} onChange={handleFormChange} required />
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="gratificacion"
              name="gratificacion"
              checked={form.gratificacion}
              onChange={handleFormChange}
              className="rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]"
            />
            <label htmlFor="gratificacion" className="text-sm text-[#111827]">Gratificación Legal</label>
          </div>
          <Input label="Cargo" name="cargo" value={form.cargo} onChange={handleFormChange} required />
          <Input label="Lugar de Trabajo" name="lugarTrabajo" value={form.lugarTrabajo} onChange={handleFormChange} />
          <Select label="Tipo de Jornada" name="jornadaTipo" value={form.jornadaTipo} onChange={handleFormChange} options={jornadaOptions} />
          <Input label="Horas Semanales" name="horasSemanales" type="number" value={form.horasSemanales} onChange={handleFormChange} />
          <Input label="Distribución Días" name="distribucionDias" type="number" value={form.distribucionDias} onChange={handleFormChange} />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-[#111827] mb-1">Funciones</label>
          <textarea
            name="funciones"
            value={form.funciones}
            onChange={handleFormChange}
            rows={3}
            className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-[#111827] mb-1">Otros Haberes (JSON)</label>
          <textarea
            name="otrosHaberes"
            value={form.otrosHaberes}
            onChange={handleFormChange}
            rows={2}
            placeholder='[{"nombre":"Colación","monto":50000}]'
            className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
          />
        </div>
      </Modal>
    </div>
  )
}
