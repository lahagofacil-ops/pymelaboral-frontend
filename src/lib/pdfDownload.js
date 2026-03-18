const BASE_URL = import.meta.env.VITE_API_URL || ''

export const downloadPDF = async (endpoint, filename) => {
  const token = sessionStorage.getItem('accessToken')
  const empresaId = sessionStorage.getItem('impersonatedEmpresaId')

  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (empresaId) headers['X-Empresa-Id'] = empresaId

  const response = await fetch(`${BASE_URL}${endpoint}`, { headers })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || 'Error al descargar PDF')
  }

  const blob = await response.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
