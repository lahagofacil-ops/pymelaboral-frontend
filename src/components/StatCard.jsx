import { cn } from '../lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ icon: Icon, label, value, change, trend }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          {Icon && <Icon className="w-5 h-5 text-[#2563EB]" />}
        </div>
        {change != null && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              trend === 'up' ? 'text-[#059669]' : trend === 'down' ? 'text-[#DC2626]' : 'text-[#6B7280]'
            )}
          >
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-[#111827]">{value}</p>
      <p className="text-sm text-[#6B7280] mt-1">{label}</p>
    </div>
  )
}
