export function formatCLP(amount) {
  if (amount == null || isNaN(amount)) return '$0'
  return '$' + Math.round(Number(amount)).toLocaleString('es-CL')
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatDateTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

export function roleLabel(role) {
  const labels = {
    SUPER_ADMIN: 'Super Admin',
    SUPERVISOR: 'Supervisora',
    OWNER: 'Dueño',
    ADMIN: 'Administrador',
    WORKER: 'Trabajador'
  }
  return labels[role] || role
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ')
}
