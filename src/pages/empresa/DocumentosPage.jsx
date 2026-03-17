import { useState, useEffect, useCallback } from 'react'
import { Plus, FileText, RefreshCw } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatDate } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'

const TIPOS_DOCUMENTO = [
  { value: 'CONTRATO', label: 'Contrato' },
  { value: 'ANEXO', label: 'Anexo de contrato' },
  { value: 'LIQUIDACION', label: 'Liquidacion' },
  { value: 'CERTIFICADO', label: 'Certificado' },
  { value: 'RIOHS', label: 'RIOHS' },
  { value: 'PROTOCOLO', label: 'Protocolo' },
  { value: 'OTRO', label: 'Otro' },
]

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', tipo: '', url: '' })
  const [saving, setSaving] = useState(false)

  const fetchDocumentos = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/documentos')
      if (res.success) setDocumentos(res.data)
      else setError(res.error || 'Error al cargar documentos')
    } catch {
      setError('Error de conexion')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocumentos()
  }, [fetchDocumentos])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.post('/api/documentos', form)
      if (res.success) {
        setModalOpen(false)
        setForm({ nombre: '', tipo: '', url: '' })
        await fetchDocumentos()
      } else {
        setError(res.error || 'Error al subir')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleGenerarRIOHS = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await apiClient.post('/api/documentos/riohs/generar')
      if (res.success) {
        await fetchDocumentos()
      } else {
        setError(res.error || 'Error al generar RIOHS')
      }
    } catch {
      setError('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const tipoBadge = (tipo) => {
    const map = { CONTRATO: 'info', LIQUIDACION: 'success', RIOHS: 'warning', PROTOCOLO: 'danger' }
    return <Badge variant={map[tipo] || 'neutral'}>{TIPOS_DOCUMENTO.find((t) => t.value === tipo)?.label || tipo}</Badge>
  }

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo', render: (val) => tipoBadge(val) },
    { key: 'createdAt', label: 'Fecha', render: (val) => formatDate(val) },
    {
      key: 'actions',
      label: '',
      render: (_, row) => row.url ? (
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-[#2563EB] hover:bg-blue-50 transition-colors inline-flex"
          title="Ver documento"
        >
          <FileText className="w-4 h-4" />
        </a>
      ) : null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Documentos</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerarRIOHS} loading={saving}>
            <RefreshCw className="w-4 h-4" />
            Generar RIOHS
          </Button>
          <Button onClick={() => { setForm({ nombre: '', tipo: '', url: '' }); setModalOpen(true) }}>
            <Plus className="w-4 h-4" />
            Subir documento
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Table columns={columns} data={documentos} loading={loading} emptyMessage="No hay documentos" />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Subir documento"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} loading={saving}>Subir</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <Select
            label="Tipo"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            options={TIPOS_DOCUMENTO}
          />
          <Input label="URL del documento" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
        </div>
      </Modal>
    </div>
  )
}
