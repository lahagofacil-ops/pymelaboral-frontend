import { useState, useCallback, useEffect, useRef } from 'react'
import { get, post, put, del } from '../api/client'

const methods = { GET: get, POST: post, PUT: put, DELETE: del }

export function useApi(initialUrl = null, initialMethod = 'GET') {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const lastCallRef = useRef({ method: initialMethod, url: initialUrl, body: null })

  const execute = useCallback(async (method, url, body) => {
    setLoading(true)
    setError(null)
    lastCallRef.current = { method, url, body }

    try {
      const fn = methods[method.toUpperCase()]
      if (!fn) throw new Error(`Unsupported method: ${method}`)

      const result = method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE'
        ? await fn(url, body)
        : await fn(url, body)

      setData(result)
      return result
    } catch (err) {
      setError(err.message || 'Error en la solicitud')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    const { method, url, body } = lastCallRef.current
    if (url) {
      return execute(method, url, body)
    }
  }, [execute])

  useEffect(() => {
    if (initialUrl) {
      execute(initialMethod, initialUrl)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, execute, refetch }
}

export default useApi
