import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const variants = {
  primary: 'bg-[#2563EB] text-white hover:bg-[#1E40AF] focus:ring-[#2563EB]',
  secondary: 'bg-[#1E40AF] text-white hover:bg-[#1e3a8a] focus:ring-[#1E40AF]',
  outline: 'border border-[#E5E7EB] text-[#111827] bg-white hover:bg-gray-50 focus:ring-[#2563EB]',
  danger: 'bg-[#DC2626] text-white hover:bg-red-700 focus:ring-[#DC2626]',
  ghost: 'text-[#6B7280] bg-transparent hover:bg-gray-100 focus:ring-gray-300',
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
  loading: isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
