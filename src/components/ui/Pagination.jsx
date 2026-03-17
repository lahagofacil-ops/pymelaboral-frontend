import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[#6B7280]">
        Página {currentPage} de {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-[#6B7280]">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${
                  page === currentPage
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#6B7280] hover:bg-gray-100'
                }
              `}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg text-[#6B7280] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
