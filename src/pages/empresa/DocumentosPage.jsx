import { useState, useEffect, useCallback } from 'react'
import { Plus, Download, FileText, RefreshCw } from 'lucide-react'
import { get, post } from '../../api/client'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import { formatDate } from '../../lib/formatters'

const tipoDocOptions = [
  { value: 'CONTRATO', label: 'Contrato' },
  { value: 'ANEXO', label: 'Anexo' },
  { value: 'LIQUIDACION', label: 'Liquidación' },
  { value: 'FINIQUITO', label: 'Finiquito' },
  { value: 'CERTIFICADO', label: 'Certificado' },
  { value: 'RIOHS', label: 'RIOHS' },
  { value: 'OTRO', label: 'Otro' },
]

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({
    nombre: '', tipo: '', descripcion: '', url: '',
  })
  const [creating, setCreating] = useState(false)
  const [generatingRiohs, setGeneratingRiohs] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchDocumentos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await get('/api/documentos')
      if (res.success) setDocumentos(res.data.documentos || res.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocumentos()
  }, [fetchDocumentos])

  const handleCreate = async () => {
    setCreating(true)
    setModalError('')
    try {
      await post('/api/documentos', createForm)
      setShowCreate(false)
      setCreateForm({ nombre: '', tipo: '', descripcion: '', url: '' })
      fetchDocumentos()
    } catch (err) {
      setModalError(err.message || 'Error al crear documento')
    } finally {
      setCreating(false)
    }
  }

  const handleGenerateRiohs = async () => {
    setGeneratingRiohs(true)
    setError('')
    setSuccess('')
    try {
      const res = await post('/api/documentos/riohs/generar')
      if (res.success) {
        setSuccess('RIOHS generado correctamente')
        fetchDocumentos()
      }
    } catch (err) {
      setError(err.message || 'Error al generar RIOHS')
    } finally {
      setGeneratingRiohs(false)
    }
  }

  const columns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (val) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#6B7280]" />
          <span>{val}</span>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (val) => {
        const found = tipoDocOptions.find((t) => t.value === val)
        return <Badge variant="info">{found?.label || val}</Badge>
      },
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (val) => formatDate(val),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_, row) => (
        row.url ? (
          <a
            href={row.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#2563EB] transition-colors inline-flex"
            title="Descargar"
          >
            <Download className="w-4 h-4" />
          </a>
        ) : null
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Documentos</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleGenerateRiohs} loading={generatingRiohs}>
            <RefreshCw className="w-4 h-4" />
            Generar RIOHS
          </Button>
          <Button onClick={() => { setModalError(''); setShowCreate(true) }}>
            <Plus className="w-4 h-4" />
            Nuevo Documento
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message={success} closable className="mb-4" />}

      <Table
        columns={columns}
        data={documentos}
        loading={loading}
        emptyTitle="Sin documentos"
        emptyDescription="No hay documentos registrados."
      />

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Nuevo Documento"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button onClick={handleCreate} loading={creating}>Crear Documento</Button>
          </>
        }
      >
        {modalError && <Alert type="error" message={modalError} className="mb-4" />}
        <div className="space-y-4">
          <Input
            label="Nombre"
            name="nombre"
            value={createForm.nombre}
            onChange={(e) => setCreateForm({ ...createForm, nombre: e.target.value })}
            required
          />
          <Select
            label="Tipo"
            name="tipo"
            value={createForm.tipo}
            onChange={(e) => setCreateForm({ ...createForm, tipo: e.target.value })}
            options={tipoDocOptions}
            required
          />
          <Input
            label="URL del Documento"
            name="url"
            value={createForm.url}
            onChange={(e) => setCreateForm({ ...createForm, url: e.target.value })}
            placeholder="https://..."
          />
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Descripción</label>
            <textarea
              value={createForm.descripcion}
              onChange={(e) => setCreateForm({ ...createForm, descripcion: e.target.value })}
              rows={3}
              className="block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
