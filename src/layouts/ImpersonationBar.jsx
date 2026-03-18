import { useEmpresa } from '../context/EmpresaContext'

export default function ImpersonationBar() {
  const { isImpersonating, empresaNombre, exitEmpresa } = useEmpresa()

  if (!isImpersonating) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
      <span className="text-sm text-[#D97706] font-medium">
        Estás viendo como: {empresaNombre}
      </span>
      <button
        onClick={exitEmpresa}
        className="text-sm text-[#D97706] font-medium hover:text-amber-800 underline"
      >
        Salir
      </button>
    </div>
  )
}
