import { useState, useEffect } from 'react'
import { Building2, Users, Briefcase, MessageSquare } from 'lucide-react'
import { apiClient } from '../../api/client'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-[#6B7280]">{label}</p>
        <p className="text-2xl font-bold text-[#111827]">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/api/admin/stats')
        if (res.success) {
          setStats(res.data)
        } else {
          setError(res.error || 'Error al cargar estadísticas')
        }
      } catch {
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-[#DC2626] rounded-lg p-4">
        {error}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Building2}
          label="Empresas"
          value={stats?.empresas ?? 0}
          color="bg-[#2563EB]"
        />
        <StatCard
          icon={Users}
          label="Usuarios"
          value={stats?.usuarios ?? 0}
          color="bg-[#1E40AF]"
        />
        <StatCard
          icon={Briefcase}
          label="Trabajadores"
          value={stats?.trabajadores ?? 0}
          color="bg-[#059669]"
        />
        <StatCard
          icon={MessageSquare}
          label="Consultas IA Hoy"
          value={stats?.consultasIAHoy ?? 0}
          color="bg-[#D97706]"
        />
      </div>
    </div>
  )
}
