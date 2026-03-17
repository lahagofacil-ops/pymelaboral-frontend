import { Building2, X } from 'lucide-react'
import { useEmpresa } from '../hooks/useEmpresa'

export default function ImpersonationBar() {
  const { empresaData, isImpersonating, stopImpersonation } = useEmpresa()

  if (!isImpersonating || !empresaData) return null

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-[#D97706]" />
        <span className="text-sm font-medium text-[#D97706]">
          Operando como: {empresaData.razonSocial || empresaData.nombre || 'Empresa'}
        </span>
      </div>
      <button
        onClick={stopImpersonation}
        className="inline-flex items-center gap-1 text-sm font-medium text-[#D97706] hover:text-[#DC2626] transition-colors"
      >
        <X className="w-4 h-4" />
        Salir de empresa
      </button>
    </div>
  )
}
