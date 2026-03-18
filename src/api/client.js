const BASE_URL = import.meta.env.VITE_API_URL || ''

const getAccessToken = () => sessionStorage.getItem('accessToken')
const getRefreshToken = () => sessionStorage.getItem('refreshToken')
const getImpersonatedEmpresaId = () => sessionStorage.getItem('impersonatedEmpresaId')

const setTokens = (accessToken, refreshToken) => {
  sessionStorage.setItem('accessToken', accessToken)
  if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken)
}

const clearSession = () => {
  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('refreshToken')
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('impersonatedEmpresaId')
  sessionStorage.removeItem('impersonatedEmpresaNombre')
  window.location.href = '/login'
}

const attemptRefresh = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })

    if (!res.ok) return false

    const json = await res.json()
    if (json.success && json.data?.accessToken) {
      setTokens(json.data.accessToken, json.data.refreshToken)
      return true
    }
    return false
  } catch {
    return false
  }
}

const request = async (method, url, body = null) => {
  const makeRequest = async () => {
    const headers = { 'Content-Type': 'application/json' }

    const token = getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const empresaId = getImpersonatedEmpresaId()
    if (empresaId) {
      headers['X-Empresa-Id'] = empresaId
    }

    const options = { method, headers }
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body)
    }

    return fetch(`${BASE_URL}${url}`, options)
  }

  try {
    let res = await makeRequest()

    if (res.status === 401) {
      const refreshed = await attemptRefresh()
      if (refreshed) {
        res = await makeRequest()
      } else {
        clearSession()
        return { success: false, data: null, error: 'Sesión expirada' }
      }
    }

    const json = await res.json()
    return {
      success: json.success ?? res.ok,
      data: json.data ?? json,
      error: json.error ?? (res.ok ? null : 'Error del servidor')
    }
  } catch {
    return { success: false, data: null, error: 'Error de conexión' }
  }
}

export const apiClient = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  put: (url, body) => request('PUT', url, body),
  delete: (url) => request('DELETE', url)
}
