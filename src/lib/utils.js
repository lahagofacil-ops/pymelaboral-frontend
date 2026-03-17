/**
 * Format amount as Chilean pesos: $1.200.000
 */
export function formatCLP(amount) {
  if (amount == null || isNaN(amount)) return '$0'
  const num = Math.round(Number(amount))
  const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `$${formatted}`
}

/**
 * Format date string to DD/MM/YYYY
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Format Chilean RUT with dots and dash: 12.345.678-9
 */
export function formatRut(rut) {
  if (!rut) return ''
  const clean = rut.replace(/[^0-9kK]/g, '')
  if (clean.length < 2) return clean
  const body = clean.slice(0, -1)
  const dv = clean.slice(-1).toUpperCase()
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formatted}-${dv}`
}

/**
 * Join class names, filtering falsy values
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Get initials from a name (max 2 characters)
 */
export function getInitials(name) {
  if (!name) return ''
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('')
}

/**
 * Get Spanish label for a role
 */
export function roleLabel(role) {
  const labels = {
    SUPER_ADMIN: 'Super Admin',
    SUPERVISOR: 'Supervisora',
    OWNER: 'Dueño',
    ADMIN: 'Administrador',
    WORKER: 'Trabajador',
  }
  return labels[role] || role || ''
}
