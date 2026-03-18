import { useState, useEffect } from 'react'
import { Plus, Download, FileText } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatDate } from '../../lib/utils'
import { TIPO_DOCUMENTO } from '../../lib/constants'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

const initialForm = {
  nombre: '',
  tipo: '',
  url: '',
  trabajadorId: '',
}

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState([])
  const [trabajadores, setTrabajadores] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [docRes, trabRes] = await Promise.all([
        apiClient.get('/api/documentos'),
        apiClient.get('/api/trabajadores'),
      ])
      if (docRes.success) {
        setDocumentos(docRes.data.documentos || [])
        if (docRes.data.pagination) setPagination(docRes.data.pagination)
      } else {
        setError(docRes.error || 'Error al cargar documentos')
      }
      if (trabRes.success) {
        const list = trabRes.data?.trabajadores || trabRes.data
        setTrabajadores(Array.isArray(list) ? list : [])
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      const payload = { ...form }
      if (!payload.trabajadorId) delete payload.trabajadorId
      const result = await apiClient.post('/api/documentos', payload)
      if (result.success) {
        setShowModal(false)
        setForm(initialForm)
        fetchData()
      } else {
        setError(result.error || 'Error al subir documento')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const tipoOptions = TIPO_DOCUMENTO

  const columns = [
    {
      header: 'Nombre',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#6B7280]" />
          {row.nombre}
        </div>
      ),
    },
    {
      header: 'Tipo',
      accessor: (row) => {
        if (typeof TIPO_DOCUMENTO === 'object' && !Array.isArray(TIPO_DOCUMENTO)) {
          return TIPO_DOCUMENTO[row.tipo] || row.tipo
        }
        return row.tipo
      },
    },
    {
      header: 'Trabajador',
      accessor: (row) => row.trabajador ? `${row.trabajador.nombre} ${row.trabajador.apellidoPaterno}` : 'General',
    },
    {
      header: 'Fecha',
      accessor: (row) => formatDate(row.createdAt),
    },
    {
      header: 'Acciones',
      accessor: (row) => row.url ? (
        <a href={row.url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </a>
      ) : null,
    },
  ]

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Documentos</h1>
        <Button onClick={() => { setForm(initialForm); setShowModal(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Subir Documento
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Table columns={columns} data={documentos} emptyMessage="No hay documentos registrados" />

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}>
            Anterior
          </Button>
          <span className="flex items-center text-sm text-[#6B7280]">Página {pagination.page} de {pagination.pages}</span>
          <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}>
            Siguiente
          </Button>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Subir Documento">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre del Documento" name="nombre" value={form.nombre} onChange={handleChange} required />
          <Select label="Tipo" name="tipo" value={form.tipo} onChange={handleChange} required options={tipoOptions} />
          <Input label="URL del Documento" name="url" value={form.url} onChange={handleChange} required placeholder="https://..." />
          <Select
            label="Trabajador (opcional)"
            name="trabajadorId"
            value={form.trabajadorId}
            onChange={handleChange}
            options={[{ value: '', label: 'Documento General' }, ...trabajadores.map((t) => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Subir</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
