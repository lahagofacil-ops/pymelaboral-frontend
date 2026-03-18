import { classNames } from '../../lib/utils'

export default function StatCard({ icon: Icon, label, value, trend, className }) {
  return (
    <div className={classNames('bg-white border border-[#E5E7EB] rounded-xl p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6B7280]">{label}</p>
          <p className="text-2xl font-bold text-[#111827] mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-[#6B7280] mt-1">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className="bg-blue-50 rounded-lg p-3">
            <Icon className="h-6 w-6 text-[#2563EB]" />
          </div>
        )}
      </div>
    </div>
  )
}
