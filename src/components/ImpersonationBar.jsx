import { useEmpresa } from '../context/EmpresaContext'

export default function ImpersonationBar() {
  const { empresaNombre, isImpersonating, exitEmpresa } = useEmpresa()

  if (!isImpersonating) return null

  return (
    <div className="bg-[#D97706] text-white px-4 py-2 flex items-center justify-between text-sm">
      <span>
        Estas viendo <strong>{empresaNombre}</strong>
      </span>
      <button
        onClick={exitEmpresa}
        className="px-3 py-1 bg-white text-[#D97706] rounded font-medium hover:bg-yellow-50 transition-colors"
      >
        Salir
      </button>
    </div>
  )
}
