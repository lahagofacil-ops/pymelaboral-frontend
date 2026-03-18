export default function Table({ columns = [], data = [], loading = false, emptyMessage = 'Sin datos' }) {
  const safeData = Array.isArray(data) ? data : []

  if (loading) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-gray-50">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 font-medium text-[#6B7280]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-[#E5E7EB]">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
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
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 font-medium text-[#6B7280]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeData.map((row, idx) => (
              <tr key={row.id || idx} className="border-b border-[#E5E7EB] hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-[#111827]">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
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
