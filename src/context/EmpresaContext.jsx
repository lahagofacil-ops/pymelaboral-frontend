import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'

const EmpresaContext = createContext(null)

export function EmpresaProvider({ children }) {
  const { user } = useAuth()

  const [impersonatedEmpresaId, setImpersonatedEmpresaId] = useState(() => {
    return sessionStorage.getItem('impersonatedEmpresaId') || null
  })
  const [impersonatedEmpresaNombre, setImpersonatedEmpresaNombre] = useState(() => {
    return sessionStorage.getItem('impersonatedEmpresaNombre') || null
  })

  const isImpersonating = !!impersonatedEmpresaId

  const empresaId = isImpersonating ? impersonatedEmpresaId : (user?.empresaId || null)
  const empresaNombre = isImpersonating ? impersonatedEmpresaNombre : (user?.empresaNombre || null)

  const enterEmpresa = useCallback((id, nombre) => {
    sessionStorage.setItem('impersonatedEmpresaId', id)
    sessionStorage.setItem('impersonatedEmpresaNombre', nombre)
    setImpersonatedEmpresaId(id)
    setImpersonatedEmpresaNombre(nombre)
  }, [])

  const exitEmpresa = useCallback(() => {
    sessionStorage.removeItem('impersonatedEmpresaId')
    sessionStorage.removeItem('impersonatedEmpresaNombre')
    setImpersonatedEmpresaId(null)
    setImpersonatedEmpresaNombre(null)
  }, [])

  return (
    <EmpresaContext.Provider value={{ empresaId, empresaNombre, isImpersonating, enterEmpresa, exitEmpresa }}>
      {children}
    </EmpresaContext.Provider>
  )
}

export function useEmpresa() {
  const ctx = useContext(EmpresaContext)
  if (!ctx) throw new Error('useEmpresa must be used within EmpresaProvider')
  return ctx
}
