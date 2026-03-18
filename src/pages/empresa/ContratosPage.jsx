import { useState, useEffect } from 'react'
import { Plus, Eye, Download } from 'lucide-react'
import { apiClient } from '../../api/client'
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

const initialForm = {
  trabajadorId: '',
  tipo: 'INDEFINIDO',
  cargo: '',
  funciones: '',
  lugarTrabajo: '',
  sueldoBase: '',
  horasSemanales: '42',
  distribucionDias: '5',
  fechaInicio: '',
  fechaTermino: '',
  estado: 'VIGENTE',
}

export default function ContratosPage() {
  const [contratos, setContratos] = useState([])
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [downloadingPdf, setDownloadingPdf] = useState(null)

  const handleDownloadPDF = async (id) => {
    try {
      setDownloadingPdf(id)
      await downloadPDF(`/api/contratos/${id}/pdf`, `contrato_${id}.pdf`)
    } catch (err) {
      setError('Error al descargar PDF')
    } finally {
      setDownloadingPdf(null)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [contratosRes, trabajadoresRes] = await Promise.all([
        apiClient.get('/api/contratos'),
        apiClient.get('/api/trabajadores'),
      ])
      if (contratosRes.success) {
        const list = contratosRes.data?.contratos || contratosRes.data
        setContratos(Array.isArray(list) ? list : [])
      } else {
        setError(contratosRes.error || 'Error al cargar contratos')
      }
      if (trabajadoresRes.success) {
        const list = trabajadoresRes.data?.trabajadores || trabajadoresRes.data
        setTrabajadores(Array.isArray(list) ? list : [])
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setForm(initialForm)
    setShowModal(true)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        ...form,
        sueldoBase: Number(form.sueldoBase),
        horasSemanales: Number(form.horasSemanales),
        distribucionDias: Number(form.distribucionDias),
      }
      const result = await apiClient.post('/api/contratos', payload)
      if (result.success) {
        setShowModal(false)
        fetchData()
      } else {
        setError(result.error || 'Error al crear contrato')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      header: 'Trabajador',
      accessor: (row) => row.trabajadorNombre || (row.trabajador ? `${row.trabajador.nombre} ${row.trabajador.apellidoPaterno}` : '—'),
    },
    { header: 'Tipo', accessor: 'tipo' },
    { header: 'Cargo', accessor: 'cargo' },
    {
      header: 'Sueldo Base',
      accessor: (row) => formatCLP(row.sueldoBase),
    },
    { header: 'Horas Semanales', accessor: 'horasSemanales' },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={row.estado === 'VIGENTE' ? 'success' : 'default'}>
          {row.estado}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setShowDetail(row)} title="Ver detalle">
            <Eye className="w-4 h-4" />
          </Button>
          {(row.estado === 'VIGENTE' || row.estado === 'BORRADOR') && (
            <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(row.id)}
              loading={downloadingPdf === row.id} title="Descargar PDF">
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Contratos</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Contrato
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Table columns={columns} data={contratos} emptyMessage="No hay contratos registrados" />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo Contrato">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Trabajador"
            name="trabajadorId"
            value={form.trabajadorId}
            onChange={handleChange}
            required
            options={trabajadores.map((t) => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))}
          />
          <Select
            label="Tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            options={[
              { value: 'INDEFINIDO', label: 'Indefinido' },
              { value: 'PLAZO_FIJO', label: 'Plazo Fijo' },
              { value: 'OBRA_FAENA', label: 'Por Obra o Faena' },
              { value: 'PART_TIME', label: 'Jornada Parcial' },
            ]}
          />
          <Input label="Cargo" name="cargo" value={form.cargo} onChange={handleChange} required />
          <Input label="Funciones" name="funciones" value={form.funciones} onChange={handleChange} required placeholder="Descripción de las funciones del cargo" />
          <Input label="Lugar de Trabajo" name="lugarTrabajo" value={form.lugarTrabajo} onChange={handleChange} required />
          <Input label="Sueldo Base" name="sueldoBase" type="number" value={form.sueldoBase} onChange={handleChange} required />
          <Input label="Horas Semanales" name="horasSemanales" type="number" value={form.horasSemanales} onChange={handleChange} />
          <Input label="Días por Semana" name="distribucionDias" type="number" value={form.distribucionDias} onChange={handleChange} />
          <Input label="Fecha Inicio" name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleChange} required />
          <Input label="Fecha Término" name="fechaTermino" type="date" value={form.fechaTermino} onChange={handleChange} />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Crear Contrato</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!showDetail} onClose={() => setShowDetail(null)} title="Detalle de Contrato">
        {showDetail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#6B7280]">Trabajador</p>
                <p className="font-medium text-[#111827]">{showDetail.trabajadorNombre || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">RUT</p>
                <p className="font-medium text-[#111827]">{showDetail.trabajadorRut || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Tipo</p>
                <p className="font-medium text-[#111827]">{showDetail.tipo}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Cargo</p>
                <p className="font-medium text-[#111827]">{showDetail.cargo}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Sueldo Base</p>
                <p className="font-medium text-[#111827]">{formatCLP(showDetail.sueldoBase)}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Jornada</p>
                <p className="font-medium text-[#111827]">{showDetail.horasSemanales} hrs/semana</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Fecha Inicio</p>
                <p className="font-medium text-[#111827]">{showDetail.fechaInicio ? new Date(showDetail.fechaInicio).toLocaleDateString('es-CL') : '—'}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Fecha Término</p>
                <p className="font-medium text-[#111827]">{showDetail.fechaTermino ? new Date(showDetail.fechaTermino).toLocaleDateString('es-CL') : 'Indefinido'}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Estado</p>
                <Badge variant={showDetail.estado === 'VIGENTE' ? 'success' : 'default'}>
                  {showDetail.estado}
                </Badge>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-[#E5E7EB]">
              <Button onClick={() => handleDownloadPDF(showDetail.id)} loading={downloadingPdf === showDetail.id}>
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
