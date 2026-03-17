import { cn } from '../../lib/utils'

const colorMap = {
  success: 'bg-green-100 text-[#059669]',
  warning: 'bg-yellow-100 text-[#D97706]',
  danger: 'bg-red-100 text-[#DC2626]',
  info: 'bg-blue-100 text-[#2563EB]',
  neutral: 'bg-gray-100 text-[#6B7280]',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorMap[variant] || colorMap.neutral,
        className
      )}
    >
      {children}
    </span>
  )
}
