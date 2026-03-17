import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEmpresa } from '../context/EmpresaContext'
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
  FileX,
  Shield,
  FolderOpen,
  ClipboardCheck,
  Settings,
  UserCircle,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '../lib/utils'

const menuByRole = {
  SUPER_ADMIN: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/empresas', label: 'Empresas', icon: Building2 },
    { to: '/admin/supervisoras', label: 'Supervisoras', icon: Users },
  ],
  SUPERVISOR: [
    { to: '/supervisor', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/supervisor/empresas', label: 'Mis Empresas', icon: Building2 },
  ],
  EMPRESA: [
    { to: '/empresa', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/empresa/trabajadores', label: 'Trabajadores', icon: Users },
    { to: '/empresa/contratos', label: 'Contratos', icon: FileText },
    { to: '/empresa/liquidaciones', label: 'Liquidaciones', icon: Receipt },
    { to: '/empresa/cotizaciones', label: 'Cotizaciones', icon: Calculator },
    { to: '/empresa/asistencia', label: 'Asistencia', icon: Clock },
    { to: '/empresa/vacaciones', label: 'Vacaciones', icon: CalendarDays },
    { to: '/empresa/permisos', label: 'Permisos', icon: FileCheck },
    { to: '/empresa/finiquitos', label: 'Finiquitos', icon: FileX },
    { to: '/empresa/ley-karin', label: 'Ley Karin', icon: Shield },
    { to: '/empresa/documentos', label: 'Documentos', icon: FolderOpen },
    { to: '/empresa/compliance', label: 'Compliance', icon: ClipboardCheck },
    { to: '/empresa/configuracion', label: 'Configuracion', icon: Settings },
  ],
  WORKER: [
    { to: '/portal', label: 'Mi Portal', icon: UserCircle, end: true },
    { to: '/portal/liquidaciones', label: 'Mis Liquidaciones', icon: Receipt },
    { to: '/portal/asistencia', label: 'Asistencia', icon: Clock },
    { to: '/portal/vacaciones', label: 'Vacaciones', icon: CalendarDays },
    { to: '/portal/permisos', label: 'Permisos', icon: FileCheck },
  ],
}

function getMenuItems(role, isImpersonating) {
  if (isImpersonating) return menuByRole.EMPRESA
  if (role === 'OWNER' || role === 'ADMIN') return menuByRole.EMPRESA
  return menuByRole[role] || []
}

export default function Sidebar() {
  const { role, logout } = useAuth()
  const { empresaNombre, isImpersonating, exitEmpresa } = useEmpresa()
  const items = getMenuItems(role, isImpersonating)

  return (
    <aside className="w-64 h-screen bg-white border-r border-[#E5E7EB] flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-[#E5E7EB]">
        <h1 className="text-xl font-bold text-[#2563EB]">PymeLaboral</h1>
      </div>

      {isImpersonating && empresaNombre && (
        <div className="mx-3 mt-3 px-3 py-2 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs text-[#6B7280]">Viendo empresa</p>
              <p className="text-sm font-medium text-[#2563EB] truncate">{empresaNombre}</p>
            </div>
            <button
              onClick={exitEmpresa}
              className="p-1 rounded hover:bg-blue-100 text-[#2563EB] shrink-0"
              title="Salir de empresa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end || false}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#6B7280] hover:bg-blue-50 hover:text-[#2563EB]'
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[#E5E7EB]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-red-50 hover:text-[#DC2626] transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesion
        </button>
      </div>
    </aside>
  )
}
