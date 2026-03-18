import { classNames } from '../../lib/utils'

const variantClasses = {
  neutral: 'bg-gray-100 text-gray-700',
  success: 'bg-green-50 text-[#059669]',
  warning: 'bg-amber-50 text-[#D97706]',
  danger: 'bg-red-50 text-[#DC2626]',
  info: 'bg-blue-50 text-[#2563EB]'
}

export default function Badge({ children, variant = 'neutral' }) {
  return (
    <span
      className={classNames(
        'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant]
      )}
    >
      {children}
    </span>
  )
}
