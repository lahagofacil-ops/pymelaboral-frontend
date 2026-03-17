const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

let isRefreshing = false
let refreshPromise = null

async function refreshTokens() {
  const refreshToken = sessionStorage.getItem('refreshToken')
  if (!refreshToken) return false

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const data = await res.json()
    if (data.success) {
      sessionStorage.setItem('accessToken', data.data.accessToken)
      sessionStorage.setItem('refreshToken', data.data.refreshToken)
      sessionStorage.setItem('user', JSON.stringify(data.data.user))
      return true
    }
    return false
  } catch {
    return false
  }
}

async function request(method, url, body = null) {
  const fullUrl = `${BASE_URL}${url}`

  const buildHeaders = () => {
    const headers = { 'Content-Type': 'application/json' }
    const token = sessionStorage.getItem('accessToken')
    if (token) headers['Authorization'] = `Bearer ${token}`
    const empresaId = sessionStorage.getItem('impersonatedEmpresaId')
    if (empresaId) headers['X-Empresa-Id'] = empresaId
    return headers
  }

  const buildOptions = () => {
    const options = { method, headers: buildHeaders() }
    if (body && method !== 'GET') options.body = JSON.stringify(body)
    return options
  }

  try {
    let res = await fetch(fullUrl, buildOptions())

    if (res.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true
        refreshPromise = refreshTokens()
      }
      const refreshed = await refreshPromise
      isRefreshing = false
      refreshPromise = null

      if (refreshed) {
        res = await fetch(fullUrl, buildOptions())
        return await res.json()
      } else {
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('refreshToken')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('impersonatedEmpresaId')
        sessionStorage.removeItem('impersonatedEmpresaNombre')
        window.location.href = '/login'
        return { success: false, error: 'Sesión expirada' }
      }
    }

    return await res.json()
  } catch {
    return { success: false, error: 'Error de conexión' }
  }
}

export const apiClient = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  put: (url, body) => request('PUT', url, body),
  delete: (url) => request('DELETE', url),
}
