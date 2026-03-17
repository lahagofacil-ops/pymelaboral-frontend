import { useState, useEffect } from 'react'
import { get } from '../../api/client'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { formatMoney, formatDate } from '../../lib/formatters'
import { TIPO_CONTRATO } from '../../lib/constants'

export default function MiContrato() {
  const [contratos, setContratos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const res = await get('/api/contratos?limit=10')
        if (res.success) setContratos(res.data.contratos || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchContratos()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  const vigente = contratos.find((c) => c.estado === 'VIGENTE') || contratos[0]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Mi Contrato</h1>
        <p className="text-sm text-[#6B7280]">Información de tu contrato vigente</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {!vigente ? (
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-12 text-center">
          <p className="text-[#6B7280]">No tienes contratos registrados.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#111827]">Contrato de Trabajo</h2>
            <Badge variant={vigente.estado === 'VIGENTE' ? 'success' : 'neutral'}>
              {vigente.estado}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Tipo de Contrato</p>
              <p className="text-sm font-medium text-[#111827]">
                {TIPO_CONTRATO.find((t) => t.value === vigente.tipo)?.label || vigente.tipo}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Cargo</p>
              <p className="text-sm font-medium text-[#111827]">{vigente.cargo || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Funciones</p>
              <p className="text-sm text-[#111827]">{vigente.funciones || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Sueldo Base</p>
              <p className="text-lg font-bold text-[#2563EB]">{formatMoney(vigente.sueldoBase)}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Fecha de Inicio</p>
              <p className="text-sm font-medium text-[#111827]">{formatDate(vigente.fechaInicio)}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Fecha de Término</p>
              <p className="text-sm font-medium text-[#111827]">
                {vigente.fechaTermino ? formatDate(vigente.fechaTermino) : 'Indefinido'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Horas Semanales</p>
              <p className="text-sm font-medium text-[#111827]">{vigente.horasSemanales || 45}h</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Tipo de Jornada</p>
              <p className="text-sm font-medium text-[#111827]">{vigente.jornadaTipo || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Lugar de Trabajo</p>
              <p className="text-sm font-medium text-[#111827]">{vigente.lugarTrabajo || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Gratificación</p>
              <Badge variant={vigente.gratificacion ? 'success' : 'neutral'}>
                {vigente.gratificacion ? 'Sí' : 'No'}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
