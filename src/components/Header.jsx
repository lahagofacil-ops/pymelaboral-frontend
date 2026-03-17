import { Menu, LogOut } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEmpresa } from '../hooks/useEmpresa'
import Badge from './ui/Badge'

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/empresas': 'Empresas',
  '/admin/supervisoras': 'Supervisoras',
  '/admin/usuarios': 'Usuarios',
  '/supervisor': 'Dashboard',
  '/supervisor/empresas': 'Mis Empresas',
  '/empresa': 'Dashboard',
  '/empresa/trabajadores': 'Trabajadores',
  '/empresa/contratos': 'Contratos',
  '/empresa/liquidaciones': 'Liquidaciones',
  '/empresa/cotizaciones': 'Cotizaciones',
  '/empresa/asistencia': 'Asistencia',
  '/empresa/vacaciones': 'Vacaciones',
  '/empresa/permisos': 'Permisos',
  '/empresa/finiquitos': 'Finiquitos',
  '/empresa/karin': 'Ley Karin',
  '/empresa/documentos': 'Documentos',
  '/empresa/compliance': 'Compliance',
  '/empresa/configuracion': 'Configuración',
  '/portal': 'Mi Portal',
  '/portal/liquidaciones': 'Mis Liquidaciones',
  '/portal/contrato': 'Mi Contrato',
  '/portal/vacaciones': 'Mis Vacaciones',
  '/portal/asistencia': 'Asistencia',
}

const roleBadgeVariant = {
  SUPER_ADMIN: 'danger',
  SUPERVISOR: 'warning',
  OWNER: 'info',
  ADMIN: 'info',
  WORKER: 'neutral',
}

const roleLabels = {
  SUPER_ADMIN: 'Super Admin',
  SUPERVISOR: 'Supervisor',
  OWNER: 'Propietario',
  ADMIN: 'Administrador',
  WORKER: 'Trabajador',
}

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { empresaData, isImpersonating, stopImpersonation } = useEmpresa()
  const location = useLocation()

  const pageTitle = pageTitles[location.pathname] || 'PymeLaboral'

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-[#6B7280] hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-[#111827]">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        {isImpersonating && empresaData && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-[#D97706] font-medium">
              {empresaData.razonSocial || empresaData.nombre}
            </span>
            <button
              onClick={stopImpersonation}
              className="text-xs text-[#DC2626] hover:underline font-medium"
            >
              Salir
            </button>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-[#111827]">{user.nombre || user.email}</p>
              <Badge variant={roleBadgeVariant[user.role] || 'neutral'}>
                {roleLabels[user.role] || user.role}
              </Badge>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-[#6B7280] hover:bg-gray-100 hover:text-[#DC2626] transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
