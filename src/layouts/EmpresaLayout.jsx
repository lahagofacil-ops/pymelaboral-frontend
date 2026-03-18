import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, FileText, Calculator, Clock, CalendarDays,
  FileCheck, FileX, ShieldAlert, CheckCircle2, FolderOpen, Settings, LogOut, ArrowLeft
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEmpresa } from '../context/EmpresaContext'
import ChatWidget from '../components/ChatWidget'

const navItems = [
  { to: '/empresa', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/empresa/trabajadores', icon: Users, label: 'Trabajadores' },
  { to: '/empresa/contratos', icon: FileText, label: 'Contratos' },
  { to: '/empresa/liquidaciones', icon: FileCheck, label: 'Liquidaciones' },
  { to: '/empresa/cotizaciones', icon: Calculator, label: 'Cotizaciones' },
  { to: '/empresa/asistencia', icon: Clock, label: 'Asistencia' },
  { to: '/empresa/vacaciones', icon: CalendarDays, label: 'Vacaciones' },
  { to: '/empresa/permisos', icon: FileText, label: 'Permisos' },
  { to: '/empresa/finiquitos', icon: FileX, label: 'Finiquitos' },
  { to: '/empresa/karin', icon: ShieldAlert, label: 'Ley Karin' },
  { to: '/empresa/compliance', icon: CheckCircle2, label: 'Compliance' },
  { to: '/empresa/documentos', icon: FolderOpen, label: 'Documentos' },
  { to: '/empresa/configuracion', icon: Settings, label: 'Configuración' }
]

export default function EmpresaLayout() {
  const { user, logout } = useAuth()
  const { empresaNombre, isImpersonating, exitEmpresa } = useEmpresa()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleBack = () => {
    exitEmpresa()
    const role = user?.role || user?.rol
    if (role === 'SUPER_ADMIN') navigate('/admin')
    else if (role === 'SUPERVISOR') navigate('/supervisor')
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#E5E7EB]">
          <h2 className="text-lg font-bold text-[#2563EB]">PymeLaboral</h2>
          {empresaNombre && (
            <p className="text-xs text-[#6B7280] truncate">{empresaNombre}</p>
          )}
        </div>

        {isImpersonating && (
          <div className="px-3 pt-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#6B7280] hover:bg-gray-50 hover:text-[#111827] w-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-[#2563EB] font-medium'
                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-sm font-medium">
              {(user?.nombre || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111827] truncate">{user?.nombre || 'Usuario'}</p>
              <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#DC2626] hover:bg-red-50 w-full transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>

      <ChatWidget />
    </div>
  )
}
