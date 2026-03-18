import { useAuth } from '../context/AuthContext'
import { useEmpresa } from '../context/EmpresaContext'
import { useNavigate } from 'react-router-dom'
import { Building2, LogOut } from 'lucide-react'
import { roleLabel } from '../lib/utils'

export default function Header() {
  const { user } = useAuth()
  const { isImpersonating, empresaNombre, exitEmpresa } = useEmpresa()
  const navigate = useNavigate()

  const displayEmpresa = isImpersonating ? empresaNombre : user?.empresaNombre

  const handleExitEmpresa = () => {
    exitEmpresa()
    navigate('/admin')
  }

  return (
    <header className="bg-white border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {displayEmpresa && (
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <Building2 className="h-4 w-4" />
            <span>{displayEmpresa}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isImpersonating && (
          <button
            onClick={handleExitEmpresa}
            className="text-sm text-[#D97706] font-medium hover:text-amber-800 flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            Salir de empresa
          </button>
        )}
        <div className="text-right">
          <p className="text-sm font-medium text-[#111827]">{user?.nombre}</p>
          <p className="text-xs text-[#6B7280]">{roleLabel(user?.role)}</p>
        </div>
      </div>
    </header>
  )
}
