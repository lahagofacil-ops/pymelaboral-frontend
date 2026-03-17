import { createContext, useState, useEffect, useCallback } from 'react'

export const EmpresaContext = createContext(null)

export function EmpresaProvider({ children }) {
  const [empresaId, setEmpresaId] = useState(null)
  const [empresaData, setEmpresaData] = useState(null)
  const [isImpersonating, setIsImpersonating] = useState(false)

  useEffect(() => {
    const storedEmpresaId = sessionStorage.getItem('empresaId')
    const storedEmpresaData = sessionStorage.getItem('empresaData')
    const storedIsImpersonating = sessionStorage.getItem('isImpersonating')

    if (storedEmpresaId) {
      setEmpresaId(storedEmpresaId)
    }
    if (storedEmpresaData) {
      try {
        setEmpresaData(JSON.parse(storedEmpresaData))
      } catch {
        setEmpresaData(null)
      }
    }
    if (storedIsImpersonating === 'true') {
      setIsImpersonating(true)
    }
  }, [])

  const startImpersonation = useCallback((id, data) => {
    setEmpresaId(id)
    setEmpresaData(data)
    setIsImpersonating(true)
    sessionStorage.setItem('empresaId', id)
    sessionStorage.setItem('empresaData', JSON.stringify(data))
    sessionStorage.setItem('isImpersonating', 'true')
  }, [])

  const stopImpersonation = useCallback(() => {
    setEmpresaId(null)
    setEmpresaData(null)
    setIsImpersonating(false)
    sessionStorage.removeItem('empresaId')
    sessionStorage.removeItem('empresaData')
    sessionStorage.removeItem('isImpersonating')
  }, [])

  const value = {
    empresaId,
    empresaData,
    isImpersonating,
    startImpersonation,
    stopImpersonation,
  }

  return (
    <EmpresaContext.Provider value={value}>
      {children}
    </EmpresaContext.Provider>
  )
}
