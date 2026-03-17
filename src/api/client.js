const BASE_URL = import.meta.env.VITE_API_URL || ''

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  }

  const token = sessionStorage.getItem('accessToken')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const empresaId = sessionStorage.getItem('empresaId')
  if (empresaId) {
    headers['X-Empresa-Id'] = empresaId
  }

  return headers
}

async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem('refreshToken')
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    sessionStorage.clear()
    window.location.href = '/login'
    throw new Error('Session expired')
  }

  const result = await response.json()
  if (result.success && result.data) {
    sessionStorage.setItem('accessToken', result.data.accessToken)
    if (result.data.refreshToken) {
      sessionStorage.setItem('refreshToken', result.data.refreshToken)
    }
    return result.data.accessToken
  }

  sessionStorage.clear()
  window.location.href = '/login'
  throw new Error('Session expired')
}

async function request(method, path, body) {
  let response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401) {
    try {
      await refreshAccessToken()
      response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      })
    } catch {
      sessionStorage.clear()
      window.location.href = '/login'
      throw new Error('Session expired')
    }
  }

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.error || `Request failed with status ${response.status}`)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const get = (path) => request('GET', path)
export const post = (path, body) => request('POST', path, body)
export const put = (path, body) => request('PUT', path, body)
export const del = (path, body) => request('DELETE', path, body)

export default { get, post, put, del }
