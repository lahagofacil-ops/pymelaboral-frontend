import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useEmpresa } from '../../context/EmpresaContext'
import { apiClient } from '../../api/client'

const PLAN_COLORS = {
  STARTER: 'bg-blue-100 text-[#2563EB]',
  PROFESIONAL: 'bg-purple-100 text-purple-700',
  BUSINESS: 'bg-amber-100 text-amber-700'
}

export default function SupervisorDashboard() {
  const { user } = useAuth()
  const { enterEmpresa } = useEmpresa()
  const navigate = useNavigate()
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }
    fetchEmpresas()
  }, [])

  const handleEnter = (empresa) => {
    enterEmpresa(empresa.id, empresa.razonSocial)
    navigate('/empresa')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-2">
        Bienvenida, {user?.nombre || 'Supervisora'}
      </h1>
      <p className="text-[#6B7280] mb-6">Selecciona una empresa para gestionar</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-[#DC2626] rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {empresas.length === 0 && !error && (
        <div className="bg-gray-50 border border-[#E5E7EB] rounded-lg p-8 text-center">
          <Building2 className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
          <p className="text-[#6B7280]">No tienes empresas asignadas</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {empresas.map((emp) => (
          <div key={emp.id} className="bg-white rounded-lg border border-[#E5E7EB] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-semibold text-[#111827]">{emp.razonSocial}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLAN_COLORS[emp.plan] || 'bg-gray-100 text-gray-700'}`}>
                {emp.plan}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-4">
              <Users className="w-4 h-4" />
              <span>{emp._count?.trabajadores ?? 0} trabajadores</span>
            </div>
            <button
              onClick={() => handleEnter(emp)}
              className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg hover:bg-[#1E40AF] transition-colors text-sm cursor-pointer"
            >
              Entrar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
