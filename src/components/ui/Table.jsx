export default function Table({ columns = [], data = [], loading = false, emptyMessage = 'Sin datos' }) {
  const safeData = Array.isArray(data) ? data : []

  // Normalize columns: support both {key, label, render} and {header, accessor}
  const normalizedColumns = columns.map((col, idx) => {
    if (col.key !== undefined) return col
    // Convert {header, accessor} to {key, label, render}
    const key = typeof col.accessor === 'string' ? col.accessor : `col_${idx}`
    const label = col.header || col.label || ''
    const render = typeof col.accessor === 'function'
      ? (_val, row) => col.accessor(row)
      : undefined
    return { key, label, render }
  })

  if (loading) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-gray-50">
              {normalizedColumns.map((col, i) => (
                <th key={col.key || i} className="text-left px-4 py-3 font-medium text-[#6B7280]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-[#E5E7EB]">
                {normalizedColumns.map((col, j) => (
                  <td key={col.key || j} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (safeData.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center text-[#6B7280] text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-gray-50">
              {normalizedColumns.map((col, i) => (
                <th key={col.key || i} className="text-left px-4 py-3 font-medium text-[#6B7280]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeData.map((row, idx) => (
              <tr key={row.id || idx} className="border-b border-[#E5E7EB] hover:bg-gray-50 transition-colors">
                {normalizedColumns.map((col, j) => (
                  <td key={col.key || j} className="px-4 py-3 text-[#111827]">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
