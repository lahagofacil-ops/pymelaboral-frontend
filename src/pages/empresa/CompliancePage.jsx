import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { apiClient } from '../../api/client'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'

export default function CompliancePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const res = await apiClient.get('/api/compliance')
        if (res.success) {
          setItems(Array.isArray(res.data) ? res.data : res.data?.items || [])
        } else {
          setError(res.error || 'Error al cargar compliance')
        }
      } catch {
        setError('Error de conexion')
      } finally {
        setLoading(false)
      }
    }
    fetchCompliance()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'ok':
      case 'success':
      case 'cumple':
        return { icon: CheckCircle, color: 'text-[#059669]', bg: 'bg-green-50 border-green-200' }
      case 'warning':
      case 'parcial':
        return { icon: AlertTriangle, color: 'text-[#D97706]', bg: 'bg-yellow-50 border-yellow-200' }
      case 'critical':
      case 'error':
      case 'no_cumple':
        return { icon: XCircle, color: 'text-[#DC2626]', bg: 'bg-red-50 border-red-200' }
      default:
        return { icon: AlertTriangle, color: 'text-[#6B7280]', bg: 'bg-gray-50 border-gray-200' }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Compliance Laboral</h1>
        <p className="text-[#6B7280] mt-1">Estado de cumplimiento normativo de tu empresa</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#E5E7EB] rounded-xl">
          <CheckCircle className="w-12 h-12 text-[#E5E7EB] mx-auto mb-4" />
          <p className="text-[#6B7280]">No hay items de compliance disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const config = getStatusConfig(item.status || item.estado)
            const Icon = config.icon
            return (
              <div
                key={item.id || i}
                className={`border rounded-xl p-5 ${config.bg}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.color}`} />
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827]">{item.titulo || item.name || item.label}</h3>
                    <p className="text-sm text-[#6B7280] mt-1">{item.descripcion || item.description || item.message}</p>
                    {item.recomendacion && (
                      <p className="text-xs text-[#6B7280] mt-2 italic">{item.recomendacion}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
