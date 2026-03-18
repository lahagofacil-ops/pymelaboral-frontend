import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, ShieldCheck } from 'lucide-react'
import { apiClient } from '../../api/client'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

export default function CompliancePage() {
  const [resumen, setResumen] = useState(null)
  const [checks, setChecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCompliance()
  }, [])

  const fetchCompliance = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get('/api/compliance')
      if (result.success) {
        setResumen(result.data.resumen || null)
        setChecks(Array.isArray(result.data.checks) ? result.data.checks : [])
      } else {
        setError(result.error || 'Error al cargar compliance')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>
  if (error) return <Alert type="error">{error}</Alert>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#111827]">Compliance Laboral</h1>

      {resumen && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-6 text-center">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-[#2563EB]" />
            <p className="text-3xl font-bold text-[#111827]">{resumen.porcentaje}%</p>
            <p className="text-sm text-[#6B7280]">Cumplimiento</p>
          </Card>
          <Card className="p-6 text-center">
            <Badge variant={resumen.estado === 'CUMPLE' ? 'success' : resumen.estado === 'PARCIAL' ? 'warning' : 'danger'} className="text-lg px-4 py-1">
              {resumen.estado}
            </Badge>
            <p className="text-sm text-[#6B7280] mt-2">Estado General</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-3xl font-bold text-[#111827]">{resumen.cumplidos}/{resumen.total}</p>
            <p className="text-sm text-[#6B7280]">Requisitos Cumplidos</p>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#111827]">Verificaciones</h2>
        {checks.length === 0 ? (
          <p className="text-center text-[#6B7280] py-8">No hay verificaciones disponibles</p>
        ) : (
          checks.map((check, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  {check.cumple ? (
                    <CheckCircle className="w-6 h-6 text-[#059669]" />
                  ) : (
                    <XCircle className="w-6 h-6 text-[#DC2626]" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#111827]">{check.nombre}</h3>
                  <p className="text-sm text-[#6B7280] mt-1">{check.descripcion}</p>
                  {check.accion && !check.cumple && (
                    <a
                      href={check.accion}
                      className="text-sm text-[#2563EB] hover:underline mt-2 inline-block"
                    >
                      Resolver
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
