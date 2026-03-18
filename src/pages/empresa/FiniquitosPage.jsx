import { useState, useEffect } from 'react'
import { Plus, Eye } from 'lucide-react'
import { apiClient } from '../../api/client'
import { formatCLP, formatDate } from '../../lib/utils'
import { CAUSAL_TERMINO } from '../../lib/constants'
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
  causal: '',
  fechaTermino: '',
}

export default function FiniquitosPage() {
  const [finiquitos, setFiniquitos] = useState([])
  const [trabajadores, setTrabajadores] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [finRes, trabRes] = await Promise.all([
        apiClient.get('/api/finiquitos'),
        apiClient.get('/api/trabajadores'),
      ])
      if (finRes.success) {
        setFiniquitos(finRes.data.finiquitos || [])
        if (finRes.data.pagination) setPagination(finRes.data.pagination)
      } else {
        setError(finRes.error || 'Error al cargar finiquitos')
      }
      if (trabRes.success) {
        setTrabajadores(Array.isArray(trabRes.data) ? trabRes.data : [])
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
      const result = await apiClient.post('/api/finiquitos', form)
      if (result.success) {
        setShowModal(false)
        setForm(initialForm)
        fetchData()
      } else {
        setError(result.error || 'Error al crear finiquito')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const causalOptions = Array.isArray(CAUSAL_TERMINO)
    ? CAUSAL_TERMINO.map((c) => ({ value: c, label: c }))
    : Object.entries(CAUSAL_TERMINO).map(([value, label]) => ({ value, label }))

  const columns = [
    {
      header: 'Trabajador',
      accessor: (row) => row.trabajador ? `${row.trabajador.nombre} ${row.trabajador.apellidoPaterno}` : '—',
    },
    {
      header: 'Causal',
      accessor: (row) => {
        if (typeof CAUSAL_TERMINO === 'object' && !Array.isArray(CAUSAL_TERMINO)) {
          return CAUSAL_TERMINO[row.causal] || row.causal
        }
        return row.causal
      },
    },
    {
      header: 'Fecha Término',
      accessor: (row) => formatDate(row.fechaTermino),
    },
    {
      header: 'Total',
      accessor: (row) => formatCLP(row.total),
    },
    {
      header: 'Estado',
      accessor: (row) => (
        <Badge variant={row.estado === 'PAGADO' ? 'success' : row.estado === 'GENERADO' ? 'warning' : 'default'}>
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
        <h1 className="text-2xl font-bold text-[#111827]">Finiquitos</h1>
        <Button onClick={() => { setForm(initialForm); setShowModal(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Finiquito
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Table columns={columns} data={finiquitos} emptyMessage="No hay finiquitos registrados" />

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

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo Finiquito">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Trabajador"
            name="trabajadorId"
            value={form.trabajadorId}
            onChange={handleChange}
            required
            options={trabajadores.map((t) => ({ value: t.id, label: `${t.nombre} ${t.apellidoPaterno}` }))}
          />
          <Select label="Causal de Término" name="causal" value={form.causal} onChange={handleChange} required options={causalOptions} />
          <Input label="Fecha de Término" name="fechaTermino" type="date" value={form.fechaTermino} onChange={handleChange} required />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Crear Finiquito</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!showDetail} onClose={() => setShowDetail(null)} title="Detalle de Finiquito">
        {showDetail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#6B7280]">Trabajador</p>
                <p className="font-medium text-[#111827]">
                  {showDetail.trabajador?.nombre} {showDetail.trabajador?.apellidoPaterno}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Causal</p>
                <p className="font-medium text-[#111827]">{showDetail.causal}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Fecha Término</p>
                <p className="font-medium text-[#111827]">{formatDate(showDetail.fechaTermino)}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Estado</p>
                <Badge variant={showDetail.estado === 'PAGADO' ? 'success' : 'warning'}>
                  {showDetail.estado}
                </Badge>
              </div>
            </div>
            {showDetail.desglose && (
              <div className="border-t border-[#E5E7EB] pt-4">
                <h3 className="font-semibold text-[#111827] mb-2">Desglose</h3>
                <div className="space-y-2">
                  {Object.entries(showDetail.desglose).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{key}</span>
                      <span className="text-[#111827]">{formatCLP(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="border-t border-[#E5E7EB] pt-4 flex justify-between">
              <span className="font-semibold text-[#111827]">Total</span>
              <span className="font-bold text-lg text-[#111827]">{formatCLP(showDetail.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
