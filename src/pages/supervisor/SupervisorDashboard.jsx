import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, LogIn } from 'lucide-react'
import { apiClient } from '../../api/client'
import { useEmpresa } from '../../context/EmpresaContext'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'

export default function SupervisorDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { enterEmpresa } = useEmpresa()
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await apiClient.get('/api/admin/empresas')
        if (res.success) {
          setEmpresas(res.data)
        } else {
          setError(res.error || 'Error al cargar empresas')
        }
      } catch {
        setError('Error de conexion')
      } finally {
        setLoading(false)
      }
    }
    fetchEmpresas()
  }, [])

  const handleEntrar = (empresa) => {
    enterEmpresa(empresa.id, empresa.razonSocial)
    navigate('/empresa')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Hola, {user?.nombre || 'Supervisora'}</h1>
        <p className="text-[#6B7280] mt-1">Selecciona una empresa para gestionar</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {empresas.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#E5E7EB] rounded-xl">
          <Building2 className="w-12 h-12 text-[#E5E7EB] mx-auto mb-4" />
          <p className="text-[#6B7280]">No tienes empresas asignadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {empresas.map((empresa) => (
            <div
              key={empresa.id}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-[#2563EB]" />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-[#2563EB]">
                  {(empresa.plan || '').charAt(0).toUpperCase() + (empresa.plan || '').slice(1)}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#111827] mb-1">{empresa.razonSocial}</h3>
              <div className="flex items-center gap-1 text-sm text-[#6B7280] mb-4">
                <Users className="w-4 h-4" />
                <span>{empresa.trabajadoresCount ?? empresa._count?.trabajadores ?? 0} trabajadores</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleEntrar(empresa)}
              >
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
