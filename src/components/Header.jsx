import { useAuth } from '../context/AuthContext'
import { useEmpresa } from '../context/EmpresaContext'
import { LogOut } from 'lucide-react'
import Badge from './ui/Badge'
import { roleLabel, getInitials } from '../lib/utils'

export default function Header({ title = 'PymeLaboral' }) {
  const { user, logout } = useAuth()
  const { empresaNombre, isImpersonating } = useEmpresa()

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between shrink-0">
      <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>

      <div className="flex items-center gap-4">
        {isImpersonating && empresaNombre && (
          <Badge variant="info">{empresaNombre}</Badge>
        )}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-sm font-medium">
            {getInitials(user?.nombre || '')}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-[#111827]">{user?.nombre}</p>
            <p className="text-xs text-[#6B7280]">{roleLabel(user?.role)}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-lg text-[#6B7280] hover:bg-gray-100 transition-colors"
          title="Cerrar sesion"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
