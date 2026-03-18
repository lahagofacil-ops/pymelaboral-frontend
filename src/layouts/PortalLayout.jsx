import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileCheck, CalendarDays, FileText, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/portal', icon: LayoutDashboard, label: 'Inicio', end: true },
  { to: '/portal/liquidaciones', icon: FileCheck, label: 'Liquidaciones' },
  { to: '/portal/vacaciones', icon: CalendarDays, label: 'Vacaciones' },
  { to: '/portal/permisos', icon: FileText, label: 'Permisos' }
]

export default function PortalLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#2563EB]">PymeLaboral</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#6B7280]">{user?.nombre || 'Trabajador'}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-[#DC2626] hover:text-red-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Tab Nav */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto flex gap-1 px-6 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-[#2563EB] text-[#2563EB] font-medium'
                    : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
