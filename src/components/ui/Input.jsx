import { cn } from '../../lib/utils'

export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}) {
  const inputId = id || props.name || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[#111827] mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-[#6B7280]" />
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'block w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#6B7280] transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent',
            'disabled:bg-gray-50 disabled:cursor-not-allowed',
            error && 'border-[#DC2626] focus:ring-[#DC2626]',
            Icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-[#DC2626]">{error}</p>
      )}
    </div>
  )
}
