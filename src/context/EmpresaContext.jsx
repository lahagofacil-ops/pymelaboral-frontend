import { createContext, useContext, useState } from 'react'

const EmpresaContext = createContext(null)

export function EmpresaProvider({ children }) {
  const [empresaId, setEmpresaId] = useState(() => sessionStorage.getItem('impersonatedEmpresaId'))
  const [empresaNombre, setEmpresaNombre] = useState(() => sessionStorage.getItem('impersonatedEmpresaNombre'))

  const enterEmpresa = (id, nombre) => {
    sessionStorage.setItem('impersonatedEmpresaId', id)
    sessionStorage.setItem('impersonatedEmpresaNombre', nombre)
    setEmpresaId(id)
    setEmpresaNombre(nombre)
  }

  const exitEmpresa = () => {
    sessionStorage.removeItem('impersonatedEmpresaId')
    sessionStorage.removeItem('impersonatedEmpresaNombre')
    setEmpresaId(null)
    setEmpresaNombre(null)
  }

  const isImpersonating = !!empresaId

  return (
    <EmpresaContext.Provider value={{ empresaId, empresaNombre, isImpersonating, enterEmpresa, exitEmpresa }}>
      {children}
    </EmpresaContext.Provider>
  )
}

export function useEmpresa() {
  const context = useContext(EmpresaContext)
  if (!context) {
    throw new Error('useEmpresa must be used within an EmpresaProvider')
  }
  return context
}
