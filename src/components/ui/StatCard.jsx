import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  className = '',
}) {
  const isPositive = change != null && change >= 0

  return (
    <div className={`bg-white border border-[#E5E7EB] rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[#6B7280]">{label}</span>
        {Icon && (
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-5 h-5 text-[#2563EB]" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[#111827]">{value}</span>
        {change != null && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium mb-1 ${
              isPositive ? 'text-[#059669]' : 'text-[#DC2626]'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  )
}
