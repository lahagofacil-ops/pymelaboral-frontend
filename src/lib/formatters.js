const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export function formatRut(rut) {
  if (!rut) return ''
  const clean = String(rut).replace(/[^0-9kK]/g, '')
  if (clean.length < 2) return clean

  const body = clean.slice(0, -1)
  const dv = clean.slice(-1).toUpperCase()

  let formatted = ''
  let count = 0
  for (let i = body.length - 1; i >= 0; i--) {
    formatted = body[i] + formatted
    count++
    if (count % 3 === 0 && i !== 0) {
      formatted = '.' + formatted
    }
  }

  return `${formatted}-${dv}`
}

export function formatMoney(amount) {
  if (amount == null || isNaN(amount)) return '$0'
  const num = Math.round(Number(amount))
  return '$' + num.toLocaleString('es-CL')
}

export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatPeriodo(periodo) {
  if (!periodo) return ''
  const [year, month] = periodo.split('-')
  const monthIndex = parseInt(month, 10) - 1
  if (monthIndex < 0 || monthIndex > 11) return periodo
  return `${MESES[monthIndex]} ${year}`
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
