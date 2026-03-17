import { useState, useCallback, useRef } from 'react'
import { apiClient } from '../api/client'

export function useApi(method, url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const urlRef = useRef(url)
  urlRef.current = url

  const execute = useCallback(async (bodyOrOverrideUrl = null, body = null) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      let finalUrl = urlRef.current
      let finalBody = bodyOrOverrideUrl

      // If first arg is a string, treat it as URL override
      if (typeof bodyOrOverrideUrl === 'string') {
        finalUrl = bodyOrOverrideUrl
        finalBody = body
      }

      const res = await apiClient[method](finalUrl, finalBody)

      if (res.success) {
        setData(res.data)
      } else {
        setError(res.error || 'Error desconocido')
      }

      return res
    } catch (err) {
      const msg = err.message || 'Error inesperado'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [method])

  const refetch = useCallback(() => {
    return execute()
  }, [execute])

  return { data, loading, error, execute, refetch }
}
