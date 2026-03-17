import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Link as LinkIcon } from 'lucide-react'
import { get } from '../../api/client'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'

export default function CompliancePage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const res = await get('/api/compliance')
        if (res.success) setData(res.data)
      } catch (err) {
        setError(err.message)
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

  const porcentaje = data?.resumen?.porcentaje ?? 0
  const checks = data?.checks || []

  const getColorForPercentage = (pct) => {
    if (pct >= 80) return { text: 'text-[#059669]', bg: 'bg-green-50', border: 'border-green-200', ring: 'stroke-[#059669]' }
    if (pct >= 50) return { text: 'text-[#D97706]', bg: 'bg-yellow-50', border: 'border-yellow-200', ring: 'stroke-[#D97706]' }
    return { text: 'text-[#DC2626]', bg: 'bg-red-50', border: 'border-red-200', ring: 'stroke-[#DC2626]' }
  }

  const colors = getColorForPercentage(porcentaje)
  const circumference = 2 * Math.PI * 60
  const strokeDashoffset = circumference - (porcentaje / 100) * circumference

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Compliance Laboral</h1>
        <p className="text-sm text-[#6B7280]">Estado de cumplimiento de obligaciones laborales</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      {/* Percentage circle */}
      <div className={`${colors.bg} border ${colors.border} rounded-xl p-8 mb-8 flex flex-col items-center`}>
        <div className="relative w-40 h-40 mb-4">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="10"
            />
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              className={colors.ring}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${colors.text}`}>{porcentaje}%</span>
          </div>
        </div>
        <p className={`text-lg font-semibold ${colors.text}`}>
          {porcentaje >= 80 ? 'Buen Cumplimiento' : porcentaje >= 50 ? 'Cumplimiento Parcial' : 'Cumplimiento Bajo'}
        </p>
        <p className="text-sm text-[#6B7280] mt-1">
          {data?.resumen?.cumplidos || 0} de {data?.resumen?.total || 0} requisitos cumplidos
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {checks.map((check, index) => (
          <div
            key={check.id || index}
            className={`bg-white rounded-lg border p-4 flex items-start gap-4 ${
              check.cumple ? 'border-green-200' : 'border-red-200'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {check.cumple ? (
                <CheckCircle className="w-5 h-5 text-[#059669]" />
              ) : (
                <XCircle className="w-5 h-5 text-[#DC2626]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-[#111827]">{check.nombre}</h4>
                {check.obligatorio && (
                  <Badge variant="danger">Obligatorio</Badge>
                )}
              </div>
              {check.descripcion && (
                <p className="text-sm text-[#6B7280]">{check.descripcion}</p>
              )}
              {!check.cumple && check.accion && (
                <a
                  href={check.accion}
                  className="inline-flex items-center gap-1 mt-2 text-sm text-[#2563EB] hover:text-[#1E40AF] font-medium"
                >
                  <LinkIcon className="w-3 h-3" />
                  Resolver
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {checks.length === 0 && !loading && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-[#E5E7EB] mx-auto mb-4" />
          <p className="text-sm text-[#6B7280]">No se encontraron items de compliance.</p>
        </div>
      )}
    </div>
  )
}
