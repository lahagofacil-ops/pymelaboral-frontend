import { useState, useEffect } from 'react'
import { Plus, Eye } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatDate } from '../../lib/utils'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

const TIPOS_ACOSO = [
  { value: 'SEXUAL', label: 'Acoso Sexual' },
  { value: 'LABORAL', label: 'Acoso Laboral' },
  { value: 'VIOLENCIA_TRABAJO', label: 'Violencia en el Trabajo' },
]

const initialForm = {
  tipoAcoso: '',
  descripcion: '',
  anonima: false,
}

export default function KarinPage() {
  const [denuncias, setDenuncias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchDenuncias()
  }, [])

  const fetchDenuncias = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get('/api/karin/denuncias')
      if (result.success) {
        setDenuncias(result.data.denuncias || [])
      } else {
        setError(result.error || 'Error al cargar denuncias')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)
      const result = await apiClient.post('/api/karin/denuncias', form)
      if (result.success) {
        setShowModal(false)
        setForm(initialForm)
        fetchDenuncias()
      } else {
        setError(result.error || 'Error al crear denuncia')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateEstado = async (id, estado) => {
    try {
      setError(null)
      const result = await apiClient.put(`/api/karin/denuncias/${id}`, { estado })
      if (result.success) {
        fetchDenuncias()
        if (showDetail?.id === id) setShowDetail(null)
      } else {
        setError(result.error || 'Error al actualizar estado')
      }
    } catch (err) {
      setError('Error de conexión')
    }
  }

  const truncate = (text, maxLen = 50) => {
    if (!text) return '—'
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
  }

  const columns = [
    {
      header: 'Fecha',
      accessor: (row) => formatDate(row.fecha || row.createdAt),
    },
    { header: 'Tipo Acoso', accessor: 'tipoAcoso' },
    {
      header: 'Descripción',
      accessor: (row) => truncate(row.descripcion),
    },
    {
      header: 'Anónima',
      accessor: (row) => row.anonima ? 'Sí' : 'No',
    },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={
          row.estado === 'RESUELTA' ? 'success' :
          row.estado === 'EN_INVESTIGACION' ? 'warning' :
          row.estado === 'DESESTIMADA' ? 'danger' : 'default'
        }>
          {row.estado}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <Button variant="ghost" size="sm" onClick={() => setShowDetail(row)}>
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Ley Karin - Denuncias</h1>
        <Button onClick={() => { setForm(initialForm); setShowModal(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Denuncia
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Table columns={columns} data={denuncias} emptyMessage="No hay denuncias registradas" />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nueva Denuncia">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Tipo de Acoso" name="tipoAcoso" value={form.tipoAcoso} onChange={handleChange} required options={TIPOS_ACOSO} />
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              rows={4}
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="anonima" name="anonima" checked={form.anonima} onChange={handleChange} className="rounded border-[#E5E7EB]" />
            <label htmlFor="anonima" className="text-sm text-[#111827]">Denuncia anónima</label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Enviar Denuncia</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!showDetail} onClose={() => setShowDetail(null)} title="Detalle de Denuncia">
        {showDetail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#6B7280]">Fecha</p>
                <p className="font-medium text-[#111827]">{formatDate(showDetail.fecha || showDetail.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Tipo</p>
                <p className="font-medium text-[#111827]">{showDetail.tipoAcoso}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Anónima</p>
                <p className="font-medium text-[#111827]">{showDetail.anonima ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Estado</p>
                <Badge variant={showDetail.estado === 'RESUELTA' ? 'success' : 'warning'}>
                  {showDetail.estado}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] mb-1">Descripción</p>
              <p className="text-sm text-[#111827] bg-gray-50 p-3 rounded-lg">{showDetail.descripcion}</p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E5E7EB]">
              <Button variant="outline" size="sm" onClick={() => handleUpdateEstado(showDetail.id, 'EN_INVESTIGACION')}>
                En Investigación
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleUpdateEstado(showDetail.id, 'RESUELTA')}>
                Resuelta
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleUpdateEstado(showDetail.id, 'DESESTIMADA')}>
                Desestimada
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
