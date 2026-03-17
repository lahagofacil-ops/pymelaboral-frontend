import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, Briefcase, MessageSquare, Plus } from 'lucide-react'
import { get } from '../../api/client'
import StatCard from '../../components/ui/StatCard'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import { formatRut } from '../../lib/formatters'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, empresasRes] = await Promise.all([
          get('/api/admin/stats'),
          get('/api/admin/empresas?limit=10'),
        ])
        if (statsRes.success) setStats(statsRes.data)
        if (empresasRes.success) setEmpresas(empresasRes.data.empresas || [])
      } catch (err) {
        setError(err.message || 'Error al cargar datos')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const columns = [
    { key: 'razonSocial', label: 'Razón Social' },
    {
      key: 'rut',
      label: 'RUT',
      render: (val) => formatRut(val),
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (val) => <Badge variant="info">{val}</Badge>,
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (val) => (
        <Badge variant={val ? 'success' : 'neutral'}>
          {val ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'trabajadoresCount',
      label: 'Trabajadores',
      render: (val) => val || 0,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
          <p className="text-sm text-[#6B7280]">Resumen general de la plataforma</p>
        </div>
        <Button onClick={() => navigate('/admin/empresas')}>
          <Plus className="w-4 h-4" />
          Crear Empresa
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Building2}
          label="Total Empresas"
          value={loading ? '...' : stats?.empresas ?? 0}
        />
        <StatCard
          icon={Users}
          label="Total Usuarios"
          value={loading ? '...' : stats?.usuarios ?? 0}
        />
        <StatCard
          icon={Briefcase}
          label="Total Trabajadores"
          value={loading ? '...' : stats?.trabajadores ?? 0}
        />
        <StatCard
          icon={MessageSquare}
          label="Consultas Chat Hoy"
          value={loading ? '...' : stats?.chatHoy ?? 0}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[#111827] mb-4">Empresas Recientes</h2>
        <Table
          columns={columns}
          data={empresas}
          loading={loading}
          emptyTitle="Sin empresas"
          emptyDescription="No hay empresas registradas aún."
        />
      </div>
    </div>
  )
}
