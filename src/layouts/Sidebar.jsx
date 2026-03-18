import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEmpresa } from '../context/EmpresaContext'
import { classNames } from '../lib/utils'
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Receipt,
  Calculator,
  Clock,
  CalendarDays,
  FileCheck,
  FileMinus,
  Shield,
  CheckSquare,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Briefcase
} from 'lucide-react'

const empresaNav = [
  { to: '/empresa', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/empresa/trabajadores', icon: Users, label: 'Trabajadores' },
  { to: '/empresa/contratos', icon: FileText, label: 'Contratos' },
  { to: '/empresa/liquidaciones', icon: Receipt, label: 'Liquidaciones' },
  { to: '/empresa/cotizaciones', icon: Calculator, label: 'Cotizaciones' },
  { to: '/empresa/asistencia', icon: Clock, label: 'Asistencia' },
  { to: '/empresa/vacaciones', icon: CalendarDays, label: 'Vacaciones' },
  { to: '/empresa/permisos', icon: FileCheck, label: 'Permisos' },
  { to: '/empresa/finiquitos', icon: FileMinus, label: 'Finiquitos' },
  { to: '/empresa/ley-karin', icon: Shield, label: 'Ley Karin' },
  { to: '/empresa/compliance', icon: CheckSquare, label: 'Compliance' },
  { to: '/empresa/documentos', icon: FolderOpen, label: 'Documentos' },
  { to: '/empresa/configuracion', icon: Settings, label: 'Configuración' }
]

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/empresas', icon: Building2, label: 'Empresas' },
  { to: '/admin/supervisoras', icon: Briefcase, label: 'Supervisoras' }
]

const supervisorNav = [
  { to: '/supervisor', icon: LayoutDashboard, label: 'Dashboard', end: true }
]

const workerNav = [
  { to: '/portal', icon: User, label: 'Mi Portal', end: true },
  { to: '/portal/liquidaciones', icon: Receipt, label: 'Mis Liquidaciones' },
  { to: '/portal/vacaciones', icon: CalendarDays, label: 'Mis Vacaciones' },
  { to: '/portal/permisos', icon: FileCheck, label: 'Mis Permisos' }
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { isImpersonating } = useEmpresa()
  const [mobileOpen, setMobileOpen] = useState(false)

  let navItems = []
  const role = user?.role

  if (role === 'WORKER') {
    navItems = workerNav
  } else if (role === 'SUPER_ADMIN' && !isImpersonating) {
    navItems = adminNav
  } else if (role === 'SUPERVISOR' && !isImpersonating) {
    navItems = supervisorNav
  } else {
    navItems = empresaNav
  }

  const NavContent = () => (
    <>
      <div className="px-4 py-6 border-b border-[#E5E7EB]">
        <h1 className="text-xl font-bold text-[#2563EB]">PymeLab</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">Gestión Laboral</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-[#2563EB]'
                  : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[#E5E7EB]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-gray-50 hover:text-[#111827] transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-white border border-[#E5E7EB] shadow-sm"
      >
        <Menu className="h-5 w-5 text-[#111827]" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={classNames(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E5E7EB] flex flex-col transform transition-transform',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-[#6B7280]"
        >
          <X className="h-5 w-5" />
        </button>
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-[#E5E7EB]">
        <NavContent />
      </aside>
    </>
  )
}
