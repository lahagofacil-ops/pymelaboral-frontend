import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-[#2563EB] hover:bg-[#1E40AF] text-white focus:ring-[#2563EB]',
  secondary: 'bg-white hover:bg-gray-50 text-[#111827] border border-[#E5E7EB] focus:ring-[#2563EB]',
  danger: 'bg-[#DC2626] hover:bg-red-700 text-white focus:ring-[#DC2626]',
  ghost: 'bg-transparent hover:bg-gray-100 text-[#6B7280] focus:ring-[#2563EB]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
