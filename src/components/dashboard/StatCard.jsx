export function StatCard({ title, value, subtitle, icon: Icon, iconColor = 'text-[#1F4E79]' }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-gray-100 p-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
}
