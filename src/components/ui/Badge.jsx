const colorClasses = {
  success: 'bg-green-50 text-[#059669] border-green-200',
  warning: 'bg-yellow-50 text-[#D97706] border-yellow-200',
  danger: 'bg-red-50 text-[#DC2626] border-red-200',
  info: 'bg-blue-50 text-[#2563EB] border-blue-200',
  neutral: 'bg-gray-50 text-[#6B7280] border-gray-200',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${colorClasses[variant] || colorClasses.neutral}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
