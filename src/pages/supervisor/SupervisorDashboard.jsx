import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, LogIn } from 'lucide-react'
import { get } from '../../api/client'
import { useEmpresa } from '../../hooks/useEmpresa'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { formatRut } from '../../lib/formatters'

export default function SupervisorDashboard() {
  const navigate = useNavigate()
  const { startImpersonation } = useEmpresa()
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await get('/api/admin/empresas?limit=1000')
        if (res.success) setEmpresas(res.data.empresas || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEmpresas()
  }, [])

  const handleEnter = (empresa) => {
    startImpersonation(empresa.id, empresa)
    navigate('/empresa/dashboard')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Mis Empresas Asignadas</h1>
        <p className="text-sm text-[#6B7280] mt-1">Selecciona una empresa para gestionar</p>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      {empresas.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-[#E5E7EB] mx-auto mb-4" />
          <h3 className="text-base font-medium text-[#111827] mb-1">Sin empresas asignadas</h3>
          <p className="text-sm text-[#6B7280]">No tienes empresas asignadas actualmente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empresas.map((empresa) => (
            <div
              key={empresa.id}
              className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-[#2563EB]" />
                </div>
                <Badge variant={empresa.activo ? 'success' : 'neutral'}>
                  {empresa.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-1">{empresa.razonSocial}</h3>
              <p className="text-sm text-[#6B7280] mb-1">{formatRut(empresa.rut)}</p>
              <div className="flex items-center gap-4 text-sm text-[#6B7280] mb-4">
                <Badge variant="info">{empresa.plan}</Badge>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {empresa.trabajadoresCount || 0} trabajadores
                </span>
              </div>
              <Button className="w-full" onClick={() => handleEnter(empresa)}>
                <LogIn className="w-4 h-4" />
                Entrar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
