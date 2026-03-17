export default function Table({ columns = [], data = [], emptyMessage = 'No hay datos', loading = false }) {
  if (loading) {
    return (
      <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E5E7EB]">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium text-[#6B7280]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-[#E5E7EB]">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-[#E5E7EB]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium text-[#6B7280]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-[#6B7280]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id || i} className="border-b border-[#E5E7EB] last:border-b-0 hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-[#111827]">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
